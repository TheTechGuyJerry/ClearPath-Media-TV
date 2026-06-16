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
  query 
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
import { seedProductionDatabase, repairClearPathProgrammesAndVideoLinks } from '../../lib/seeder';

const provider = new GoogleAuthProvider();

export interface AdminContextType {
  user: User | null;
  isAdminUser: boolean;
  userRole: string;
  effectiveRole: string;
  isSuperadmin: boolean;
  loading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  
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
  handleSaveItem: (type: string, data: any) => Promise<void>;
  handleDeleteItem: (collectionName: string, docId: string) => Promise<void>;
  handleUpdateStatus: (collectionName: string, id: string, newStatus: string) => Promise<void>;
  handleUpdateSiteSettings: (settings: SiteSettings) => Promise<void>;
  refreshCollections: () => Promise<void>;
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
  const [userRole, setUserRole] = useState<string>('viewer');
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
            const jerrySnap = await getDoc(jerryRef);
            
            const expectedProfile = {
              uid: currentUser.uid,
              email: 'jerryagbedun@gmail.com',
              name: currentUser.displayName || 'Jerry Agbedun',
              role: 'super_admin',
              status: 'active',
              canCreateAdmins: true,
              canDeleteAdmins: true,
              canManageRoles: true,
              canManageVideos: true,
              canManageProgrammes: true,
              canManageForms: true,
              canManageSettings: true,
              updatedAt: new Date().toISOString()
            };

            if (!jerrySnap.exists()) {
              await setDoc(jerryRef, {
                ...expectedProfile,
                createdAt: new Date().toISOString()
              });
              console.log('Jerry super admin profile created safely.');
            } else {
              const currentData = jerrySnap.data();
              if (
                currentData.role !== 'super_admin' || 
                currentData.status !== 'active' || 
                currentData.uid !== currentUser.uid ||
                !currentData.canCreateAdmins
              ) {
                await updateDoc(jerryRef, {
                  role: 'super_admin',
                  status: 'active',
                  uid: currentUser.uid,
                  canCreateAdmins: true,
                  canDeleteAdmins: true,
                  canManageRoles: true,
                  canManageVideos: true,
                  canManageProgrammes: true,
                  canManageForms: true,
                  canManageSettings: true,
                  updatedAt: new Date().toISOString()
                });
                console.log('Jerry super admin profile repaired safely.');
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
            const userDoc = await getDoc(doc(db, 'users', finalDocId));
            
            if (userDoc.exists()) {
              const data = userDoc.data();
              const isBlocked = data.disabled === true || data.status === 'disabled';
              if (isBlocked) {
                setIsAdminUser(false);
                setUserRole('viewer');
                setAuthError('This administrator registry account has been locked or disabled.');
              } else {
                setIsAdminUser(true);
                setUserRole(data.role || 'viewer');
              }
            } else {
              // Not in database, not authorized
              setIsAdminUser(false);
              setUserRole('viewer');
            }
          } catch (e: any) {
            console.error('Check role error: ', e);
            setIsAdminUser(false);
            setUserRole('viewer');
          } finally {
            setLoading(false);
          }
        }
      } else {
        setIsAdminUser(false);
        setUserRole('viewer');
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
          siteName: 'Clearpath Media',
          siteTagline: 'Systems, Not Headlines',
          heroTitle: 'Clearpath Media',
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
          footerText: '© 2026 Clearpath Media. All rights reserved.',
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
      setAdminUsers(administratorsSnap.docs.map(d => d.data()));
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
      await repairClearPathProgrammesAndVideoLinks();
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error('Seeder failed: ', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (type: string, data: any) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to submit modifications.');
      return;
    }
    if (type === 'users' && effectiveRole !== 'super_admin') {
      alert('Access denied: Only Super Administrators can create/modify administrators.');
      return;
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
        documentId = data.email.replace(/[^a-zA-Z0-9]/g, '_');
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

      await setDoc(doc(db, type, documentId), cleanData);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `${type}/${data.id || data.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (collectionName: string, docId: string) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to delete resources.');
      return;
    }
    if (collectionName === 'users' && effectiveRole !== 'super_admin') {
      alert('Access denied: Only Super Administrators can remove administrators.');
      return;
    }
    if (!confirm('Are you sure you want to delete this record permanently?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (collectionName: string, id: string, newStatus: string) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot toggle publish status.');
      return;
    }
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { status: newStatus, updatedAt: new Date().toISOString() });
      
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
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot update site settings.');
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
      handleSaveItem,
      handleDeleteItem,
      handleUpdateStatus,
      handleUpdateSiteSettings,
      refreshCollections
    }}>
      {children}
    </AdminContext.Provider>
  );
}
