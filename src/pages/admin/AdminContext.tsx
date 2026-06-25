import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query,
  addDoc,
  getDocFromCache
} from 'firebase/firestore';
import { 
  Programme, 
  ProgrammeVideo, 
  Explainer, 
  ExplainerItem, 
  Briefing, 
  SiteSettings, 
  PartnerRequest, 
  NewsletterSubscriber 
} from '../../types';
import { seedProductionDatabase, repairClearPathProgrammesAndVideoLinks, seedCompleteVideosCatalog } from '../../lib/seeder';

const provider = new GoogleAuthProvider();

// Safe document getter that checks cache first (for instant loading & offline resilience) before doing a server request
async function getResilientDoc(docRef: any): Promise<any> {
  try {
    const cacheSnap = await getDocFromCache(docRef);
    if (cacheSnap.exists()) {
      return cacheSnap;
    }
  } catch (e) {
    // Expected on cache miss or unsupported environment, just fall back
    console.debug('Resilient doc cache-miss or offline: ', e);
  }
  return await getDoc(docRef);
}

// ==========================================
// 1. Standalone Permission Helpers
// ==========================================

export function isProtectedOwner(targetUser: any): boolean {
  if (!targetUser) return false;
  const email = (targetUser.email || '').toLowerCase().trim();
  return email === 'jerryagbedun@gmail.com';
}

export function canViewRoute(role: string, pathname: string): boolean {
  if (role === 'super_admin') return true;
  const cleanPath = pathname.replace(/\/$/, '') || '/admin';
  if (cleanPath === '/admin') return true;

  if (role === 'admin') {
    return !cleanPath.startsWith('/admin/users');
  }
  
  if (role === 'content_admin') {
    return (
      cleanPath.startsWith('/admin/programmes') ||
      cleanPath.startsWith('/admin/videos') ||
      cleanPath.startsWith('/admin/explainers') ||
      cleanPath.startsWith('/admin/briefing') ||
      cleanPath.startsWith('/admin/youtube-research')
    );
  }
  
  if (role === 'viewer_admin') {
    return !cleanPath.startsWith('/admin/users');
  }
  
  return false;
}

export async function logAdminAction(adminEmail: string, adminUid: string, action: string, targetEmail: string, details: any) {
  try {
    await addDoc(collection(db, 'adminAuditLogs'), {
      adminEmail,
      adminUid,
      action,
      targetEmail,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to write to adminAuditLogs: ", err);
  }
}

export interface AdminContextType {
  user: User | null;
  isAdminUser: boolean;
  userRole: string;
  effectiveRole: string;
  isSuperadmin: boolean;
  loading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  userDocData: any;
  
  // Collections
  programmes: Programme[];
  programmeVideos: ProgrammeVideo[];
  explainers: Explainer[];
  explainerItems: ExplainerItem[];
  briefings: Briefing[];
  siteSettings: SiteSettings | null;
  partnerRequests: PartnerRequest[];
  subscribers: NewsletterSubscriber[];
  contactMessages: any[];
  adminUsers: any[];
  
  // Actions
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  runSeeder: () => Promise<void>;
  runVideosSeeder: () => Promise<void>;
  handleSaveItem: (type: string, data: any) => Promise<void>;
  handleDeleteItem: (collectionName: string, docId: string) => Promise<void>;
  handleUpdateStatus: (collectionName: string, id: string, newStatus: string) => Promise<void>;
  handleUpdateSiteSettings: (settings: SiteSettings) => Promise<void>;
  refreshCollections: () => Promise<void>;

  // Action-specific Privilege Checkers
  canCreateAdmin: (targetRole: string) => boolean;
  canEditAdmin: (targetUser: any) => boolean;
  canDisableAdmin: (targetUser: any) => boolean;
  canEnableAdmin: (targetUser: any) => boolean;
  canDeleteAdmin: (targetUser: any) => boolean;
  canManageUsers: () => boolean;
  canManageSettings: () => boolean;
  canManageContent: () => boolean;
  canPublishContent: (targetUserDoc?: any) => boolean;
  canDeleteContent: () => boolean;
  canUseYouTubeResearch: () => boolean;
  isReadOnly: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('viewer_admin');
  const [userDocData, setUserDocData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Collections state
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [programmeVideos, setProgrammeVideos] = useState<ProgrammeVideo[]>([]);
  const [explainers, setExplainers] = useState<Explainer[]>([]);
  const [explainerItems, setExplainerItems] = useState<ExplainerItem[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  const effectiveRole = userRole;
  const isSuperadmin = effectiveRole === 'super_admin';

  // Auth Sync Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isJerry = currentUser.email?.toLowerCase() === 'jerryagbedun@gmail.com';
        if (isJerry) {
          setIsAdminUser(true);
          setUserRole('super_admin');
          setLoading(false);

          // Auto-repair Jerry's profile in the database
          try {
            const jerryDocId = 'jerryagbedun_gmail_com';
            const jerryRef = doc(db, 'users', jerryDocId);
            const jerryUidRef = doc(db, 'users', currentUser.uid);
            
            const jerrySnap = await getResilientDoc(jerryRef);
            const jerryUidSnap = await getResilientDoc(jerryUidRef);
            
            const expectedProfile = {
              uid: currentUser.uid,
              email: 'jerryagbedun@gmail.com',
              name: currentUser.displayName || 'Jerry Agbedun',
              displayName: currentUser.displayName || 'Jerry Agbedun',
              role: 'super_admin',
              status: 'active',
              isProtectedOwner: true,
              isSuperAdmin: true,
              permissions: {
                canManageUsers: true,
                canCreateAdmins: true,
                canEditAdmins: true,
                canDisableAdmins: true,
                canDeleteAdmins: true,
                canManageRoles: true,
                canManageSettings: true,
                canManageProgrammes: true,
                canManageVideos: true,
                canUseYouTubeResearch: true,
                canPublishContent: true,
                canDeleteContent: true
              },
              canCreateAdmins: true,
              canDeleteAdmins: true,
              canManageRoles: true,
              canManageVideos: true,
              canManageProgrammes: true,
              canManageForms: true,
              canManageSettings: true,
              canPublishContent: true,
              updatedAt: new Date().toISOString()
            };

            setUserDocData(expectedProfile);
            try {
              localStorage.setItem('cached_admin_profile', JSON.stringify({
                isAdmin: true,
                role: 'super_admin',
                userDocData: expectedProfile,
                timestamp: Date.now()
              }));
            } catch (errLocalStorage) {
              console.warn('Silent local storage fail: ', errLocalStorage);
            }

            // 1. Repair/create the email ref
            if (!jerrySnap.exists()) {
              await setDoc(jerryRef, {
                ...expectedProfile,
                id: jerryDocId,
                createdAt: new Date().toISOString()
              });
              console.log('Jerry email-based super admin profile created safely.');
            } else {
              const currentData = jerrySnap.data();
              if (
                currentData.role !== 'super_admin' || 
                currentData.status !== 'active' || 
                currentData.uid !== currentUser.uid ||
                !currentData.isProtectedOwner ||
                !currentData.permissions?.canManageUsers
              ) {
                await updateDoc(jerryRef, {
                  ...expectedProfile,
                  id: jerryDocId,
                  updatedAt: new Date().toISOString()
                });
                console.log('Jerry email-based super admin profile repaired safely.');
              }
            }

            // 2. Repair/create the UID ref (CRITICAL for Firestore Rule userExists() check)
            if (!jerryUidSnap.exists()) {
              await setDoc(jerryUidRef, {
                ...expectedProfile,
                id: currentUser.uid,
                createdAt: new Date().toISOString()
              });
              console.log('Jerry uid-based super admin profile created safely for security checks.');
            } else {
              const currentData = jerryUidSnap.data();
              if (
                currentData.role !== 'super_admin' || 
                currentData.status !== 'active' || 
                currentData.uid !== currentUser.uid ||
                !currentData.isProtectedOwner ||
                !currentData.permissions?.canManageUsers
              ) {
                await updateDoc(jerryUidRef, {
                  ...expectedProfile,
                  id: currentUser.uid,
                  updatedAt: new Date().toISOString()
                });
                console.log('Jerry uid-based super admin profile repaired safely.');
              }
            }
          } catch (er) {
            console.error('Error auto-creating or repairing Jerry profile:', er);
          }
        } else {
          // Regular user role check
          try {
            const emailClean = currentUser.email?.toLowerCase().trim() || '';
            const finalDocId = emailClean.replace(/[^a-zA-Z0-9]/g, '_');
            
            // 1. Check uid doc first
            let userDoc = await getResilientDoc(doc(db, 'users', currentUser.uid));
            
            // 2. Fall back to email doc if uid doc doesn't exist
            if (!userDoc.exists()) {
              // Try reading the direct email-based doc first
              let sourceDoc = await getResilientDoc(doc(db, 'users', emailClean));
              if (!sourceDoc.exists()) {
                // Fallback to legacy underscore-based doc
                sourceDoc = await getResilientDoc(doc(db, 'users', finalDocId));
              }
              
              if (sourceDoc.exists()) {
                const data = sourceDoc.data();
                // Retroactively sync/create uid doc
                const syncedData = {
                  ...data,
                  uid: currentUser.uid,
                  id: currentUser.uid,
                  updatedAt: new Date().toISOString()
                };
                try {
                  // Write both UID copy and ensure both direct email and legacy underscore keys exist and reference the UID
                  await setDoc(doc(db, 'users', currentUser.uid), syncedData);
                  await setDoc(doc(db, 'users', emailClean), { ...data, uid: currentUser.uid, id: emailClean, updatedAt: new Date().toISOString() });
                  await setDoc(doc(db, 'users', finalDocId), { ...data, uid: currentUser.uid, updatedAt: new Date().toISOString() });
                  console.log("Retroactively synced newly authorized admin to uid and email documents.");
                } catch (syncErr) {
                  console.warn("Could not sync uid document: ", syncErr);
                }
              }
            }
            
            // Re-read userDoc from db if synchronized
            userDoc = await getResilientDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
              userDoc = await getResilientDoc(doc(db, 'users', emailClean));
              if (!userDoc.exists()) {
                userDoc = await getResilientDoc(doc(db, 'users', finalDocId));
              }
            }

            if (userDoc.exists()) {
              const data = userDoc.data();
              const isBlocked = data.disabled === true || data.status === 'disabled';
              if (isBlocked) {
                setIsAdminUser(false);
                setUserRole('viewer_admin');
                setUserDocData(null);
                setAuthError('This administrator registry account has been locked or disabled.');
              } else {
                setIsAdminUser(true);
                setUserRole(data.role || 'viewer_admin');
                setUserDocData(data);
                
                // Cache user status for offline session recovery
                try {
                  localStorage.setItem('cached_admin_profile', JSON.stringify({
                    isAdmin: true,
                    role: data.role || 'viewer_admin',
                    userDocData: data,
                    timestamp: Date.now()
                  }));
                } catch (errLocalStorage) {
                  console.warn('Silent local storage fail: ', errLocalStorage);
                }
              }
            } else {
              // Not in database, not authorized
              setIsAdminUser(false);
              setUserRole('viewer_admin');
              setUserDocData(null);
              setAuthError('Access Denied: This account is not registered in the Operator Registry.');
            }
          } catch (e: any) {
            console.error('Check role error, trying cached backup:', e);
            const backup = localStorage.getItem('cached_admin_profile');
            if (backup) {
              try {
                const parsed = JSON.parse(backup);
                // Allow a generous offline/failover session valid for up to 7 days
                if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
                  setIsAdminUser(parsed.isAdmin);
                  setUserRole(parsed.role);
                  setUserDocData(parsed.userDocData);
                  setAuthError(null);
                  setLoading(false);
                  return;
                }
              } catch (_) {}
            }
            setIsAdminUser(false);
            setUserRole('viewer_admin');
            setUserDocData(null);
            setAuthError('Access Denied: verification check failed.');
          } finally {
            setLoading(false);
          }
        }
      } else {
        setIsAdminUser(false);
        setUserRole('viewer_admin');
        setUserDocData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state data whenever authorized & trigger increments
  useEffect(() => {
    if (isAdminUser) {
      fetchData();
    }
  }, [isAdminUser, refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Programmes
      const progSnap = await getDocs(collection(db, 'programmes'));
      let progList = progSnap.docs.map(d => ({ id: d.id, ...d.data() } as Programme));

      // Programme Videos
      const epSnap = await getDocs(collection(db, 'programmeVideos'));
      const epList = epSnap.docs.map(d => ({ id: d.id, ...d.data() } as ProgrammeVideo));

      const activeProgramsCount = progList.filter(p => p.status === 'active').length;
      if (activeProgramsCount === 0 && epList.length > 0) {
        console.log('0 active programmes found but videos exist. Running automatic repair...');
        await repairClearPathProgrammesAndVideoLinks();
        
        // Re-read programmes & videos
        const reProgSnap = await getDocs(collection(db, 'programmes'));
        progList = reProgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Programme));
        
        const reEpSnap = await getDocs(collection(db, 'programmeVideos'));
        setProgrammeVideos(reEpSnap.docs.map(d => ({ id: d.id, ...d.data() } as ProgrammeVideo)));
      } else {
        setProgrammeVideos(epList);
      }

      progList.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setProgrammes(progList);

      // Explainers
      const exSnap = await getDocs(collection(db, 'explainers'));
      const exList = exSnap.docs.map(d => ({ id: d.id, ...d.data() } as Explainer));
      exList.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setExplainers(exList);

      // Explainer Items
      const itemSnap = await getDocs(collection(db, 'explainerItems'));
      setExplainerItems(itemSnap.docs.map(d => ({ id: d.id, ...d.data() } as ExplainerItem)));

      // Briefings
      const bSnap = await getDocs(collection(db, 'briefings'));
      const bList = bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Briefing));
      bList.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setBriefings(bList);

      // Site Settings
      const settingsSnap = await getDocs(collection(db, 'siteSettings'));
      if (!settingsSnap.empty) {
        setSiteSettings({ id: settingsSnap.docs[0].id, ...settingsSnap.docs[0].data() } as SiteSettings);
      } else {
        const initialSettings: SiteSettings = {
          id: 'primary',
          siteName: 'ClearPath Media',
          siteTagline: 'Systems, Not Headlines',
          heroTitle: 'ClearPath Media',
          heroSubtitle: 'Public intelligence to interpret West African governance and policies without the noise.',
          heroVideoUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          heroVideoId: '3H95x0BV9nA',
          featuredProgrammeId: 'osita-insights',
          featuredExplainerId: 'explaining-nigeria',
          featuredBriefingId: '',
          youtubeChannelUrl: '',
          facebookUrl: '',
          instagramUrl: '',
          xUrl: '',
          tiktokUrl: '',
          contactEmail: 'contact@clearpath.media',
          partnershipEmail: 'partnerships@clearpath.media',
          newsletterTitle: 'Subscribe to the Daily Brief',
          newsletterDescription: 'A weekday morning briefing to understand deep system design inside civil policies.',
          footerText: '© 2026 ClearPath Media. All rights reserved.',
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'siteSettings', 'primary'), initialSettings);
        setSiteSettings(initialSettings);
      }

      // Partner requests
      const partnerSnap = await getDocs(collection(db, 'partnerRequests'));
      const partnerList = partnerSnap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
      partnerList.sort((a,b) => {
        const timeA = a && a.submittedAt && typeof a.submittedAt.toDate === 'function' ? a.submittedAt.toDate().getTime() : new Date(a.submittedAt || a.createdAt || 0).getTime();
        const timeB = b && b.submittedAt && typeof b.submittedAt.toDate === 'function' ? b.submittedAt.toDate().getTime() : new Date(b.submittedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setPartnerRequests(partnerList);

      // Subscribers
      const subSnap = await getDocs(collection(db, 'newsletterSubscribers'));
      setSubscribers(subSnap.docs.map(d => ({ id: d.id, ...d.data() } as NewsletterSubscriber)));

      // Contact Messages
      const contactMsgSnap = await getDocs(collection(db, 'contactMessages'));
      const contactMsgList = contactMsgSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      contactMsgList.sort((a,b) => {
        const timeA = a && a.submittedAt && typeof a.submittedAt.toDate === 'function' ? a.submittedAt.toDate().getTime() : new Date(a.submittedAt || a.createdAt || 0).getTime();
        const timeB = b && b.submittedAt && typeof b.submittedAt.toDate === 'function' ? b.submittedAt.toDate().getTime() : new Date(b.submittedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setContactMessages(contactMsgList);

      // Admins
      const administratorsSnap = await getDocs(query(collection(db, 'users')));
      const rawUsers = administratorsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      
      // Auto-migrate legacy entries (converting user_domain_com keys to direct email keys)
      const uEmailClean = user?.email?.toLowerCase().trim() || '';
      const isPrivilegedAdmin = uEmailClean === 'jerryagbedun@gmail.com' || userRole === 'super_admin';
      
      if (isPrivilegedAdmin) {
        for (const u of rawUsers) {
          if (!u.email) continue;
          const uEmailCleanVal = u.email.toLowerCase().trim();
          const uLegacyId = uEmailCleanVal.replace(/[^a-zA-Z0-9]/g, '_');
          
          if (u.id === uLegacyId) {
            // Check if the direct-email document exists
            const hasDirectDoc = rawUsers.some(existingUser => existingUser.id === uEmailCleanVal);
            if (!hasDirectDoc) {
              console.log(`Auto-repairing legacy registry document for ${u.email}`);
              try {
                await setDoc(doc(db, 'users', uEmailCleanVal), {
                  ...u,
                  id: uEmailCleanVal,
                  updatedAt: new Date().toISOString()
                });
              } catch (migrateErr) {
                console.warn(`Failed to auto-migrate ${u.email}: `, migrateErr);
              }
            }
          }
        }
      }

      const deduplicatedMap = new Map<string, any>();
      for (const u of rawUsers) {
        if (!u.email) continue;
        const normEmail = u.email.toLowerCase().trim();
        const existing = deduplicatedMap.get(normEmail);
        if (!existing) {
          deduplicatedMap.set(normEmail, u);
        } else {
          const merged = { ...existing, ...u };
          if (u.uid) merged.uid = u.uid;
          if (u.id && u.id.includes('_')) merged.id = u.id; // Prefer email-key as id for deletion if possible
          if (u.role && u.role !== 'viewer_admin') merged.role = u.role;
          if (u.disabled === true || existing.disabled === true) {
            merged.disabled = true;
            merged.status = 'disabled';
          }
          deduplicatedMap.set(normEmail, merged);
        }
      }
      setAdminUsers(Array.from(deduplicatedMap.values()));
    } catch (e) {
      console.error("Error fetching admin data: ", e);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      setAuthError(e.message || 'Authentication failed.');
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      console.error('Email Auth Error: ', e);
      let errMsg = e.message || 'Authentication failed.';
      if (e.code === 'auth/email-already-in-use') {
        errMsg = 'The email address is already in use.';
      } else if (e.code === 'auth/weak-password') {
        errMsg = 'The password must be at least 6 characters.';
      } else if (e.code === 'auth/invalid-credential') {
        errMsg = 'Incorrect email or password.';
      }
      setAuthError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const runSeeder = async () => {
    setLoading(true);
    try {
      await seedProductionDatabase(
        auth.currentUser?.uid || 'bootstrapped_user',
        auth.currentUser?.email || 'jerryagbedun@gmail.com',
        auth.currentUser?.displayName || 'Administrator'
      );
      await seedCompleteVideosCatalog();
      await repairClearPathProgrammesAndVideoLinks();
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error('Seeder failed: ', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const runVideosSeeder = async () => {
    setLoading(true);
    try {
      await seedCompleteVideosCatalog();
      await repairClearPathProgrammesAndVideoLinks();
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error('Videos Seeder failed: ', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Privilege Checkers
  // ==========================================

  const isReadOnly = () => {
    return userRole === 'viewer_admin';
  };

  const canManageUsers = () => {
    return userRole === 'super_admin';
  };

  const canCreateAdmin = (targetRole: string) => {
    if (userRole !== 'super_admin') return false;
    return ['super_admin', 'admin', 'content_admin', 'viewer_admin'].includes(targetRole);
  };

  const canEditAdmin = (targetUser: any) => {
    if (userRole !== 'super_admin') return false;
    if (!targetUser) return false;
    
    // Safety check: only Jerry can edit Jerry.
    const isTargetJerry = isProtectedOwner(targetUser);
    const isCurrentJerry = user?.email?.toLowerCase() === 'jerryagbedun@gmail.com';
    if (isTargetJerry && !isCurrentJerry) return false;

    return true;
  };

  const canDisableAdmin = (targetUser: any) => {
    if (userRole !== 'super_admin') return false;
    if (!targetUser) return false;
    
    // Safety check: No locking of Jerry!
    if (isProtectedOwner(targetUser)) return false;

    // Safety check: Cannot self-lock!
    if (targetUser.uid === user?.uid || targetUser.email?.toLowerCase() === user?.email?.toLowerCase()) {
      return false;
    }
    
    return true;
  };

  const canEnableAdmin = (targetUser: any) => {
    if (userRole !== 'super_admin') return false;
    if (!targetUser) return false;
    return true;
  };

  const canDeleteAdmin = (targetUser: any) => {
    if (userRole !== 'super_admin') return false;
    if (!targetUser) return false;

    // Safety check: No deletion of Jerry!
    if (isProtectedOwner(targetUser)) return false;

    // Safety check: Cannot self-delete!
    if (targetUser.uid === user?.uid || targetUser.email?.toLowerCase() === user?.email?.toLowerCase()) {
      return false;
    }

    return true;
  };

  const canManageSettings = () => {
    return userRole === 'super_admin' || userRole === 'admin';
  };

  const canManageContent = () => {
    return ['super_admin', 'admin', 'content_admin'].includes(userRole);
  };

  const canPublishContent = (targetUserDoc?: any) => {
    if (userRole === 'super_admin' || userRole === 'admin') return true;
    if (userRole === 'content_admin') {
      const docToCheck = targetUserDoc || userDocData;
      return !!docToCheck?.canPublishContent;
    }
    return false;
  };

  const canDeleteContent = () => {
    return userRole === 'super_admin' || userRole === 'admin';
  };

  const canUseYouTubeResearch = () => {
    return ['super_admin', 'admin', 'content_admin'].includes(userRole);
  };

  const handleSaveItem = async (type: string, data: any) => {
    if (isReadOnly()) {
      alert('Access Denied: Read-only viewers are not allowed to submit modifications.');
      return;
    }
    
    if (type === 'users') {
      if (!canManageUsers()) {
        alert('Access denied: Only Super Administrators can manage administrators.');
        return;
      }
      
      const targetEmail = (data.email || '').toLowerCase().trim();
      
      // Safety checks:
      const targetUserObj = { email: targetEmail, uid: data.uid };
      if (isProtectedOwner(targetUserObj)) {
        const isCurrentJerry = user?.email?.toLowerCase() === 'jerryagbedun@gmail.com';
        if (!isCurrentJerry) {
          alert('Access Denied: Founder account brand is protected and cannot be edited by other administrators.');
          return;
        }
      }
      
      // Prevent demoting of Jerry!
      if (targetEmail === 'jerryagbedun@gmail.com') {
        data.role = 'super_admin';
        data.status = 'active';
        data.disabled = false;
        data.isProtectedOwner = true;
        data.isSuperAdmin = true;
      }
      
      // Target checks on disabling/locking self
      if (data.email?.toLowerCase().trim() === user?.email?.toLowerCase()) {
        if (data.status === 'disabled' || data.disabled === true) {
          alert('Safety lock: You cannot disable your own active administrator account.');
          return;
        }
        if (data.role !== 'super_admin') {
          alert('Safety lock: You cannot demote yourself from Super Admin role.');
          return;
        }
      }
    } else {
      // Content save checks
      if (!canManageContent()) {
        alert('Access Denied: Your administrator role prefix does not permit content management.');
        return;
      }
      
      // Publish vs save draft checks
      const isPublishing = data.status === 'published' || data.status === 'active';
      if (isPublishing && !canPublishContent()) {
        alert('Access Denied: You do not have permissions to publish content assets. Please save as a draft or inactive status.');
        return;
      }
    }

    setLoading(true);
    try {
      let documentId = data.id || data.slug || data.uid;

      if (type === 'users') {
        if (!data.email) {
          alert('Email is required for creating an administrator.');
          setLoading(false);
          return;
        }
        data.email = data.email.toLowerCase().trim();
        documentId = data.email;
      }

      // Autocomplete YouTube parameters
      const getVideoIdFromUrl = (url: string): string => {
        if (!url) return '';
        try {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : '';
        } catch {
          return '';
        }
      };

      if (data.youtubeUrl && !data.youtubeVideoId) {
        data.youtubeVideoId = getVideoIdFromUrl(data.youtubeUrl);
        if (data.youtubeVideoId && !data.thumbnailUrl) {
          data.thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeVideoId}/maxresdefault.jpg`;
        }
      }

      if (!documentId) {
        const autoSlug = (data.title || 'item')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        documentId = autoSlug + '-' + Math.floor(Math.random() * 1000);
      }

      const cleanData = { ...data };
      if (!cleanData.id && type !== 'users') {
        cleanData.id = documentId;
      }
      cleanData.updatedAt = new Date().toISOString();
      if (!cleanData.createdAt) {
        cleanData.createdAt = new Date().toISOString();
      }

      // Perform write
      await setDoc(doc(db, type, documentId), cleanData);
      if (type === 'users') {
        const emailKey = data.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
        if (emailKey !== documentId) {
          await setDoc(doc(db, 'users', emailKey), cleanData);
        }
        if (cleanData.uid) {
          await setDoc(doc(db, 'users', cleanData.uid), { ...cleanData, id: cleanData.uid });
        }
      }

      // Log for audit
      if (type === 'users') {
        const isNewUser = !data.uid && !data.id;
        const actionType = isNewUser ? 'create' : 'edit';
        await logAdminAction(
          user?.email || '',
          user?.uid || '',
          `${actionType}_admin`,
          data.email || '',
          { role: data.role, status: data.status, name: data.name }
        );
      } else {
        const isNew = !data.id;
        await logAdminAction(
          user?.email || '',
          user?.uid || '',
          `${isNew ? 'create' : 'edit'}_${type}`,
          'system',
          { id: data.id || data.slug || 'unknown', title: data.title || 'unnamed' }
        );
      }

      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `${type}/${data.id || data.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (collectionName: string, docId: string) => {
    if (isReadOnly()) {
      alert('Access Denied: Read-only viewers are not allowed to delete resources.');
      return;
    }
    
    if (collectionName === 'users') {
      if (!canManageUsers()) {
        alert('Access denied: Only Super Administrators can remove administrators.');
        return;
      }
      
      const userRef = doc(db, 'users', docId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const targetData = userSnap.data();
        const targetUserObj = { email: targetData.email, uid: targetData.uid };
        
        if (isProtectedOwner(targetUserObj)) {
          alert('Safety Lockout: The founder account cannot be deleted under any circumstances.');
          return;
        }
        
        if (targetData.uid === user?.uid || targetData.email?.toLowerCase() === user?.email?.toLowerCase()) {
          alert('Safety Lockout: You cannot delete your own active operator account.');
          return;
        }
        
        if (!confirm('Are you sure you want to delete this administrator account permanently?')) return;
        setLoading(true);
        try {
          await deleteDoc(userRef);
          
          // Delete secondary key references to be perfectly clean
          if (targetData.uid && targetData.uid !== docId) {
            await deleteDoc(doc(db, 'users', targetData.uid));
          }
          const emailKey = targetData.email ? targetData.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_') : '';
          if (emailKey && emailKey !== docId) {
            await deleteDoc(doc(db, 'users', emailKey));
          }
          
          await logAdminAction(
            user?.email || '',
            user?.uid || '',
            'delete_admin',
            targetData.email || '',
            { name: targetData.name }
          );
          setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
          handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (!canDeleteContent()) {
        alert('Access Denied: Your administrator role prefix does not permit content deletion.');
        return;
      }
      
      if (!confirm('Are you sure you want to delete this content item permanently?')) return;
      setLoading(true);
      try {
        await deleteDoc(doc(db, collectionName, docId));
        await logAdminAction(
          user?.email || '',
          user?.uid || '',
          `delete_${collectionName}`,
          'system',
          { id: docId }
        );
        setRefreshTrigger(prev => prev + 1);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (collectionName: string, id: string, newStatus: string) => {
    if (isReadOnly()) {
      alert('Access Denied: Read-only viewers cannot toggle publish status.');
      return;
    }
    
    // Content status changes vs Admin profile status changes
    if (collectionName === 'users') {
      alert('Access Denied: Please use the admin user-management panel to edit status.');
      return;
    }

    if (newStatus === 'published' && !canPublishContent()) {
      alert('Access Denied: You do not have permissions to publish content assets.');
      return;
    }

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { status: newStatus, updatedAt: new Date().toISOString() });
      
      // Log update action
      await logAdminAction(
        user?.email || '',
        user?.uid || '',
        `update_status_${collectionName}`,
        'system',
        { id, status: newStatus }
      );

      // Update local state immediately
      if (collectionName === 'partnerRequests') {
        setPartnerRequests(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } else if (collectionName === 'newsletterSubscribers') {
        setSubscribers(prev => prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
      } else if (collectionName === 'contactMessages') {
        setContactMessages(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const handleUpdateSiteSettings = async (settings: SiteSettings) => {
    if (!canManageSettings()) {
      alert('Access Denied: Your administrator role prefix does not permit updating site settings.');
      return;
    }
    setLoading(true);
    try {
      const getVideoIdFromUrl = (url: string): string => {
        if (!url) return '';
        try {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : '';
        } catch {
          return '';
        }
      };

      settings.heroVideoId = getVideoIdFromUrl(settings.heroVideoUrl) || settings.heroVideoId;
      settings.updatedAt = new Date().toISOString();
      await setDoc(doc(db, 'siteSettings', 'primary'), settings);
      
      await logAdminAction(
        user?.email || '',
        user?.uid || '',
        'update_site_settings',
        'system',
        { siteName: settings.siteName }
      );

      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/primary');
    } finally {
      setLoading(false);
    }
  };

  const refreshCollections = async () => {
    setRefreshTrigger(p => p + 1);
  };

  return (
    <AdminContext.Provider value={{
      user,
      isAdminUser,
      userRole,
      effectiveRole,
      isSuperadmin,
      loading,
      authError,
      setAuthError,
      userDocData,
      
      programmes,
      programmeVideos,
      explainers,
      explainerItems,
      briefings,
      siteSettings,
      partnerRequests,
      subscribers,
      contactMessages,
      adminUsers,
      
      loginWithGoogle,
      loginWithEmail,
      logout,
      runSeeder,
      runVideosSeeder,
      handleSaveItem,
      handleDeleteItem,
      handleUpdateStatus,
      handleUpdateSiteSettings,
      refreshCollections,

      canCreateAdmin,
      canEditAdmin,
      canDisableAdmin,
      canEnableAdmin,
      canDeleteAdmin,
      canManageUsers,
      canManageSettings,
      canManageContent,
      canPublishContent,
      canDeleteContent,
      canUseYouTubeResearch,
      isReadOnly
    }}>
      {children}
    </AdminContext.Provider>
  );
}
