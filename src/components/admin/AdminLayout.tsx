import React, { useEffect } from 'react';
import { useAdmin } from '../../pages/admin/AdminContext';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Tv, 
  BookOpen, 
  Users, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  Database,
  LogOut,
  X,
  Menu,
  Shield
} from 'lucide-react';

function isRouteAllowed(role: string, pathname: string): boolean {
  if (role === 'super_admin') return true;
  
  const cleanPath = pathname.replace(/\/$/, '') || '/admin';
  if (cleanPath === '/admin') return true;

  if (role === 'admin') {
    // admin gets everything EXCEPT user management
    return !cleanPath.startsWith('/admin/users');
  }

  if (role === 'content_admin') {
    // content_admin gets Programmes, Videos, Explainers, Daily Briefs, YouTube Research
    return (
      cleanPath.startsWith('/admin/programmes') ||
      cleanPath.startsWith('/admin/videos') ||
      cleanPath.startsWith('/admin/explainers') ||
      cleanPath.startsWith('/admin/briefing') ||
      cleanPath.startsWith('/admin/youtube-research')
    );
  }

  if (role === 'viewer_admin') {
    // viewer_admin gets read-only access to everything EXCEPT user management
    return !cleanPath.startsWith('/admin/users');
  }

  return false;
}

export default function AdminLayout() {
  const { 
    user, 
    isAdminUser, 
    userRole, 
    loading, 
    logout,
    programmes,
    explainers,
    programmeVideos,
    briefings,
    partnerRequests,
    subscribers,
    contactMessages
  } = useAdmin();

  const location = useLocation();
  const navigate = useNavigate();

  // Protect Admin Access
  useEffect(() => {
    if (!loading && !user) {
      // Save current path to storage so we can redirect back after login
      localStorage.setItem('admin_redirect_path', location.pathname);
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="font-sans font-medium text-primary text-sm tracking-wide">Syncing CMS workspace...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but not authorized in the users collection (and is not Jerry), show access denied
  if (user && !isAdminUser) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-white border border-outline-variant p-8 rounded-lg shadow-sm text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ShieldAlert className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-primary mb-2">Access Unauthorized</h1>
          <p className="text-sm text-gray-650 leading-relaxed max-w-md mx-auto mb-6">
            You do not have permission to access this admin area. Please contact a super_admin to configure your administrator status and registry email: <span className="font-semibold font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">{user.email}</span>.
          </p>
          <button 
            onClick={() => {
              logout().then(() => navigate('/admin/login'));
            }}
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out from email
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check specific route requirements
  const currentPath = location.pathname;
  const isAllowed = isRouteAllowed(userRole, currentPath);

  // Helper links classes
  const getLinkClass = (paths: string | string[], exact = false) => {
    const list = Array.isArray(paths) ? paths : [paths];
    const isActive = exact 
      ? list.some(p => currentPath === p)
      : list.some(p => currentPath.startsWith(p));
      
    return `w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors cursor-pointer ${
      isActive ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;
  };

  const getSubLinkClass = (slugPath: string) => {
    const isActive = currentPath === slugPath;
    return `w-full text-left truncate block px-2.5 py-1.5 rounded text-[13px] transition-colors ${
      isActive 
        ? 'bg-white/10 font-medium text-white' 
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary text-white shrink-0 flex flex-col border-r border-outline-variant">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-secondary-container" />
          <div>
            <h1 className="font-headline-sm font-bold tracking-wide text-white">CMS Workspace</h1>
            <p className="text-[10px] uppercase text-white/50 tracking-widest font-mono">ClearPath Control</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-215px)]">
          <div className="space-y-1">
            <Link 
              to="/admin" 
              className={getLinkClass('/admin', true)}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Console Home</span>
              </div>
            </Link>
          </div>

          {/* Programmes category */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-white/40 px-3 text-[10px] uppercase tracking-wider font-bold">
                <Link to="/admin/programmes" className="hover:text-white transition-colors">Programmes</Link>
                {userRole !== 'viewer_admin' && (
                  <Link to="/admin/programmes?new=true" className="hover:text-white p-0.5" title="Add New Programme">
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <div className="space-y-0.5 pt-1 border-l border-white/10 ml-2 pl-2">
                {programmes.map((p) => (
                  <Link
                    key={p.id}
                    to={`/admin/programmes/${p.id}`}
                    className={getSubLinkClass(`/admin/programmes/${p.id}`)}
                  >
                    {p.title}
                  </Link>
                ))}
                {programmes.length === 0 && (
                  <span className="text-[10px] text-white/30 italic block px-2.5 py-1">No programmes loaded</span>
                )}
              </div>
            </div>
          )}

          {/* All Programme Videos shortcut */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
            <div className="space-y-1">
              <Link
                to="/admin/videos"
                className={getLinkClass(['/admin/videos'])}
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
              </Link>
            </div>
          )}

          {/* Explainers category */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-white/40 px-3 text-[10px] uppercase tracking-wider font-bold">
                <Link to="/admin/explainers" className="hover:text-white transition-colors">Explainers</Link>
                {userRole !== 'viewer_admin' && (
                  <Link to="/admin/explainers?new=true" className="hover:text-white p-0.5" title="Add New Explainer">
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <div className="space-y-0.5 pt-1 border-l border-white/10 ml-2 pl-2">
                {explainers.map((ex) => (
                  <Link
                    key={ex.id}
                    to={`/admin/explainers/${ex.id}`}
                    className={getSubLinkClass(`/admin/explainers/${ex.id}`)}
                  >
                    {ex.title}
                  </Link>
                ))}
                {explainers.length === 0 && (
                  <span className="text-[10px] text-white/30 italic block px-2.5 py-1">No explainers loaded</span>
                )}
              </div>
            </div>
          )}

          {/* Main system views */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
              <Link
                to="/admin/briefing"
                className={getLinkClass('/admin/briefing')}
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
              </Link>
            )}

            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'viewer_admin') && (
              <Link
                to="/admin/partnerships"
                className={getLinkClass('/admin/partnerships')}
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
              </Link>
            )}

            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'viewer_admin') && (
              <Link
                to="/admin/subscribers"
                className={getLinkClass('/admin/subscribers')}
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
              </Link>
            )}

            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'viewer_admin') && (
              <Link
                to="/admin/contact-messages"
                className={getLinkClass('/admin/contact-messages')}
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
              </Link>
            )}

            {userRole === 'super_admin' && (
              <Link
                to="/admin/users"
                className={getLinkClass('/admin/users')}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <span>Security Registry</span>
                </div>
              </Link>
            )}

            {(userRole === 'super_admin' || userRole === 'admin') && (
              <Link
                to="/admin/settings"
                className={getLinkClass('/admin/settings')}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Site Settings</span>
                </div>
              </Link>
            )}

            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin') && (
              <Link
                to="/admin/youtube-research"
                className={getLinkClass('/admin/youtube-research')}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  <span>YouTube Research</span>
                </div>
              </Link>
            )}
          </div>
        </nav>

        {/* User Info & Logout Button */}
        <div className="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-2">
          <div className="truncate text-left">
            <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider font-mono">Operator</p>
            <p className="text-xs font-bold text-white truncate max-w-full">{user.email}</p>
            <span className="inline-block mt-1 text-[9px] font-bold tracking-wider uppercase font-mono px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container">
              {userRole}
            </span>
          </div>
          <button 
            onClick={() => {
              logout().then(() => navigate('/admin/login'));
            }}
            className="w-full mt-2 border border-white/20 hover:bg-white/10 text-white/90 hover:text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" /> LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        {isAllowed ? (
          <Outlet />
        ) : (
          <div className="p-8 text-center bg-white border border-outline-variant rounded-lg max-w-md mx-auto mt-12 shadow-sm font-sans">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Permission Denied</h2>
            <p className="text-sm text-gray-650 mt-2">You do not have permission to access this page.</p>
          </div>
        )}
      </main>
    </div>
  );
}
