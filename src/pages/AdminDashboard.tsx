import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  where,
  updateDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  db, 
  auth, 
  storage, 
  OperationType, 
  handleFirestoreError 
} from '../lib/firebase';
import { 
  Programme, 
  ProgrammeVideo, 
  Explainer, 
  ExplainerItem, 
  Briefing, 
  SiteSettings, 
  PartnerRequest, 
  NewsletterSubscriber,
  UserProfile
} from '../types';
import { 
  LayoutDashboard, 
  Tv, 
  BookOpen, 
  Settings, 
  Users, 
  Mail, 
  LogOut, 
  LogIn, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Database, 
  CheckCircle, 
  X, 
  Upload, 
  HelpCircle,
  FileText,
  Search,
  MessageSquare
} from 'lucide-react';
import CMSForm from '../components/admin/CMSForm';
import { seedProductionDatabase, repairClearPathProgrammesAndVideoLinks } from '../lib/seeder';
import YoutubeResearchPanel from '../components/admin/YoutubeResearchPanel';

const provider = new GoogleAuthProvider();

const formatFirebaseDate = (dateVal: any): string => {
  if (!dateVal) return 'Not available';
  if (typeof dateVal === 'string' && (dateVal.trim() === '' || dateVal.toLowerCase().includes('invalid'))) {
    return 'Not available';
  }
  
  // 1. If it's a Firestore Timestamp (has toDate function)
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
    } catch (e) {
      // fallback
    }
  }

  // 2. If it's a timestamp object without .toDate but with seconds/nanoseconds
  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toLocaleDateString();
    } catch (e) {
      // fallback
    }
  }

  // 2b. If it has serialized _seconds
  if (dateVal && typeof dateVal._seconds === 'number') {
    try {
      return new Date(dateVal._seconds * 1000).toLocaleDateString();
    } catch (e) {
      // fallback
    }
  }

  // 3. Try parsing as a general string or number (ISO string, unix epoch, etc.)
  try {
    const parsedDate = new Date(dateVal);
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate.toLocaleDateString();
    }
  } catch (e) {
    // fallback
  }

  return 'Not available';
};

const getProspectName = (r: any) => r.fullName || r.name || r.prospectName || 'Not available';
const getCorporateEntity = (r: any) => r.organisation || r.organization || r.corporateEntity || 'Not available';
const getContact = (r: any) => {
  const email = r.workEmail || r.email || r.contact || '';
  return email.trim() !== '' ? email.trim() : 'Not available';
};
const getPartnershipInterest = (r: any) => r.partnershipInterest || r.partnershipType || r.interest || 'Not available';
const getKeyMessage = (r: any) => r.additionalInformation || r.message || r.keyMessage || 'Not available';
const getJobTitle = (r: any) => r.jobTitle || r.jobRole || r.role || r.jobTitleRole || r.designation || 'Not available';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'super_admin' | 'editor' | 'viewer'>('viewer');

  const effectiveRole = user?.email?.toLowerCase() === 'jerryagbedun@gmail.com' ? 'super_admin' : userRole;
  const isSuperadmin = effectiveRole === 'super_admin' || user?.email?.toLowerCase() === 'jerryagbedun@gmail.com';

  // Email/Password login/registration state
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Core CMS state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  const [selectedExplainerId, setSelectedExplainerId] = useState<string | null>(null);

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

  // Selection states for Modals/Forms
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<{ type: string; data: any } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Program / Explainer specific tab states ('profile' | 'items')
  const [progSubTab, setProgSubTab] = useState<'profile' | 'videos'>('profile');
  const [explSubTab, setExplSubTab] = useState<'profile' | 'items'>('profile');

  // Video Management Section States
  const [videoSearchTerm, setVideoSearchTerm] = useState<string>('');
  const [videoSelectedProgId, setVideoSelectedProgId] = useState<string>('all');
  const [videoInlineEditId, setVideoInlineEditId] = useState<string | null>(null);
  const [videoInlineData, setVideoInlineData] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isJerry = currentUser.email?.toLowerCase() === 'jerryagbedun@gmail.com';
        if (isJerry) {
          setIsAdminUser(true);
          setUserRole('super_admin');
        } else {
          try {
            // Check both by uid AND by email
            const emailQuery = query(collection(db, 'users'), where('email', '==', currentUser.email?.toLowerCase()));
            const userSnap = await getDocs(emailQuery);
            if (!userSnap.empty) {
              const matchedUserData = userSnap.docs[0].data();
              
              if (matchedUserData.status === 'disabled' || matchedUserData.disabled === true) {
                setIsAdminUser(false);
                setAuthError('Access denied: This administrator account has been disabled.');
                setLoading(false);
                return;
              }

              const r = matchedUserData.role;
              if (r === 'super_admin' || r === 'admin' || r === 'editor' || r === 'viewer') {
                setIsAdminUser(true);
                setUserRole(r === 'admin' ? 'super_admin' : r);
                const matchedDoc = userSnap.docs[0];
                if (matchedDoc.data().uid !== currentUser.uid) {
                  await updateDoc(doc(db, 'users', matchedDoc.id), { uid: currentUser.uid });
                }
              } else {
                setIsAdminUser(false);
                setAuthError('Access denied: You do not have an authorizing role assigned.');
              }
            } else {
              setIsAdminUser(false);
              setAuthError('Access denied: You are not registered as an administrator.');
            }
          } catch (err) {
            console.error('Error verifying admin: ', err);
            setIsAdminUser(false);
          }
        }
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const login = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      setAuthError(e.message || 'Authentication failed.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput) {
      setAuthError('Please enter email and password.');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setEmailInput('');
      setPasswordInput('');
      setNameInput('');
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
    const confirmMsg = 'Are you sure you want to run the ClearPath Catalog Seed? This will safely seed default programmes, explainers, and base siteSettings into your Firestore database.';
    if (!confirm(confirmMsg)) return;
    setLoading(true);
    try {
      await seedProductionDatabase(
        auth.currentUser?.uid || 'bootstrapped_user',
        auth.currentUser?.email || 'jerryagbedun@gmail.com',
        auth.currentUser?.displayName || 'Administrator'
      );
      
      // Immediately run the repair & verification mapping
      const { repairedProgrammesCount, repairedVideosCount } = await repairClearPathProgrammesAndVideoLinks();
      
      alert(`ClearPath Catalog seeded successfully! ${repairedProgrammesCount} programmes repaired and ${repairedVideosCount} verified video relationships updated. Please review AI-Discovered YouTube Videos if you need to load references!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      alert('Error seeding database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditInit = (type: string, data: any = {}) => {
    let initialData = { ...data };
    
    if (!data.id && type === 'briefings') {
      initialData = {
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        briefingType: 'daily',
        presenter: 'Annabel K.',
        youtubeUrl: '',
        youtubeVideoId: '',
        thumbnailUrl: '',
        featuredImage: '',
        keyPoints: '',
        sourceLinks: '',
        topicTags: [],
        coverageArea: 'Nigeria & Africa',
        status: 'published',
        isFeatured: false,
        publishedAt: new Date().toISOString().split('T')[0],
        seoTitle: '',
        seoDescription: '',
        ...data
      };
    } else if (!data.id && type === 'programmeVideos') {
      initialData = {
        programmeId: selectedProgrammeId || programmes[0]?.id || '',
        title: '',
        slug: '',
        shortSummary: '',
        fullDescription: '',
        youtubeUrl: '',
        youtubeVideoId: '',
        thumbnailUrl: '',
        duration: '00:00',
        presenters: '',
        guests: '',
        transcript: '',
        keyPoints: '',
        sourceLinks: '',
        topicTags: [],
        coverageArea: 'Nigeria',
        status: 'published',
        isFeatured: false,
        publishedAt: new Date().toISOString().split('T')[0],
        seoTitle: '',
        seoDescription: '',
        ...data
      };
    } else if (!data.id && type === 'explainerItems') {
      initialData = {
        explainerId: selectedExplainerId || explainers[0]?.id || '',
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        explainerType: 'video',
        youtubeUrl: '',
        youtubeVideoId: '',
        thumbnailUrl: '',
        featuredImage: '',
        transcript: '',
        keyQuestions: '',
        keyPoints: '',
        sourceLinks: '',
        relatedDocuments: [],
        topicTags: [],
        coverageArea: 'Nigeria',
        status: 'published',
        isFeatured: false,
        publishedAt: new Date().toISOString().split('T')[0],
        seoTitle: '',
        seoDescription: '',
        ...data
      };
    } else if (!data.id && type === 'programmes') {
      initialData = {
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        tagline: '',
        hostName: '',
        formatType: 'interview',
        coverageArea: 'Nigeria',
        topicFocus: [],
        scheduleText: '',
        youtubePlaylistUrl: '',
        coverImage: '',
        thumbnailImage: '',
        status: 'active',
        isFeatured: false,
        sortOrder: programmes.length + 1,
        seoTitle: '',
        seoDescription: '',
        ...data
      };
    } else if (!data.id && type === 'explainers') {
      initialData = {
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        tagline: '',
        coverageArea: 'Nigeria',
        topicFocus: [],
        coverImage: '',
        thumbnailImage: '',
        status: 'active',
        isFeatured: false,
        sortOrder: explainers.length + 1,
        seoTitle: '',
        seoDescription: '',
        ...data
      };
    } else if (!data.id && type === 'users') {
      initialData = {
        uid: '',
        email: '',
        name: '',
        role: 'admin',
        createdAt: new Date().toISOString(),
        ...data
      };
    }

    setEditingItem({ type, data: initialData });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to submit modifications.');
      return;
    }

    const { type, data } = editingItem;
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
      if (data.youtubeUrl && !data.youtubeVideoId) {
        data.youtubeVideoId = getVideoIdFromUrl(data.youtubeUrl);
        if (data.youtubeVideoId && !data.thumbnailUrl) {
          data.thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeVideoId}/maxresdefault.jpg`;
        }
      }

      if (!documentId) {
        // Fallback generator
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
      alert('Saved record successfully!');
      setEditingItem(null);
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
    if (!confirm('Are you sure you want to delete this dynamically loaded record permanently?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      alert('Deleted successfully.');
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
      
      // Update active detail modal state if currently viewed
      if (selectedDetail && selectedDetail.data.id === id) {
        setSelectedDetail(prev => prev ? { ...prev, data: { ...prev.data, status: newStatus } } : null);
      }
      
      alert('Status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const handleUpdateSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot update site settings.');
      return;
    }
    setLoading(true);

    try {
      siteSettings.heroVideoId = getVideoIdFromUrl(siteSettings.heroVideoUrl) || siteSettings.heroVideoId;
      siteSettings.updatedAt = new Date().toISOString();
      await setDoc(doc(db, 'siteSettings', 'primary'), siteSettings);
      alert('Homepage layout parameters updated successfully!');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/primary');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="font-sans font-medium text-primary text-sm tracking-wide">Syncing CMS workspace...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (!user || !isAdminUser) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-outline-variant p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-display font-semibold text-2xl text-primary mb-1">Clearpath Media</h1>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold font-mono">CMS Administrator login</p>
          </div>

          {authError && (
            <div className="mb-6 bg-error/10 border-l-4 border-error p-4 text-xs font-semibold text-error rounded-sm flex items-start gap-2">
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)} 
                  placeholder="e.g. Jerry Admin" 
                  className="w-full px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
                />
              </div>
            )}
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                placeholder="operator@clearpath.media" 
                className="w-full px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary-container font-semibold py-3 rounded text-sm transition-colors cursor-pointer"
            >
              LOG IN
            </button>
          </form>

          <div className="relative my-6 text-center border-b border-outline-variant pb-2">
            <span className="bg-white px-3 text-xs text-on-surface-variant font-semibold absolute -top-2 left-1/2 -translate-x-1/2 uppercase font-mono">OR</span>
          </div>

          <button 
            onClick={login}
            className="w-full border border-outline-variant hover:bg-surface-container-high font-semibold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4 text-primary" /> SIGN IN WITH GOOGLE
          </button>
        </div>
      </div>
    );
  }

  // Active Programme/Explainer selections
  const currentProg = programmes.find(p => p.id === selectedProgrammeId);
  const currentExpl = explainers.find(e => e.id === selectedExplainerId);

  return (
    <div className="min-h-screen bg-surface-container-low flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary text-white shrink-0 flex flex-col border-r border-outline-variant">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-secondary-container" />
          <div>
            <h1 className="font-headline-sm font-bold tracking-wide text-white">CMS Workspace</h1>
            <p className="text-[10px] uppercase text-white/50 tracking-widest font-mono">Clearpath Control</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setEditingItem(null); setSelectedProgrammeId(null); setSelectedExplainerId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Console Home</span>
            </button>
          </div>

          {/* Programmes category */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-white/40 px-3 text-[10px] uppercase tracking-wider font-bold">
              <span>Programmes</span>
              <button onClick={() => { handleEditInit('programmes'); setActiveTab('form'); }} className="hover:text-white p-0.5 cursor-pointer" title="Add New Programme">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5 pt-1 border-l border-white/10 ml-2 pl-2">
              {programmes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveTab('programme-detail'); setSelectedProgrammeId(p.id); setEditingItem(null); }}
                  className={`w-full text-left truncate block px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                    activeTab === 'programme-detail' && selectedProgrammeId === p.id 
                      ? 'bg-white/10 font-medium text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.title}
                </button>
              ))}
              {programmes.length === 0 && (
                <span className="text-[10px] text-white/30 italic block px-2.5 py-1">No programmes loaded</span>
              )}
            </div>
          </div>

          {/* All Programme Videos shortcut */}
          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('programme-videos'); setEditingItem(null); setSelectedProgrammeId(null); setSelectedExplainerId(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'programme-videos' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tv className="w-4 h-4 text-secondary-container" />
                <span>Programme Videos</span>
              </div>
              {programmeVideos.length > 0 && (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {programmeVideos.length}
                </span>
              )}
            </button>
          </div>

          {/* Explainers category */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-white/40 px-3 text-[10px] uppercase tracking-wider font-bold">
              <span>Explainers</span>
              <button onClick={() => { handleEditInit('explainers'); setActiveTab('form'); }} className="hover:text-white p-0.5 cursor-pointer" title="Add New Explainer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5 pt-1 border-l border-white/10 ml-2 pl-2">
              {explainers.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => { setActiveTab('explainer-detail'); setSelectedExplainerId(ex.id); setEditingItem(null); }}
                  className={`w-full text-left truncate block px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                    activeTab === 'explainer-detail' && selectedExplainerId === ex.id 
                      ? 'bg-white/10 font-medium text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
              {explainers.length === 0 && (
                <span className="text-[10px] text-white/30 italic block px-2.5 py-1">No explainers loaded</span>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-white/10">
            <button
              onClick={() => { setActiveTab('briefings'); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'briefings' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Briefings</span>
              </div>
              {briefings.length > 0 && (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {briefings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('partnerRequests'); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'partnerRequests' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Partnerships</span>
              </div>
              {partnerRequests.length > 0 && (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {partnerRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('subscribers'); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'subscribers' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Subscribers</span>
              </div>
              {subscribers.length > 0 && (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {subscribers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('contactMessages'); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'contactMessages' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              {contactMessages.length > 0 && (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {contactMessages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('admins'); setEditingItem(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'admins' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Admin Users</span>
            </button>

            <button
              onClick={() => { setActiveTab('siteSettings'); setEditingItem(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'siteSettings' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab('youtube-research'); setEditingItem(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                activeTab === 'youtube-research' ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>YouTube Research</span>
            </button>
          </div>
        </nav>

        {/* User context footer */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-semibold truncate leading-none text-white">{user.displayName || 'Authorized Admin'}</p>
              <p className="text-[10px] text-white/50 truncate mt-1">{user.email}</p>
              <div className="mt-1.5 font-mono">
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-secondary text-primary border border-primary/20">
                  {effectiveRole}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 text-xs py-2 rounded text-white cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Control Panel Workplane */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {loading && (
          <div className="bg-primary/5 p-3 rounded mb-6 text-xs text-primary font-medium animate-pulse flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span>Saving changes or downloading operational registries...</span>
          </div>
        )}

        {/* Console Home screen */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-lg border border-outline-variant shadow-xs gap-4">
              <div>
                <h1 className="font-display font-semibold text-2xl text-primary">Console Home Dashboard</h1>
                <p className="text-sm text-on-surface-variant">Manage programs, newsletters, postings, and global layout timings.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={() => setActiveTab('youtube-research')}
                  className="bg-primary hover:bg-primary-container text-white font-semibold text-xs px-4 py-2 hover:bg-primary-container transition-all flex items-center gap-2 rounded cursor-pointer"
                >
                  <Search className="w-4 h-4" /> Review AI-Discovered YouTube Videos
                </button>
                <button 
                  onClick={runSeeder}
                  className="bg-secondary text-primary font-semibold text-xs px-4 py-2 hover:bg-secondary-container transition-all flex items-center gap-2 rounded border border-primary/20 cursor-pointer"
                >
                  <Database className="w-4 h-4" /> Seed Clearpath Catalog
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Active programmes</span>
                <p className="text-4xl font-semibold text-primary mt-2">{programmes.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Active explainers</span>
                <p className="text-4xl font-semibold text-primary mt-2">{explainers.filter(e => e.status === 'active').length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Published Videos</span>
                <p className="text-4xl font-semibold text-primary mt-2">{programmeVideos.filter(v => v.status === 'published').length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Mailing subscribers</span>
                <p className="text-4xl font-semibold text-primary mt-2">{subscribers.length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Partnerships leads</span>
                <p className="text-4xl font-semibold text-primary mt-2">{partnerRequests.length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Contact Messages</span>
                <p className="text-4xl font-semibold text-primary mt-2">{contactMessages.length}</p>
              </div>
            </div>

            <section className="bg-white p-6 rounded-lg border border-outline-variant shadow-xs">
              <h2 className="font-headline-md text-primary mb-4">Quick actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => { handleEditInit('programmes'); setActiveTab('form'); }} className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3">
                  <Plus className="w-5 h-5 text-primary" />
                  <div>
                    <span className="block text-sm font-semibold text-primary">New Programme card</span>
                    <span className="text-xs text-on-surface-variant">Create top-level dynamic categorizations</span>
                  </div>
                </button>
                <button onClick={() => { handleEditInit('explainers'); setActiveTab('form'); }} className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3">
                  <Plus className="w-5 h-5 text-primary" />
                  <div>
                    <span className="block text-sm font-semibold text-primary">New Explainer card</span>
                    <span className="text-xs text-on-surface-variant">Define structured civics topic collections</span>
                  </div>
                </button>
                <button onClick={() => { handleEditInit('briefings'); setActiveTab('form'); }} className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3">
                  <Plus className="w-5 h-5 text-primary" />
                  <div>
                    <span className="block text-sm font-semibold text-primary">Publish new briefing</span>
                    <span className="text-xs text-on-surface-variant">Upload new morning/weekly reports</span>
                  </div>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Dynamic CMS Form Match */}
        {activeTab === 'form' && editingItem && (
          <div className="animate-fade-in">
            <CMSForm 
              type={editingItem.type}
              data={editingItem.data}
              programmes={programmes}
              explainers={explainers}
              onChange={(updated) => setEditingItem({ ...editingItem, data: updated })}
              onSave={handleSaveItem}
              onCancel={() => {
                setEditingItem(null);
                if (editingItem.type === 'programmes' || editingItem.type === 'programmeVideos') {
                  setActiveTab(selectedProgrammeId ? 'programme-detail' : 'overview');
                } else if (editingItem.type === 'explainers' || editingItem.type === 'explainerItems') {
                  setActiveTab(selectedExplainerId ? 'explainer-detail' : 'overview');
                } else if (editingItem.type === 'briefings') {
                  setActiveTab('briefings');
                } else {
                  setActiveTab('overview');
                }
              }}
              uploadProgress={uploadProgress}
              onFileChange={async (e, field) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadProgress('Uploading...');
                try {
                  const storageRef = ref(storage, `${editingItem.type}/${Date.now()}_${file.name}`);
                  const isSnap = await uploadBytes(storageRef, file);
                  const isUrl = await getDownloadURL(isSnap.ref);
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, [field]: isUrl }
                  });
                  setUploadProgress('Uploaded successfully!');
                } catch (err: any) {
                  alert('Upload error: ' + err.message);
                  setUploadProgress('Failed');
                }
              }}
            />
          </div>
        )}

        {/* Programme Videos workspace */}
        {activeTab === 'programme-videos' && (
          <div className="space-y-6 animate-fade-in text-on-surface">
            <div className="bg-white p-6 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="font-display font-semibold text-2xl text-primary">Programme Videos Management</h1>
                <p className="text-sm text-on-surface-variant">Update metadata, assign and categorize video assets, corrected display timings, or toggle featured statuses.</p>
              </div>
              <button 
                onClick={() => { handleEditInit('programmeVideos'); setActiveTab('form'); }}
                className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Programme Video
              </button>
            </div>

            {/* Searching, Filtering & Actions panel */}
            <div className="bg-white p-4 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
                {/* Text search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={videoSearchTerm}
                    onChange={(e) => setVideoSearchTerm(e.target.value)}
                    placeholder="Search by title, slugs or topic tag..."
                    className="w-full pl-9 pr-4 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-xs bg-transparent"
                  />
                  {videoSearchTerm && (
                    <button onClick={() => setVideoSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown Programme Filter */}
                <select 
                  value={videoSelectedProgId}
                  onChange={(e) => setVideoSelectedProgId(e.target.value)}
                  className="px-3 py-2 border border-outline rounded text-xs bg-transparent min-w-[200px]"
                >
                  <option value="all">All Programmes</option>
                  {programmes.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-on-surface-variant font-medium shrink-0">
                Found <strong className="text-primary">{
                  programmeVideos.filter(video => {
                    if (videoSelectedProgId !== 'all' && video.programmeId !== videoSelectedProgId) return false;
                    if (videoSearchTerm.trim() !== '') {
                      const q = videoSearchTerm.toLowerCase();
                      const matchTitle = video.title?.toLowerCase().includes(q);
                      const matchTags = Array.isArray(video.topicTags) 
                        ? video.topicTags.some(t => t.toLowerCase().includes(q))
                        : typeof video.topicTags === 'string' && (video.topicTags as string).toLowerCase().includes(q);
                      return matchTitle || matchTags;
                    }
                    return true;
                  }).length
                }</strong> entries
              </div>
            </div>

            {/* Video Records Table */}
            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                  <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                    <tr>
                      <th className="p-3 w-28">Preview</th>
                      <th className="p-3">Video Title & Slug</th>
                      <th className="p-3">Programme Assigned</th>
                      <th className="p-3">Summary</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {programmeVideos
                      .filter(video => {
                        if (videoSelectedProgId !== 'all' && video.programmeId !== videoSelectedProgId) return false;
                        if (videoSearchTerm.trim() !== '') {
                          const q = videoSearchTerm.toLowerCase();
                          const matchTitle = video.title?.toLowerCase().includes(q);
                          const matchTags = Array.isArray(video.topicTags) 
                            ? video.topicTags.some(t => t.toLowerCase().includes(q))
                            : typeof video.topicTags === 'string' && (video.topicTags as string).toLowerCase().includes(q);
                          return matchTitle || matchTags;
                        }
                        return true;
                      })
                      .map((video) => {
                        const isInlineEditing = videoInlineEditId === video.id;

                        // Quick toggle status handler
                        const toggleStatus = async () => {
                          const newStatus = video.status === 'published' ? 'draft' : 'published';
                          try {
                            setLoading(true);
                            await updateDoc(doc(db, 'programmeVideos', video.id), { status: newStatus, updatedAt: new Date().toISOString() });
                            alert(`Video status toggled to "${newStatus}"!`);
                            setRefreshTrigger(p => p + 1);
                          } catch (err: any) {
                            alert('Error updating status: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        };

                        // Quick archive handler
                        const archiveVideo = async () => {
                          try {
                            setLoading(true);
                            await updateDoc(doc(db, 'programmeVideos', video.id), { status: 'archived', updatedAt: new Date().toISOString() });
                            alert('Video status archived successfully.');
                            setRefreshTrigger(p => p + 1);
                          } catch (err: any) {
                            alert('Error archiving video: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        };

                        // Inline edits init
                        const startInlineEdit = () => {
                          setVideoInlineEditId(video.id);
                          setVideoInlineData({
                            title: video.title || '',
                            shortSummary: video.shortSummary || '',
                            programmeId: video.programmeId || ''
                          });
                        };

                        // Inline edit save
                        const saveInlineEdit = async () => {
                          if (!videoInlineData) return;
                          try {
                            setLoading(true);
                            const foundProg = programmes.find(p => p.id === videoInlineData.programmeId);
                            const payload = {
                              title: videoInlineData.title,
                              shortSummary: videoInlineData.shortSummary,
                              programmeId: videoInlineData.programmeId,
                              programmeTitle: foundProg ? foundProg.title : '',
                              updatedAt: new Date().toISOString()
                            };

                            await updateDoc(doc(db, 'programmeVideos', video.id), payload);
                            alert('Inline edits saved successfully!');
                            setVideoInlineEditId(null);
                            setVideoInlineData(null);
                            setRefreshTrigger(p => p + 1);
                          } catch (err: any) {
                            alert('Error saving inline edits: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        };

                        return (
                          <tr key={video.id} className="hover:bg-slate-50 transition-colors">
                            {/* Thumbnail preview */}
                            <td className="p-3">
                              <div className="relative w-24 h-14 bg-gray-100 rounded overflow-hidden shadow-xs border border-outline">
                                <img 
                                  referrerPolicy="no-referrer"
                                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`} 
                                  alt="thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                {video.isFeatured && (
                                  <span className="absolute top-1 left-1 bg-amber-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow-sm">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Title and slug */}
                            <td className="p-3 max-w-xs">
                              {isInlineEditing ? (
                                <div className="space-y-1.5">
                                  <label className="block text-[8px] font-bold text-gray-400 uppercase">Title</label>
                                  <input 
                                    type="text"
                                    value={videoInlineData?.title || ''}
                                    onChange={(e) => setVideoInlineData({ ...videoInlineData, title: e.target.value })}
                                    className="w-full px-2 py-1 border rounded text-xs bg-white focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <span className="font-semibold text-primary block leading-snug">{video.title}</span>
                                  <span className="font-mono text-[10px] text-on-surface-variant block mt-1">/{video.slug}</span>
                                </div>
                              )}
                            </td>

                            {/* Program select assignment */}
                            <td className="p-3">
                              {isInlineEditing ? (
                                <div className="space-y-1.5">
                                  <label className="block text-[8px] font-bold text-gray-400 uppercase">Programme</label>
                                  <select
                                    value={videoInlineData?.programmeId || ''}
                                    onChange={(e) => setVideoInlineData({ ...videoInlineData, programmeId: e.target.value })}
                                    className="w-full px-1.5 py-1 border rounded text-xs bg-white"
                                  >
                                    {programmes.map(p => (
                                      <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <span className="font-semibold text-amber-900 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded text-[10.5px]">
                                  {video.programmeTitle || video.programmeId}
                                </span>
                              )}
                            </td>

                            {/* Summary / Tag list */}
                            <td className="p-3 max-w-sm">
                              {isInlineEditing ? (
                                <div className="space-y-1.5">
                                  <label className="block text-[8px] font-bold text-gray-400 uppercase">Summary</label>
                                  <textarea
                                    rows={2}
                                    value={videoInlineData?.shortSummary || ''}
                                    onChange={(e) => setVideoInlineData({ ...videoInlineData, shortSummary: e.target.value })}
                                    className="w-full p-1 border rounded text-[11px] bg-white text-gray-600"
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-[11px] leading-relaxed block text-on-surface-variant line-clamp-2">
                                    {video.shortSummary || 'No summary registered.'}
                                  </span>
                                  {/* Tags display */}
                                  {Array.isArray(video.topicTags) && video.topicTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {video.topicTags.map(tag => (
                                        <span key={tag} className="text-[9px] bg-sky-50 text-sky-800 font-bold font-mono px-1.5 py-0.2 rounded">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Status label */}
                            <td className="p-3 font-mono text-[11px]">
                              <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9.5px] ${
                                video.status === 'published' ? 'bg-green-100 text-green-700' :
                                video.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {video.status || 'draft'}
                              </span>
                            </td>

                            {/* Dates correction */}
                            <td className="p-3 space-y-1 shrink-0 w-36">
                              <div className="text-[11px] font-medium font-mono text-gray-600">
                                <span className="text-[9px] text-gray-400 font-sans block">Display:</span>
                                {video.displayDate || 'Not specified'}
                              </div>
                              <div className="text-[10px] font-mono text-gray-400">
                                <span className="text-[9px] text-gray-400 font-sans block">Sort date:</span>
                                {video.publishedAt ? formatFirebaseDate(video.publishedAt) : 'None'}
                              </div>
                            </td>

                            {/* Actions panel */}
                            <td className="p-3 text-right shrink-0 w-48">
                              {isInlineEditing ? (
                                <div className="space-x-1.5">
                                  <button onClick={saveInlineEdit} className="bg-primary hover:bg-primary-container text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer">
                                    Save
                                  </button>
                                  <button onClick={() => setVideoInlineEditId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] cursor-pointer">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap justify-end gap-1.5">
                                  <button 
                                    onClick={startInlineEdit}
                                    className="bg-yellow-50 hover:bg-yellow-105 text-yellow-800 border border-yellow-200 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                                    title="Quick edit text fields without launching full form"
                                  >
                                    Quick Edit
                                  </button>
                                  <button 
                                    onClick={() => { handleEditInit('programmeVideos', video); setActiveTab('form'); }}
                                    className="bg-sky-50 hover:bg-sky-105 text-sky-800 border border-sky-200 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                                    title="Launch full fields form"
                                  >
                                    Edit Full
                                  </button>
                                  <button 
                                    onClick={toggleStatus}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                                    title={video.status === 'published' ? 'Unpublish video (toggles Draft state)' : 'Publish video'}
                                  >
                                    {video.status === 'published' ? 'Unpublish' : 'Publish'}
                                  </button>
                                  {video.status !== 'archived' && (
                                    <button 
                                      onClick={archiveVideo}
                                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                                      title="Flag as archived"
                                    >
                                      Archive
                                    </button>
                                  )}
                                  <a 
                                    href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="bg-red-50 hover:bg-red-105 border border-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-0.5"
                                  >
                                    Preview
                                  </a>
                                  <button 
                                    onClick={() => handleDeleteItem('programmeVideos', video.id)}
                                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                    title="Delete video record permanently"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    {programmeVideos.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono italic">
                          No videos registered. Try loading verified YouTube Library inside 'Console Home' or review seeder entries first!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'programme-detail' && currentProg && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 mb-2 bg-white p-6 rounded-lg border">
              <div>
                <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Programme Panel</span>
                <h1 className="font-display font-semibold text-2xl text-primary mt-1">{currentProg.title}</h1>
                <p className="text-xs text-on-surface-variant">Slug identifier: <span className="font-mono text-primary font-semibold">{currentProg.slug}</span></p>
              </div>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => handleDeleteItem('programmes', currentProg.id)}
                  className="bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                >
                  Delete Programme
                </button>
              </div>
            </div>

            {/* Sub headers */}
            <div className="flex border-b border-outline-variant gap-4 bg-white/60 p-2 rounded">
              <button 
                onClick={() => setProgSubTab('profile')} 
                className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                  progSubTab === 'profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Edit Programme Profile
              </button>
              <button 
                onClick={() => setProgSubTab('videos')} 
                className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                  progSubTab === 'videos' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Programme Videos
              </button>
            </div>

            {progSubTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg border border-outline-variant">
                <CMSForm 
                  type="programmes"
                  data={currentProg}
                  programmes={programmes}
                  explainers={explainers}
                  onChange={(updated) => {
                    const idx = programmes.findIndex(p => p.id === currentProg.id);
                    if (idx > -1) {
                      const updatedProgs = [...programmes];
                      updatedProgs[idx] = updated;
                      setProgrammes(updatedProgs);
                    }
                    setEditingItem({ type: 'programmes', data: updated });
                  }}
                  onSave={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await setDoc(doc(db, 'programmes', currentProg.id), currentProg);
                      alert('Programme Profile updated successfully!');
                      setRefreshTrigger(p => p + 1);
                    } catch (err: any) {
                      alert('Save error: ' + err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onCancel={() => { setSelectedProgrammeId(null); setActiveTab('overview'); }}
                  uploadProgress={null}
                  onFileChange={() => {}}
                />
              </div>
            )}

            {progSubTab === 'videos' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 border rounded-lg gap-4">
                  <h3 className="font-semibold text-primary">Manage Videos under {currentProg.title}</h3>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => { handleEditInit('programmeVideos', { programmeId: currentProg.id }); setActiveTab('form'); }}
                      className="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer animate-fade-in"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Video
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Thumbnail</th>
                        <th className="p-3">Video Title</th>
                        <th className="p-3">Presenters/Guests</th>
                        <th className="p-3">Link/Slug</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {programmeVideos.filter(v => v.programmeId === currentProg.id).map(v => {
                        // Quick status toggle
                        const toggleVideoStatus = async () => {
                          const nextStatus = v.status === 'published' ? 'draft' : 'published';
                          try {
                            setLoading(true);
                            await updateDoc(doc(db, 'programmeVideos', v.id), { status: nextStatus, updatedAt: new Date().toISOString() });
                            alert(`Video status updated to "${nextStatus}"!`);
                            setRefreshTrigger(p => p + 1);
                          } catch (err: any) {
                            alert('Save error: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        };

                        // Quick archive
                        const archiveVideoItem = async () => {
                          try {
                            setLoading(true);
                            await updateDoc(doc(db, 'programmeVideos', v.id), { status: 'archived', updatedAt: new Date().toISOString() });
                            alert(`Video archived successfully.`);
                            setRefreshTrigger(p => p + 1);
                          } catch (err: any) {
                            alert('Save error: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        };

                        return (
                          <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="p-3">
                              <img 
                                referrerPolicy="no-referrer"
                                src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`} 
                                className="w-16 h-10 object-cover rounded border" 
                                alt=""
                              />
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-primary">{v.title}</p>
                              <span className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                <span>Duration: {v.duration || 'N/A'}</span>
                                {v.isFeatured && <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1 rounded">FEATURED</span>}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-on-surface-variant font-medium">
                              <p>{v.presenters || v.presenter || 'Unassigned'}</p>
                              <p className="text-[10px] text-gray-500">{v.guests || v.guestNames}</p>
                            </td>
                            <td className="p-3 text-[11px] font-mono text-gray-500">/{v.slug}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                v.status === 'published' ? 'bg-green-100 text-green-800' : 
                                v.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{v.status || 'draft'}</span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end items-center gap-2">
                                <button 
                                  onClick={() => { setEditingItem({ type: 'programmeVideos', data: v }); setActiveTab('form'); }} 
                                  className="text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                                  title="Edit full"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={toggleVideoStatus}
                                  className="text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                                  title={v.status === 'published' ? 'Mark draft' : 'Approve publish'}
                                >
                                  {v.status === 'published' ? 'Unpublish' : 'Publish'}
                                </button>
                                {v.status !== 'archived' && (
                                  <button 
                                    onClick={archiveVideoItem}
                                    className="text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                                    title="Mark archived"
                                  >
                                    Archive
                                  </button>
                                )}
                                <a 
                                  href={v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeVideoId}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-105 px-2 py-1 rounded text-[10px] cursor-pointer inline-flex items-center"
                                  title="Watch on YouTube"
                                >
                                  Preview
                                </a>
                                <button 
                                  onClick={() => handleDeleteItem('programmeVideos', v.id)} 
                                  className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                                  title="Permanently remove video record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {programmeVideos.filter(v => v.programmeId === currentProg.id).length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No videos have been added to this dynamic programme yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile and article controls inside dynamic explainer */}
        {activeTab === 'explainer-detail' && currentExpl && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 mb-2 bg-white p-6 rounded-lg border">
              <div>
                <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Explainer Panel</span>
                <h1 className="font-display font-semibold text-2xl text-primary mt-1">{currentExpl.title}</h1>
                <p className="text-xs text-on-surface-variant">Slug identifier: <span className="font-mono text-primary font-semibold">{currentExpl.slug}</span></p>
              </div>
              <div>
                <button 
                  onClick={() => handleDeleteItem('explainers', currentExpl.id)}
                  className="bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                >
                  Delete Explainer
                </button>
              </div>
            </div>

            {/* Sub headers */}
            <div className="flex border-b border-outline-variant gap-4 bg-white/60 p-2 rounded">
              <button 
                onClick={() => setExplSubTab('profile')} 
                className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                  explSubTab === 'profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Edit Explainer Profile
              </button>
              <button 
                onClick={() => setExplSubTab('items')} 
                className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                  explSubTab === 'items' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Explainer Items / Content
              </button>
            </div>

            {explSubTab === 'profile' && (
              <div className="bg-white p-6 border rounded-lg">
                <CMSForm 
                  type="explainers"
                  data={currentExpl}
                  programmes={programmes}
                  explainers={explainers}
                  onChange={(updated) => {
                    const idx = explainers.findIndex(ex => ex.id === currentExpl.id);
                    if (idx > -1) {
                      const updatedExList = [...explainers];
                      updatedExList[idx] = updated;
                      setExplainers(updatedExList);
                    }
                    setEditingItem({ type: 'explainers', data: updated });
                  }}
                  onSave={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await setDoc(doc(db, 'explainers', currentExpl.id), currentExpl);
                      alert('Explainer Profile updated successfully!');
                      setRefreshTrigger(p => p + 1);
                    } catch (err: any) {
                      alert('Save error: ' + err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onCancel={() => { setSelectedExplainerId(null); setActiveTab('overview'); }}
                  uploadProgress={null}
                  onFileChange={() => {}}
                />
              </div>
            )}

            {explSubTab === 'items' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 border rounded-lg animate-fade-in">
                  <h3 className="font-semibold text-primary">Manage Items under {currentExpl.title}</h3>
                  <button 
                    onClick={() => { handleEditInit('explainerItems', { explainerId: currentExpl.id }); setActiveTab('form'); }}
                    className="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Explainer Item
                  </button>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Cover</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Slug / Path</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {explainerItems.filter(v => v.explainerId === currentExpl.id).map(item => (
                        <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-3">
                            <img src={item.featuredImage || 'https://images.unsplash.com/photo-1522881111613-3efeb7397b9c?auto=format&fit=crop&w=320&q=80'} className="w-16 h-10 object-cover rounded border" />
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-primary">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant line-clamp-1">{item.excerpt}</p>
                          </td>
                          <td className="p-3">
                            <span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase text-gray-600">{item.explainerType}</span>
                          </td>
                          <td className="p-3 text-[11px] font-mono text-gray-500">{item.slug}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                              item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-850'
                            }`}>{item.status}</span>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button onClick={() => { setEditingItem({ type: 'explainerItems', data: item }); setActiveTab('form'); }} className="hover:text-primary text-gray-400 p-1 cursor-pointer"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem('explainerItems', item.id)} className="hover:text-error text-gray-400 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      {explainerItems.filter(v => v.explainerId === currentExpl.id).length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No items have been assigned to this explainer folder yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* feedings / briefings tab view */}
        {activeTab === 'briefings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 border rounded-lg">
              <div>
                <h1 className="font-display font-semibold text-2xl text-primary">Manage Briefings</h1>
                <p className="text-sm text-on-surface-variant">Write and distribute daily or weekly macro analyses.</p>
              </div>
              <button 
                onClick={() => { handleEditInit('briefings'); setActiveTab('form'); }}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Briefing
              </button>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Presenter</th>
                    <th className="p-4">Release Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {briefings.map(b => (
                    <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-primary">{b.title}</p>
                        <p className="text-[10px] text-on-surface-variant line-clamp-1">{b.excerpt}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded text-[10px] font-medium uppercase font-mono">{b.briefingType}</span>
                      </td>
                      <td className="p-4 font-mono text-on-surface-variant">{b.presenter}</td>
                      <td className="p-4 text-on-surface-variant">{b.publishedAt}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                          b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-850'
                        }`}>{b.status}</span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => { setEditingItem({ type: 'briefings', data: b }); setActiveTab('form'); }} className="hover:text-primary text-gray-400 p-1 cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem('briefings', b.id)} className="hover:text-error text-gray-400 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {briefings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No briefings found. Click 'Add Briefing' to create.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* partnerships view */}
        {activeTab === 'partnerRequests' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 border rounded-lg">
              <h1 className="font-display font-semibold text-2xl text-primary">Partnership Requests</h1>
              <p className="text-sm text-on-surface-variant">Incoming corporate collaborations and proposals.</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Prospect Name</th>
                    <th className="p-4">Corporate Entity</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Partnership Interest</th>
                    <th className="p-4">Key Message / Detail</th>
                    <th className="p-4">Submitted At</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {partnerRequests.map(r => (
                    <tr key={r.id} onClick={() => setSelectedDetail({ type: 'partnerRequests', data: r })} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="p-4 font-bold text-primary">{getProspectName(r)}</td>
                      <td className="p-4 font-medium text-on-surface">{getCorporateEntity(r)}</td>
                      <td className="p-4 font-mono text-on-surface-variant">{getContact(r)}</td>
                      <td className="p-4 font-medium text-on-surface">{getPartnershipInterest(r)}</td>
                      <td className="p-4 text-on-surface-variant max-w-xs truncate">{getKeyMessage(r)}</td>
                      <td className="p-4 text-gray-500 font-mono text-[11px]">{formatFirebaseDate(r.submittedAt || r.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          (r.status || 'new') === 'new' ? 'bg-blue-100 text-blue-800' :
                          (r.status || '') === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {r.status || 'new'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem('partnerRequests', r.id); }} className="hover:text-error text-gray-400 p-1 cursor-pointer"><Trash2 className="w-4.5 h-4.5" /></button>
                      </td>
                    </tr>
                  ))}
                  {partnerRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-on-surface-variant italic">No partnership submissions received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* subscribers view */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="bg-white p-6 border rounded-lg">
              <h1 className="font-display font-semibold text-2xl text-primary">Newsletter Subscribers</h1>
              <p className="text-sm text-on-surface-variant">Mailing lists for morning Daily Briefings digests.</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Subscriber Email</th>
                    <th className="p-4">Selected Briefings</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4">Subscription Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {subscribers.map(s => (
                    <tr key={s.id} onClick={() => setSelectedDetail({ type: 'subscribers', data: s })} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="p-4 font-bold text-primary font-mono">{s.email}</td>
                      <td className="p-4 text-on-surface-variant max-w-xs truncate">
                        {s.selectedBriefings && Array.isArray(s.selectedBriefings) && s.selectedBriefings.length > 0 
                          ? s.selectedBriefings.join(', ') 
                          : 'None / General Weekly Brief'}
                      </td>
                      <td className="p-4 text-gray-500 font-mono">{formatFirebaseDate(s.subscribedAt || s.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          (s.status || 'active') === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {s.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem('newsletterSubscribers', s.id); }} className="hover:text-error text-gray-400 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No email subscriptions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* contactMessages view */}
        {activeTab === 'contactMessages' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="bg-white p-6 border rounded-lg">
              <h1 className="font-display font-semibold text-2xl text-primary">Contact Messages</h1>
              <p className="text-sm text-on-surface-variant">Reach-out inquiries submitted from the subscribe modal.</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Sender Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Submitted At</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {contactMessages.map(m => (
                    <tr key={m.id} onClick={() => setSelectedDetail({ type: 'contactMessages', data: m })} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="p-4 font-bold text-primary">{m.fullName || 'Anonymous'}</td>
                      <td className="p-4 font-mono text-on-surface-variant">{m.email}</td>
                      <td className="p-4 font-normal text-on-surface max-w-sm whitespace-pre-wrap">{m.message}</td>
                      <td className="p-4 text-gray-500 font-mono text-[11px]">{formatFirebaseDate(m.submittedAt || m.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          (m.status || 'new') === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {m.status || 'new'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem('contactMessages', m.id); }} className="hover:text-error text-gray-400 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No messages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin registry users view */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 border rounded-lg shadow-xs">
              <div>
                <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Security Registry</span>
                <h1 className="font-display font-semibold text-2xl text-primary mt-1">CMS Administrators</h1>
                <p className="text-sm text-on-surface-variant">Configure role privileges, enable, disable, and manage security staff credentials.</p>
              </div>
              {isSuperadmin && (
                <button 
                  onClick={() => { handleEditInit('users'); setActiveTab('form'); }}
                  className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Administrator
                </button>
              )}
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Admin Name</th>
                    <th className="p-4">Registry Email</th>
                    <th className="p-4">Access Role Privilege</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {adminUsers.map((a, i) => {
                    const finalDocId = a.email ? a.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_') : '';
                    const isJerry = a.email?.toLowerCase() === 'jerryagbedun@gmail.com';
                    const isDisabled = a.disabled === true || a.status === 'disabled';

                    // Handler to quickly toggle disabled state
                    const toggleDisableAdmin = async () => {
                      if (!isSuperadmin) {
                        alert('Only super administrators can disable or enable other admin accounts.');
                        return;
                      }
                      if (isJerry) {
                        alert('Safety limit: You cannot disable the primary super_admin account.');
                        return;
                      }

                      const nextStatus = isDisabled ? 'active' : 'disabled';
                      const confirmMsg = `Are you sure you want to ${isDisabled ? 'activate' : 'disable'} ${a.name || 'this admin'} (${a.email})?`;
                      if (!confirm(confirmMsg)) return;

                      try {
                        setLoading(true);
                        await updateDoc(doc(db, 'users', finalDocId), { 
                          status: nextStatus, 
                          disabled: nextStatus === 'disabled',
                          updatedAt: new Date().toISOString()
                        });
                        alert(`Account successfully ${isDisabled ? 'activated' : 'disabled'}!`);
                        setRefreshTrigger(p => p + 1);
                      } catch (err: any) {
                        alert('Error updating status: ' + err.message);
                      } finally {
                        setLoading(false);
                      }
                    };

                    return (
                      <tr key={a.uid || a.email || i} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-primary flex items-center gap-1.5">
                            {a.name || 'Staff Operator'}
                            {isJerry && <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold uppercase shrink-0">FOUNDER</span>}
                          </p>
                        </td>
                        <td className="p-4 font-mono text-on-surface-variant">{a.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${
                            a.role === 'super_admin' || a.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            a.role === 'editor' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {a.role || 'admin'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className={`text-[11px] font-medium ${isDisabled ? 'text-red-700' : 'text-green-700'}`}>
                              {isDisabled ? 'Disabled' : 'Active'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2.5 items-center">
                            {!isJerry && isSuperadmin && (
                              <>
                                <button 
                                  onClick={() => { handleEditInit('users', a); setActiveTab('form'); }}
                                  className="text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded text-xs cursor-pointer"
                                  title="Edit full settings"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={toggleDisableAdmin}
                                  className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                                    isDisabled 
                                      ? 'bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-950' 
                                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-950'
                                  }`}
                                  title={isDisabled ? 'Activate account' : 'Lockout account'}
                                >
                                  {isDisabled ? 'Enable' : 'Disable'}
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem('users', finalDocId || a.uid || a.id)} 
                                  className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                                  title="Permanently remove permission Doc"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No administrators found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* site timeline settings screen */}
        {activeTab === 'siteSettings' && siteSettings && (
          <div className="space-y-6">
            <div className="bg-white p-6 border rounded-lg">
              <h1 className="font-display font-semibold text-2xl text-primary font-bold">Homepage Player Parameters</h1>
              <p className="text-sm text-on-surface-variant">Update primary layout parameters and background YouTube repeat loop frame numbers.</p>
            </div>

            <form onSubmit={handleUpdateSiteSettings} className="bg-white p-6 border rounded-lg space-y-4 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Background Clip Video Play URL *</label>
                  <input type="text" required value={siteSettings.heroVideoUrl || ''} onChange={(e) => setSiteSettings({ ...siteSettings, heroVideoUrl: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Calculated video ID (YouTube)</label>
                  <input type="text" disabled value={siteSettings.heroVideoId || ''} className="w-full px-3 py-2 border rounded text-sm bg-gray-100 font-mono text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Featured Programme Identifier</label>
                  <select value={siteSettings.featuredProgrammeId || ''} onChange={(e) => setSiteSettings({ ...siteSettings, featuredProgrammeId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent">
                    <option value="">-- Choose Featured Programme --</option>
                    {programmes.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Featured Explainer Identifier</label>
                  <select value={siteSettings.featuredExplainerId || ''} onChange={(e) => setSiteSettings({ ...siteSettings, featuredExplainerId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent">
                    <option value="">-- Choose Featured Explainer --</option>
                    {explainers.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 border-t pt-4">
                  <h3 className="font-semibold text-primary mb-2 text-sm">Site Contact Coordinates</h3>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Contact Email</label>
                  <input type="email" value={siteSettings.contactEmail || ''} onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Partnership Email</label>
                  <input type="email" value={siteSettings.partnershipEmail || ''} onChange={(e) => setSiteSettings({ ...siteSettings, partnershipEmail: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Mailing list Title</label>
                  <input type="text" value={siteSettings.newsletterTitle || ''} onChange={(e) => setSiteSettings({ ...siteSettings, newsletterTitle: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Mailing list description</label>
                  <textarea value={siteSettings.newsletterDescription || ''} onChange={(e) => setSiteSettings({ ...siteSettings, newsletterDescription: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Footer Copyright/Disclaimer text</label>
                  <input type="text" value={siteSettings.footerText || ''} onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })} className="w-full px-3 py-2 border rounded text-sm bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t mt-4">
                <button type="submit" className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Timing parameters
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dynamic YouTube Research / AI Discovery Review screen */}
        {activeTab === 'youtube-research' && (
          <YoutubeResearchPanel 
            programmes={programmes} 
            onVideoApproved={() => setRefreshTrigger(prev => prev + 1)} 
          />
        )}
      </main>

      {/* Detail card modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-lg border border-outline-variant shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-primary text-white p-6 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
                  {selectedDetail.type === 'partnerRequests' ? 'Partnership Request' :
                   selectedDetail.type === 'subscribers' ? 'Newsletter Subscriber' :
                   'Contact Message'}
                </span>
                <h3 className="text-xl font-bold font-display mt-1">
                  {selectedDetail.type === 'partnerRequests' ? getProspectName(selectedDetail.data) :
                   selectedDetail.type === 'subscribers' ? selectedDetail.data.email :
                   (selectedDetail.data.fullName || 'Anonymous Message')}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetail(null)} 
                className="text-white hover:text-secondary-container transition-colors p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-grow text-sm text-left">
              {selectedDetail.type === 'partnerRequests' && (
                <>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company/Organisation</h4>
                    <p className="font-semibold text-primary">{getCorporateEntity(selectedDetail.data)}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Title / Role</h4>
                    <p className="font-semibold text-primary">{getJobTitle(selectedDetail.data)}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Work Email Address</h4>
                    <a href={`mailto:${getContact(selectedDetail.data)}`} className="font-mono font-semibold text-primary hover:underline">{getContact(selectedDetail.data)}</a>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Partnership Interest Category</h4>
                    <p className="font-semibold text-primary">{getPartnershipInterest(selectedDetail.data)}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Additional Information / Message</h4>
                    <div className="bg-surface-container-low p-4 rounded border border-outline-variant font-normal text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                      {getKeyMessage(selectedDetail.data)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Submitted</h4>
                    <p className="font-mono text-gray-500">{formatFirebaseDate(selectedDetail.data.submittedAt || selectedDetail.data.createdAt)}</p>
                  </div>
                </>
              )}

              {selectedDetail.type === 'subscribers' && (
                <>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subscriber Email</h4>
                    <a href={`mailto:${selectedDetail.data.email}`} className="font-mono font-semibold text-primary hover:underline">{selectedDetail.data.email}</a>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Preferences Categories</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDetail.data.selectedBriefings && Array.isArray(selectedDetail.data.selectedBriefings) && selectedDetail.data.selectedBriefings.length > 0 ? (
                        selectedDetail.data.selectedBriefings.map((b: string) => (
                          <span key={b} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded uppercase">{b}</span>
                        ))
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">None / General Weekly Brief</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subscription Date</h4>
                    <p className="font-mono text-gray-500">{formatFirebaseDate(selectedDetail.data.subscribedAt || selectedDetail.data.createdAt)}</p>
                  </div>
                </>
              )}

              {selectedDetail.type === 'contactMessages' && (
                <>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Sender Full Name</h4>
                    <p className="font-semibold text-primary">{selectedDetail.data.fullName || 'Anonymous'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Email</h4>
                    <a href={`mailto:${selectedDetail.data.email}`} className="font-mono font-semibold text-primary hover:underline">{selectedDetail.data.email}</a>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Message Body</h4>
                    <div className="bg-surface-container-low p-4 rounded border border-outline-variant font-normal text-on-surface-variant whitespace-pre-wrap leading-relaxed text-left">
                      {selectedDetail.data.message}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Received</h4>
                    <p className="font-mono text-gray-500">{formatFirebaseDate(selectedDetail.data.submittedAt || selectedDetail.data.createdAt)}</p>
                  </div>
                </>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="bg-surface-container-low p-6 border-t border-outline-variant flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
              {/* Status Update Control */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="font-semibold text-on-surface-variant text-[10px] uppercase">Status:</span>
                <select 
                  value={selectedDetail.data.status || (selectedDetail.type === 'subscribers' ? 'active' : 'new')}
                  onChange={(e) => {
                    const dbCollection = selectedDetail.type === 'subscribers' ? 'newsletterSubscribers' : selectedDetail.type;
                    handleUpdateStatus(dbCollection, selectedDetail.data.id, e.target.value);
                  }}
                  className="bg-white border rounded px-2.5 py-1.5 focus:border-primary focus:ring-0 text-xs font-semibold uppercase text-primary"
                >
                  {selectedDetail.type === 'partnerRequests' && (
                    <>
                      <option value="new">NEW</option>
                      <option value="pending">PENDING</option>
                      <option value="processed">PROCESSED</option>
                      <option value="archived">ARCHIVED</option>
                    </>
                  )}
                  {selectedDetail.type === 'subscribers' && (
                    <>
                      <option value="active">ACTIVE</option>
                      <option value="paused">PAUSED</option>
                      <option value="unsubscribed">UNSUBSCRIBED</option>
                    </>
                  )}
                  {selectedDetail.type === 'contactMessages' && (
                    <>
                      <option value="new">NEW</option>
                      <option value="read">READ</option>
                      <option value="flagged">FLAGGED</option>
                      <option value="replied">REPLIED</option>
                      <option value="archived">ARCHIVED</option>
                    </>
                  )}
                </select>
              </div>

              {/* Delete Button */}
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this specific record permanently from the database?')) {
                    const dbCollection = selectedDetail.type === 'subscribers' ? 'newsletterSubscribers' : selectedDetail.type;
                    setSelectedDetail(null);
                    // trigger standard delete
                    setLoading(true);
                    try {
                      await deleteDoc(doc(db, dbCollection, selectedDetail.data.id));
                      alert('Deleted dynamically successfully.');
                      setRefreshTrigger(prev => prev + 1);
                    } catch (err: any) {
                      handleFirestoreError(err, OperationType.DELETE, `${dbCollection}/${selectedDetail.data.id}`);
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                className="w-full sm:w-auto hover:bg-error/10 hover:text-error text-gray-500 font-bold border border-transparent hover:border-error/20 px-4 py-2 rounded flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer text-[11px]"
              >
                <Trash2 className="w-4 h-4 text-error" /> Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
