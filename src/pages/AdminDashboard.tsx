import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  db, 
  auth, 
  storage, 
  OperationType, 
  handleFirestoreError 
} from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Programme, 
  Episode, 
  Post, 
  CustomPage, 
  SiteSettings, 
  PartnerRequest, 
  NewsletterSubscriber,
  Topic 
} from '../types';
import { 
  LayoutDashboard, 
  Tv, 
  Video, 
  BookOpen, 
  FileText, 
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
  AlertCircle 
} from 'lucide-react';

const provider = new GoogleAuthProvider();

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Core CMS state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // Selection states for Modals/Forms
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Load state triggered
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Enforce is admin check (jerryagbedun@gmail.com is absolute bootstrapped admin)
        const isJerry = currentUser.email?.toLowerCase() === 'jerryagbedun@gmail.com';
        if (isJerry) {
          setIsAdminUser(true);
        } else {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', currentUser.uid)));
            if (!userSnap.empty && userSnap.docs[0].data().role === 'admin') {
              setIsAdminUser(true);
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

  // Fetch collections when user changes / refreshes
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
      const progList = progSnap.docs.map(d => ({ id: d.id, ...d.data() } as Programme));
      progList.sort((a,b) => (a.order || 0) - (b.order || 0));
      setProgrammes(progList);

      // Episodes
      const epSnap = await getDocs(collection(db, 'episodes'));
      const epList = epSnap.docs.map(d => ({ id: d.id, ...d.data() } as Episode));
      setEpisodes(epList);

      // Posts
      const postSnap = await getDocs(collection(db, 'posts'));
      const postList = postSnap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
      setPosts(postList);

      // Custom Pages
      const pageSnap = await getDocs(collection(db, 'pages'));
      setCustomPages(pageSnap.docs.map(d => ({ id: d.id, ...d.data() } as CustomPage)));

      // Site Settings
      const settingsSnap = await getDocs(collection(db, 'siteSettings'));
      if (!settingsSnap.empty) {
        setSiteSettings({ id: settingsSnap.docs[0].id, ...settingsSnap.docs[0].data() } as SiteSettings);
      } else {
        // Create default settings if absent
        const initialSettings: SiteSettings = {
          id: 'primary',
          heroVideoUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          heroVideoId: '3H95x0BV9nA',
          heroStart: 14,
          heroEnd: 21,
        };
        await setDoc(doc(db, 'siteSettings', 'primary'), initialSettings);
        setSiteSettings(initialSettings);
      }

      // Partner requests
      const partnerSnap = await getDocs(collection(db, 'partnerRequests'));
      const partnerList = partnerSnap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
      partnerList.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPartnerRequests(partnerList);

      // Newsletter subscribers
      const subSnap = await getDocs(collection(db, 'newsletterSubscribers'));
      setSubscribers(subSnap.docs.map(d => ({ id: d.id, ...d.data() } as NewsletterSubscriber)));

      // Admin Users
      const adminUsersSnap = await getDocs(collection(db, 'users'));
      setAdminUsers(adminUsersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      setAuthError(e.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Seeding sample data
  const seedSampleData = async () => {
    if (!confirm('Are you sure you want to initialize the database with sample data? This will write default programmes, briefings and explainers!')) return;
    setLoading(true);
    try {
      // 1. Seed public programmes
      const samplePrograms: Programme[] = [
        {
          id: 'three-things',
          tag: 'Conversations',
          title: 'Osita Insights',
          desc: 'A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.',
          about: 'Each episode, Osita Chidoka invites a prominent leader to discuss three specific events or decisions that defined their public service and the lessons they offer for future generations.',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
          meta: { Cadence: 'Twice Monthly', Format: 'Video Conversation', Audience: 'Policy Makers, Executives' },
          link: '/programmes/three-things',
          linkText: 'Browse Episodes',
          order: 1
        },
        {
          id: 'daily-brief',
          tag: 'Briefings',
          title: 'Daily Brief with Annabel',
          desc: 'A weekday briefing that helps professionals interpret events without chasing headlines.',
          about: 'Annabel provides a high-level synthesis of economic data and policy shifts from across West Africa, delivered every morning for the busy professional.',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj0sf1F6xFR6H3tbPIJPO_NYWyereW6LdnHUYz-S62krq0N-lI0KFfNNEMWcmcPVYBMQ487oKIJ5WTyDkMtu7VqlInld9PY0p_iGDAFpskRkHcarnEo0f98r8_Mp0IVtxc3Sk1YXbzQNmL1QtaWUWx7RCFWxaD1WLHSLnj7_XHTizqY8ztbb1R1WI8OXY9Hwdx0hkMrV9rLcSuXHEGAJcFN9xeAxubX7a-nYVdTEhDp99MUvwUxMnjs6BEXprW0Zoo980CBD029NM',
          meta: { Cadence: 'Weekdays', Format: 'Daily Briefing', Audience: 'Professionals, Investors' },
          link: '/briefing',
          linkText: "Watch Today's Brief",
          order: 2
        },
        {
          id: 'insights',
          tag: 'Explainers',
          title: 'Clearpath Insights',
          desc: 'Short explainers translating complex issues into clear, accessible understanding.',
          about: 'Designed for quick consumption, these visualizations break down legislative frameworks and market mechanics into their core elements.',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk',
          meta: { Cadence: 'Ongoing', Format: '60–120s Explainers', Audience: 'General Public, Students' },
          link: '/explainers/insights',
          linkText: 'View Library',
          order: 3
        }
      ];

      for (const p of samplePrograms) {
        await setDoc(doc(db, 'programmes', p.id), p);
      }

      // 2. Seed default episodes
      const sampleEpisodes: Episode[] = [
        {
          id: 'ep1',
          programmeId: 'three-things',
          title: 'Judgment & Choices - Leadership Lessons with Osita',
          desc: 'A robust discussion on institutional reform, accountability, and shaping public infrastructure policies in Africa.',
          youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          videoId: '3H95x0BV9nA',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
          publishStatus: 'published',
          publishedAt: new Date().toISOString(),
          duration: '42:15',
          order: 1,
          whatHappened: 'In this introductory session, we map out the core pathways of public policy implementation guidelines.',
          whyItMatters: 'Understanding execution gaps helps policymakers predict issues in broad infrastructural undertakings.',
          whatToWatchNext: 'Watch historical archives on regulatory acts to analyze long-term trends.'
        }
      ];

      for (const ep of sampleEpisodes) {
        await setDoc(doc(db, 'episodes', ep.id), ep);
      }

      // 3. Seed default posts (briefing/explainer)
      const samplePosts: Post[] = [
        {
          id: 'brief-1',
          category: 'Briefing',
          title: 'Resource Diplomacy in the Sahel',
          desc: 'Analyzing the new lithium mining agreements and their impact on regional security partnerships.',
          content: '### Lithium Mining and Geopolitics \n\nA new framework of cooperation has taken place as sovereign lithium reserves attract global infrastructure partnerships...',
          youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          videoId: '3H95x0BV9nA',
          publishStatus: 'published',
          publishedAt: new Date().toISOString(),
          tags: ['POLICY', 'MINING', 'ECONOMY'],
          whatHappened: 'The central bank announced a 50bps rate hike following higher-than-expected inflation data in the logistics sector.',
          whyItMatters: 'This marks a hawkish shift that could dampen private sector credit growth during the critical Q4 trade window.',
          whatToWatchNext: 'Secondary bond market yields and the upcoming manufacturing PMI reports for cross-sector contagion.'
        },
        {
          id: 'brief-2',
          category: 'Briefing',
          title: 'Digital Infrastructure Expansion',
          desc: 'Submarine cable investments and the competitive landscape for pan-African cloud providers.',
          content: 'Broadband capacity continues to scale up as cloud providers execute key hyper-scale anchor datacenters.',
          youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          videoId: '3H95x0BV9nA',
          publishStatus: 'published',
          publishedAt: new Date().toISOString(),
          tags: ['TECH', 'ECONOMY'],
          whatHappened: 'A newly integrated physical fiber loop improves uptime across key submarine cable drop-points.',
          whyItMatters: 'This scales latency profiles by 40% for localized application workloads.',
          whatToWatchNext: 'The upcoming regional telecom infrastructure reform hearings.'
        },
        {
          id: 'brief-3',
          category: 'Briefing',
          title: 'The Port Congestion Crisis',
          desc: 'Supply chain bottlenecks at regional hubs and the implications for seasonal inflation.',
          content: 'Regional freight operations outline container processing backlogs resulting in seasonal cost adjustments.',
          youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
          videoId: '3H95x0BV9nA',
          publishStatus: 'published',
          publishedAt: new Date().toISOString(),
          tags: ['TRADE', 'LOGISTICS'],
          whatHappened: 'Logistics cargo queues reached a record average timeline metric during peak season operations.',
          whyItMatters: 'Sustained bottlenecks risk elevating general CPI metrics due to warehouse overflow tariffs.',
          whatToWatchNext: 'Customs clearance automation pilot program rollout timelines.'
        }
      ];

      for (const p of samplePosts) {
        await setDoc(doc(db, 'posts', p.id), p);
      }

      // Add Jerry to users list
      await setDoc(doc(db, 'users', auth.currentUser?.uid || 'temp_uid'), {
        uid: auth.currentUser?.uid || 'temp_uid',
        email: auth.currentUser?.email || 'jerryagbedun@gmail.com',
        role: 'admin',
        name: auth.currentUser?.displayName || 'Jerry Admin',
        createdAt: new Date().toISOString()
      });

      alert('Database seeded successfully with default materials!');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      alert('Error seeding database: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Utility to parse YouTube URL to 11-char Video ID
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

  // Image Upload handler for Storage
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('Uploading...');
    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      if (editingItem) {
        setEditingItem({
          ...editingItem,
          data: {
            ...editingItem.data,
            [fieldName]: downloadUrl
          }
        });
      }
      setUploadProgress('Uploaded successfully!');
    } catch (err: any) {
      alert('Error uploading to storage: ' + err.message + '\n(You can also just paste a standard Image URL directly instead!)');
      setUploadProgress('Upload failed.');
    }
  };

  // Trigger resource additions/edits
  const handleEditInit = (type: string, data: any = {}) => {
    let initialData = { ...data };
    if (!data.id && type === 'posts') {
      initialData = { 
        category: 'Briefing', 
        title: '', 
        desc: '', 
        content: '', 
        youtubeUrl: '', 
        publishStatus: 'published', 
        publishedAt: new Date().toISOString().split('T')[0], 
        tags: [],
        ...data 
      };
    } else if (!data.id && type === 'episodes') {
      initialData = {
        programmeId: programmes[0]?.id || '',
        title: '',
        desc: '',
        youtubeUrl: '',
        publishStatus: 'published',
        publishedAt: new Date().toISOString().split('T')[0],
        duration: '00:00',
        ...data
      };
    } else if (!data.id && type === 'programmes') {
      initialData = {
        id: '',
        tag: '',
        title: '',
        desc: '',
        about: '',
        img: '',
        meta: { Cadence: 'Weekly', Format: 'Video Conversation', Audience: 'Professionals' },
        link: '/programmes/',
        linkText: 'Browse Episodes',
        comingSoon: false,
        ...data
      };
    } else if (!data.id && type === 'users') {
      initialData = {
        uid: '',
        email: '',
        name: '',
        role: 'admin',
        ...data
      };
    }
    setEditingItem({ type, data: initialData });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { type, data } = editingItem;
    setLoading(true);

    try {
      // Custom formatting for IDs
      let documentId = data.id || data.uid;

      // Autocomplete YouTube Video IDs
      if (data.youtubeUrl && !data.videoId) {
        data.videoId = getVideoIdFromUrl(data.youtubeUrl);
        if (data.videoId && !data.thumbnail) {
          data.thumbnail = `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`;
        }
      }

      // Generate random slug-type ID if writing new posts / programs / episodes
      if (!documentId) {
        documentId = (data.title || 'item')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
      }

      const cleanData = { ...data };
      if (cleanData.id === undefined && type !== 'users') {
        cleanData.id = documentId;
      }

      // Save to Firebase
      await setDoc(doc(db, type, documentId), cleanData);
      alert('Saved successfully!');
      setEditingItem(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `${type}/${data.id || data.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (collectionName: string, docId: string) => {
    if (!confirm('Are you sure you want to delete this item permanently?')) return;
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

  const handleUpdateSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    setLoading(true);

    try {
      siteSettings.heroVideoId = getVideoIdFromUrl(siteSettings.heroVideoUrl) || siteSettings.heroVideoId;
      await setDoc(doc(db, 'siteSettings', 'primary'), siteSettings);
      alert('Homepage Settings updated successfully!');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/primary');
    } finally {
      setLoading(false);
    }
  };

  // Unauthenticated Admin screen
  if (!user || !isAdminUser) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-background selection:bg-secondary-container">
        <div className="w-full max-w-md bg-white border border-outline-variant p-unit-xl rounded-lg shadow-xl text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-unit-lg">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h1 className="font-headline-lg text-primary mb-2">Clearpath Console</h1>
          <p className="font-body-md text-on-surface-variant mb-unit-lg">
            Authorized administrator access only. Please sign in with your verified Google email account.
          </p>

          {authError && (
            <div className="mb-unit-md bg-error/10 border border-error text-error p-unit-md text-sm rounded flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button 
            onClick={login}
            className="w-full bg-primary text-white py-3 px-6 rounded-DEFAULT font-label-md hover:bg-primary/95 transition-all flex items-center justify-center gap-3 border shadow-sm cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            Sign In with Google
          </button>
          
          <div className="mt-6 text-xs text-on-surface-variant font-mono">
            Bootstrapped accounts: jerryagbedun@gmail.com
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary text-white shrink-0 flex flex-col border-r border-outline-variant">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-secondary-container" />
          <div>
            <h1 className="font-headline-sm font-semibold tracking-wide">CMS Control</h1>
            <p className="text-[10px] uppercase text-white/60 tracking-wider">Clearpath Media</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {[
            { id: 'overview', label: 'Console Home', icon: LayoutDashboard },
            { id: 'programmes', label: 'Programmes', icon: Tv },
            { id: 'episodes', label: 'Episodes', icon: Video },
            { id: 'posts', label: 'Briefs & Explainers', icon: BookOpen },
            { id: 'siteSettings', label: 'Settings', icon: Settings },
            { id: 'partnerRequests', label: 'Partnerships', icon: Users, qty: partnerRequests.length },
            { id: 'subscribers', label: 'Subscribers', icon: Mail, qty: subscribers.length },
            { id: 'admins', label: 'Admin Users', icon: Users, qty: adminUsers.length }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setEditingItem(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors cursor-pointer ${
                  isActive ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.qty !== undefined && item.qty > 0 && (
                  <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                    {item.qty}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 overflow-hidden shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-semibold truncate leading-none">{user.displayName || 'Admin'}</p>
              <p className="text-[10px] text-white/60 truncate mt-1">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-xs py-2 rounded transition-colors text-white mt-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main CMS panel content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {loading && (
          <div className="mb-6 bg-surface border border-outline-variant p-4 text-center rounded text-sm flex items-center justify-center gap-2 text-on-surface-variant font-mono">
            <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            Loading Database Records...
          </div>
        )}

        {/* Console Home Overview screen */}
        {activeTab === 'overview' && !editingItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white border border-outline-variant p-6 rounded-lg">
              <div>
                <h1 className="font-headline-lg text-primary">Console Home Dashboard</h1>
                <p className="font-body-md text-on-surface-variant">Welcome back, {user.displayName || 'Admin'}. Access control verified. Standard databases live.</p>
              </div>
              <button 
                onClick={seedSampleData}
                className="bg-secondary text-white px-5 py-2.5 rounded font-label-md text-sm hover:bg-secondary/95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4" /> Initialize / Seed Sample Data
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Programmes', count: programmes.length, desc: 'Active series blocks' },
                { title: 'Episodes', count: episodes.length, desc: 'Uploaded video episodes' },
                { title: 'Explainers & Briefs', count: posts.length, desc: 'Dynamic text/video material' },
                { title: 'Partner Requests', count: partnerRequests.length, desc: 'Business leads pending review' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-outline-variant p-6 rounded-lg">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider">{stat.title}</span>
                  <div className="text-3xl font-bold text-primary mt-2">{stat.count}</div>
                  <p className="text-xs text-on-surface-variant mt-1">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-outline-variant rounded-lg p-6">
              <h2 className="font-headline-md text-primary mb-4">Quick Diagnostic Logs</h2>
              <div className="text-xs font-mono bg-surface-container-high p-4 rounded-md space-y-2 text-on-surface">
                {programmes.length === 0 ? (
                  <p className="text-error flex items-center gap-1">⚠️ Programmes collection is blank. Click 'Initialize / Seed Sample Data' above to populate!</p>
                ) : (
                  <p className="text-green-600 flex items-center gap-1">✓ Programmes collection contains {programmes.length} records.</p>
                )}
                {episodes.length === 0 ? (
                  <p className="text-error flex items-center gap-1">⚠️ Episodes collection is blank. Seed or add episodes to show lists.</p>
                ) : (
                  <p className="text-green-600 flex items-center gap-1">✓ Episodes collection contains {episodes.length} listings.</p>
                )}
                {posts.length === 0 ? (
                  <p className="text-error flex items-center gap-1">⚠️ Posts (Briefs/Explainers) are empty. Archive views will be placeholder-only.</p>
                ) : (
                  <p className="text-green-600 flex items-center gap-1">✓ Posts contains {posts.length} entries.</p>
                )}
                <p className="text-on-surface-variant">Database Endpoint: {firebaseConfig.projectId}</p>
                <p className="text-on-surface-variant">Authorized Root Operator: jerryagbedun@gmail.com</p>
              </div>
            </div>
          </div>
        )}

        {/* CMS tabs sections */}
        
        {/* programmes section */}
        {activeTab === 'programmes' && !editingItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-headline-lg text-primary">Manage Programmes</h1>
                <p className="text-sm text-on-surface-variant">Define public programmes with specific audience tags and details.</p>
              </div>
              <button 
                onClick={() => handleEditInit('programmes')}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Programme
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Img</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Audience Tag</th>
                    <th className="p-4">Sequence Rank</th>
                    <th className="p-4">Client Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {programmes.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <img src={p.img} className="w-12 h-8 object-cover rounded border border-outline-variant" />
                      </td>
                      <td className="p-4 font-semibold text-primary">{p.title} {p.comingSoon && <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded">Coming Soon</span>}</td>
                      <td className="p-4 text-on-surface-variant font-mono text-xs">{p.tag}</td>
                      <td className="p-4 text-on-surface-variant">{p.order ?? 0}</td>
                      <td className="p-4 text-xs text-on-surface-variant font-mono">{p.link}</td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditInit('programmes', p)}
                          className="hover:text-primary text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('programmes', p.id)}
                          className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {programmes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No programmes added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* episodes section */}
        {activeTab === 'episodes' && !editingItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-headline-lg text-primary">Manage Episodes & Videos</h1>
                <p className="text-sm text-on-surface-variant">Upload program episodes with metadata and embedded play targets.</p>
              </div>
              <button 
                onClick={() => handleEditInit('episodes')}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Episode
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Episode Title</th>
                    <th className="p-4">Programme</th>
                    <th className="p-4">Video ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {episodes.map((ep) => (
                    <tr key={ep.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <img src={ep.thumbnail || `https://img.youtube.com/vi/${ep.videoId}/hqdefault.jpg`} className="w-12 h-8 object-cover rounded border border-outline-variant" />
                      </td>
                      <td className="p-4 font-semibold text-primary">{ep.title}</td>
                      <td className="p-4 text-on-surface-variant font-mono text-xs">{ep.programmeId}</td>
                      <td className="p-4 text-xs text-on-surface-variant font-mono">{ep.videoId}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ep.publishStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ep.publishStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditInit('episodes', ep)}
                          className="hover:text-primary text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('episodes', ep.id)}
                          className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {episodes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No episodes added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* posts briefings & explainers section */}
        {activeTab === 'posts' && !editingItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-headline-lg text-primary">Manage Briefings & Explainers</h1>
                <p className="text-sm text-on-surface-variant">Develop daily updates, announcements, or custom explanation materials.</p>
              </div>
              <button 
                onClick={() => handleEditInit('posts')}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Update Post
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Post Headline</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {posts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-semibold text-primary">{p.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.category === 'Briefing' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {p.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-on-surface-variant">{p.tags?.join(', ') || '-'}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{p.publishedAt}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.publishStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.publishStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditInit('posts', p)}
                          className="hover:text-primary text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('posts', p.id)}
                          className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No updates or explainers added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* site dynamic page configurations section */}
        {activeTab === 'siteSettings' && (
          <div className="bg-white border border-outline-variant p-6 rounded-lg max-w-2xl space-y-6">
            <div>
              <h1 className="font-headline-lg text-primary">System Homepage Settings</h1>
              <p className="text-sm text-on-surface-variant">Update general homepage videos and default configuration options instantly.</p>
            </div>

            {siteSettings && (
              <form onSubmit={handleUpdateSiteSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Homepage Hero Background Loop YouTube URL</label>
                  <input 
                    type="text" 
                    value={siteSettings.heroVideoUrl || `https://www.youtube.com/watch?v=${siteSettings.heroVideoId}`}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroVideoUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded border-outline BG-transparent focus:primary text-sm" 
                    placeholder="https://www.youtube.com/watch?v=3H95x0BV9nA"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1 font-mono">Current Resolved YouTube video ID: {siteSettings.heroVideoId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Seamless Loop Start Frame (Seconds)</label>
                    <input 
                      type="number" 
                      value={siteSettings.heroStart}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroStart: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent focus:primary text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Seamless Loop End Frame (Seconds)</label>
                    <input 
                      type="number" 
                      value={siteSettings.heroEnd}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroEnd: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent focus:primary text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Primary Featured Briefing Post ID</label>
                    <select 
                      value={siteSettings.latestBriefingId || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, latestBriefingId: e.target.value })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    >
                      <option value="">- Dynamic Latest Briefing -</option>
                      {posts.filter(p => p.category === 'Briefing').map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Featured Explainer Post ID</label>
                    <select 
                      value={siteSettings.featuredExplainerId || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, featuredExplainerId: e.target.value })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    >
                      <option value="">- Select Explainer -</option>
                      {posts.filter(p => p.category === 'Explainer').map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-primary text-white py-2 px-6 rounded text-sm font-semibold hover:bg-primary/95 transition-all cursor-pointer"
                >
                  Save Homepage Configuration
                </button>
              </form>
            )}
          </div>
        )}

        {/* partnerRequests section */}
        {activeTab === 'partnerRequests' && !editingItem && (
          <div className="space-y-6">
            <div>
              <h1 className="font-headline-lg text-primary">Institution Partner Requests</h1>
              <p className="text-sm text-on-surface-variant">Review submitted application queries and interest from private/civil organizations.</p>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Sender Nom</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Time Sent</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {partnerRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-semibold text-primary">{r.name}</td>
                      <td className="p-4 text-on-surface">{r.organization || '-'}</td>
                      <td className="p-4 font-mono text-xs text-on-surface-variant">{r.email}</td>
                      <td className="p-4 text-xs text-on-surface max-w-xs truncate" title={r.message}>{r.message}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteItem('partnerRequests', r.id)}
                          className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {partnerRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No requests submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* subscribers section */}
        {activeTab === 'subscribers' && !editingItem && (
          <div className="space-y-6">
            <div>
              <h1 className="font-headline-lg text-primary">Newsletter Subscribers</h1>
              <p className="text-sm text-on-surface-variant">Manage emails signed up for the dynamic daily updates newsletter.</p>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden max-w-xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Registrar Email</th>
                    <th className="p-4">Subscribed At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-mono text-xs text-primary">{s.email}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{new Date(s.subscribedAt).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteItem('newsletterSubscribers', s.id)}
                          className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-on-surface-variant italic">No subscribers yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* admins list */}
        {activeTab === 'admins' && !editingItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-headline-lg text-primary">Console Admin Users</h1>
                <p className="text-sm text-on-surface-variant">Grant other stakeholders the permission to update and manage content.</p>
              </div>
              <button 
                onClick={() => handleEditInit('users')}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Admin User
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden max-w-2xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User UID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role Permission</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {adminUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 text-xs font-mono text-on-surface-variant">{item.uid}</td>
                      <td className="p-4 font-semibold text-primary">{item.name || 'Anonymous'}</td>
                      <td className="p-4 font-mono text-xs">{item.email}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{item.role}</td>
                      <td className="p-4 text-right">
                        {item.email !== 'jerryagbedun@gmail.com' && (
                          <button 
                            onClick={() => handleDeleteItem('users', item.id)}
                            className="hover:text-error text-on-surface-variant p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant italic">No secondary admins registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Form Modal for Creating/Editing CMS items */}
        {editingItem && (
          <div className="bg-white border border-outline-variant rounded-lg p-6 max-w-3xl space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <div>
                <h2 className="font-headline-lg text-primary uppercase text-lg tracking-wide">
                  {editingItem.data.id || editingItem.data.uid ? 'Edit' : 'Create'} {editingItem.type.slice(0, -1)}
                </h2>
                <p className="text-xs text-on-surface-variant font-mono mt-1">Collection ID: {editingItem.data.id || 'Pending Auto-Generation'}</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setUploadProgress(null); }}
                className="text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {editingItem.type === 'programmes' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Programme Slug (Identifier)</label>
                      <input 
                        type="text" 
                        required
                        disabled={!!editingItem.data.id}
                        value={editingItem.data.id || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, id: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm disabled:opacity-50"
                        placeholder="three-things"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Display Category Tag</label>
                      <input 
                        type="text" 
                        required
                        value={editingItem.data.tag || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tag: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="Conversations"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Programme Title</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="Osita Insights"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Short Subtitle / Teaser Description</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.desc || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, desc: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="A structured conversation with leaders and thinkers..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Detailed About Text</label>
                    <textarea 
                      required
                      rows={4}
                      value={editingItem.data.about || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, about: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="Detailed background history of this dynamic programming category."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Banner / Hero Image Poster URL</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.img || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, img: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm mb-2"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="flex items-center gap-3">
                      <label className="bg-surface-container-high px-4 py-2 border border-outline rounded cursor-pointer text-xs font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Image File to Storage
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageFileChange(e, 'img')} 
                        />
                      </label>
                      {uploadProgress && <span className="text-xs font-mono text-primary font-bold">{uploadProgress}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-outline-variant pt-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Metadata: Cadence</label>
                      <input 
                        type="text" 
                        value={editingItem.data.meta?.Cadence || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          data: { 
                            ...editingItem.data, 
                            meta: { ...editingItem.data.meta, Cadence: e.target.value } 
                          } 
                        })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="Twice Monthly"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Metadata: Format</label>
                      <input 
                        type="text" 
                        value={editingItem.data.meta?.Format || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          data: { 
                            ...editingItem.data, 
                            meta: { ...editingItem.data.meta, Format: e.target.value } 
                          } 
                        })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="Video Conversation"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Metadata: Audience</label>
                      <input 
                        type="text" 
                        value={editingItem.data.meta?.Audience || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          data: { 
                            ...editingItem.data, 
                            meta: { ...editingItem.data.meta, Audience: e.target.value } 
                          } 
                        })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="Executives"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Sequence Order (Priority Rank)</label>
                      <input 
                        type="number" 
                        value={editingItem.data.order || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, order: parseInt(e.target.value) || 0 } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      />
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input 
                          type="checkbox" 
                          checked={editingItem.data.comingSoon || false}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, comingSoon: e.target.checked } })}
                          className="rounded border-outline text-primary focus:ring-0"
                        />
                        <span className="font-bold text-on-surface-variant uppercase text-xs">Flag as Coming Soon (Placeholder Mode)</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {editingItem.type === 'episodes' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Associated Programme Series</label>
                      <select 
                        required
                        value={editingItem.data.programmeId || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, programmeId: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      >
                        {programmes.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Duration Length</label>
                      <input 
                        type="text" 
                        value={editingItem.data.duration || '00:00'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="42:15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Episode Title</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Episode Summary / Description</label>
                    <textarea 
                      rows={3}
                      value={editingItem.data.desc || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, desc: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">YouTube URL / Share Link</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.youtubeUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, youtubeUrl: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="https://www.youtube.com/watch?v=3H95x0BV9nA"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Publication Status</label>
                      <select 
                        value={editingItem.data.publishStatus || 'published'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, publishStatus: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (CMS Only)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Publish Date</label>
                      <input 
                        type="date" 
                        required
                        value={editingItem.data.publishedAt || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, publishedAt: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Additional Bullet Point Content for Structured Programs page like Briefing */}
                  <div className="border-t border-outline-variant pt-4 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-primary">Structured Content Points (For Detailed Ep Pages)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2">What Happened</label>
                        <textarea 
                          rows={3}
                          value={editingItem.data.whatHappened || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whatHappened: e.target.value } })}
                          className="w-full px-4 py-2 border rounded border-outline text-sm"
                          placeholder="Bullet detail summarizing the context..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2">Why It Matters</label>
                        <textarea 
                          rows={3}
                          value={editingItem.data.whyItMatters || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whyItMatters: e.target.value } })}
                          className="w-full px-4 py-2 border rounded border-outline text-sm"
                          placeholder="Underlying trade or regulatory dynamics..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2">What to Watch Next</label>
                        <textarea 
                          rows={3}
                          value={editingItem.data.whatToWatchNext || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whatToWatchNext: e.target.value } })}
                          className="w-full px-4 py-2 border rounded border-outline text-sm"
                          placeholder="Indicators and milestones for updates..."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {editingItem.type === 'posts' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Category Classification</label>
                      <select 
                        required
                        value={editingItem.data.category || 'Briefing'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      >
                        <option value="Briefing">Daily Briefing Update</option>
                        <option value="Explainer">Explainer Essay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Tags / Topics (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editingItem.data.tags?.join(', ') || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          data: { 
                            ...editingItem.data, 
                            tags: e.target.value.split(',').map(t => t.trim().toUpperCase()).filter(Boolean) 
                          } 
                        })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                        placeholder="POLICY, TRADE, MINING"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Post Title / Headline</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Teaser Summary Description</label>
                    <textarea 
                      rows={2}
                      value={editingItem.data.desc || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, desc: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">YouTube URL if any (Resolves videoId & thumbnail automatically)</label>
                    <input 
                      type="text" 
                      value={editingItem.data.youtubeUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, youtubeUrl: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="https://www.youtube.com/watch?v=3H95x0BV9nA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Markdown Essay Content (Explainers)</label>
                    <textarea 
                      rows={6}
                      value={editingItem.data.content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent font-mono text-xs"
                      placeholder="### Explaining structural changes in West African Trade policies..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Publication Status</label>
                      <select 
                        value={editingItem.data.publishStatus || 'published'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, publishStatus: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (CMS Only)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Publish Date</label>
                      <input 
                        type="date" 
                        required
                        value={editingItem.data.publishedAt || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, publishedAt: e.target.value } })}
                        className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      />
                    </div>
                  </div>

                  {editingItem.data.category === 'Briefing' && (
                    <div className="border-t border-outline-variant pt-4 space-y-4">
                      <h3 className="text-sm font-bold uppercase text-primary">Daily Brief Structured Sections</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant mb-2">What Happened</label>
                          <textarea 
                            rows={3}
                            value={editingItem.data.whatHappened || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whatHappened: e.target.value } })}
                            className="w-full px-4 py-2 border rounded border-outline text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant mb-2">Why It Matters</label>
                          <textarea 
                            rows={3}
                            value={editingItem.data.whyItMatters || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whyItMatters: e.target.value } })}
                            className="w-full px-4 py-2 border rounded border-outline text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant mb-2">What to Watch Next</label>
                          <textarea 
                            rows={3}
                            value={editingItem.data.whatToWatchNext || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, whatToWatchNext: e.target.value } })}
                            className="w-full px-4 py-2 border rounded border-outline text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {editingItem.type === 'users' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">New Admin User UID (Identifier)</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem.data.uid || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, uid: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="Paste User's UID from Firebase Auth Console"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={editingItem.data.email || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, email: e.target.value } })}
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Authentication Role</label>
                    <select 
                      value="admin"
                      disabled
                      className="w-full px-4 py-2 border rounded border-outline BG-transparent text-sm opacity-50 bg-gray-50"
                    >
                      <option value="admin">Administrator Role (Pre-configured)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-4 border-t border-outline-variant pt-4">
                <button 
                  type="submit" 
                  className="bg-primary text-white py-2 px-6 rounded text-sm font-semibold hover:bg-primary/95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Record
                </button>
                <button 
                  type="button" 
                  onClick={() => { setEditingItem(null); setUploadProgress(null); }}
                  className="border border-outline px-6 py-2 rounded text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
