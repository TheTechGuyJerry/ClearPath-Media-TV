import { useNavVisible } from '../hooks/useNavVisible';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import JoinModal from './JoinModal';
import clearpathLogo from '../assets/clearpath-logo.png';

// Toggle to true when ready to reveal hidden menu items (ClearPath Daily, Analysis, Weekly Features)
const SHOW_DRAFT_MENU_ITEMS = true;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNewsOpen, setIsMobileNewsOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  
  const isNavVisible = useNavVisible();

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getLinkClass = (path: string, isMobile: boolean = false) => {
    const isBriefingPath = (path === '/briefing' || path === '/clearpath-daily') && (location.pathname === '/briefing' || location.pathname === '/clearpath-daily' || location.pathname.startsWith('/briefing/') || location.pathname.startsWith('/clearpath-daily/'));
    const isActive = isBriefingPath || location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isMobile) {
      return `block px-4 py-3 font-bold text-base transition-colors ${isActive ? 'bg-primary/10 text-primary border-l-[6px] border-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary border-l-[6px] border-transparent'}`;
    }
    return `font-bold text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] tracking-wide h-full flex items-center px-0.5 transition-all duration-150 ease-in-out whitespace-nowrap
      ${isActive ? 'text-primary border-b-[4px] border-primary' : 'text-on-surface-variant/85 hover:text-primary border-b-[4px] border-transparent'}`;
  };

  return (
    <>
      <header className={`bg-background border-b border-outline-variant w-full z-50 sticky top-0 transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex items-center justify-between w-full max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto h-16 md:h-18 xl:h-20 relative">
          
          {/* Logo container: Reduced by ~15% for optimal proportion with 28px+ clear margin to navigation */}
          <div className="flex-shrink-0 flex items-center z-10 mr-6 xl:mr-8 2xl:mr-10">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="header-logo-link block w-auto min-w-0 p-0 shrink-0"
              aria-label="Go to homepage"
            >
              <img 
                src={clearpathLogo} 
                alt="ClearPath Media" 
                className="header-logo-image block w-[125px] sm:w-[130px] xl:w-[138px] 2xl:w-[145px] h-auto object-contain shrink-0" 
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = '/logo.png';
                  } else if (target.dataset.triedFallback === 'true') {
                    target.dataset.triedFallback = 'secondary';
                    target.src = '/images/clearpath-logo.png';
                  }
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation Group */}
          <div className="hidden xl:flex items-center justify-end flex-1 h-full min-w-0 gap-7 xl:gap-8">
            {/* Main Navigation Links */}
            <div className="flex items-center gap-4 xl:gap-5.5 2xl:gap-7 h-full ml-auto">
              <Link to="/programmes" className={getLinkClass('/programmes')}>Programmes</Link>

              {/* ClearPath Daily Dropdown & Sections */}
              <div className="relative h-full flex items-center group cursor-pointer">
                <Link 
                  to="/clearpath-daily/todays-brief" 
                  className={`font-bold text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] tracking-wide h-full flex items-center gap-1 px-0.5 transition-all duration-150 ease-in-out whitespace-nowrap ${
                    location.pathname.startsWith('/clearpath-daily') || location.pathname.startsWith('/daily/')
                      ? 'text-primary border-b-[4px] border-primary' 
                      : 'text-on-surface-variant/85 hover:text-primary border-b-[4px] border-transparent'
                  }`}
                >
                  ClearPath Daily
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute top-full left-0 w-64 bg-surface-bright border border-outline-variant shadow-xl rounded-b-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link to="/clearpath-daily/todays-brief" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">Today's Brief</Link>
                    <Link to="/clearpath-daily/in-focus" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">In Focus</Link>
                    <Link to="/clearpath-daily/the-indicator" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">The Indicator</Link>
                    <Link to="/clearpath-daily/the-public-record" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">The Public Record</Link>
                    <Link to="/clearpath-daily/clearpath-lens" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">The ClearPath Lens</Link>
                    <Link to="/clearpath-daily/signals-to-watch" className="block px-4 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary font-medium transition-colors">Signals to Watch</Link>
                    <Link to="/archive" className="block px-4 py-1.5 text-xs text-primary font-bold hover:bg-primary/10 transition-colors border-t border-outline-variant/30 mt-1 pt-1.5">Previous Editions</Link>
                  </div>
                </div>
              </div>



              <Link to="/explainers" className={getLinkClass('/explainers')}>Analysis</Link>

              <Link to="/about" className={getLinkClass('/about')}>About</Link>
            </div>

            {/* Actions: Search + Compact Action Buttons */}
            <div className="flex items-center gap-3 xl:gap-3.5 shrink-0">
              {/* Search Toggle */}
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="absolute right-0 top-full mt-2 bg-surface-bright border border-outline-variant p-2 shadow-lg rounded-md z-50 w-52 md:w-64 animate-fade-in"
                  >
                    <input 
                      type="text" 
                      placeholder="Search publications..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full border border-outline-variant rounded px-3 py-1.5 text-xs bg-surface-container-low focus:outline-none focus:border-primary text-on-surface transition-all"
                    />
                  </form>
                )}
                <button 
                  onClick={() => {
                    if (isSearchOpen && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    } else {
                      setIsSearchOpen(!isSearchOpen);
                    }
                  }}
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50 rounded-full transition-all cursor-pointer"
                  aria-label="Toggle search bar"
                >
                  <Search className="w-4.5 h-4.5 xl:w-5 xl:h-5" />
                </button>
              </div>
              
              {/* Action Buttons: Uniform height, balanced padding */}
              <Link 
                to="/partner"
                className="inline-flex border-[1.5px] border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-wider transition-all text-xs px-3.5 xl:px-4.5 2xl:px-5.5 rounded-[3px] items-center justify-center h-9 xl:h-[38px] 2xl:h-[40px] whitespace-nowrap"
                id="desktop-partner-button"
              >
                Partner with us
              </Link>

              <Link 
                to="/subscribe"
                className="inline-flex bg-primary text-white font-bold uppercase tracking-wider hover:bg-primary/95 transition-all text-xs px-4 xl:px-5 2xl:px-6 rounded-[3px] items-center justify-center h-9 xl:h-[38px] 2xl:h-[40px] shadow-sm whitespace-nowrap"
                id="desktop-subscribe-button"
              >
                Subscribe
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="xl:hidden p-2 text-on-surface-variant hover:text-primary z-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Slide-down Navigation Drawer */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <div className="xl:hidden border-t border-outline-variant absolute top-full left-0 w-full bg-background shadow-2xl pb-6 animate-fade-in max-h-[85vh] overflow-y-auto z-50">
              <div className="flex flex-col py-2">
                <Link to="/programmes" className={getLinkClass('/programmes', true)} onClick={() => setIsMobileMenuOpen(false)}>Programmes</Link>

                {/* Mobile ClearPath Daily Accordion */}
                <div>
                  <button 
                    onClick={() => setIsMobileNewsOpen(!isMobileNewsOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 font-bold text-base text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors border-l-[6px] border-transparent"
                  >
                    <span>ClearPath Daily</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileNewsOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {isMobileNewsOpen && (
                    <div className="bg-surface-container-low/50 py-2 pl-6 pr-4 space-y-1">
                      <Link 
                        to="/clearpath-daily/todays-brief" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Today's Brief
                      </Link>
                      <Link 
                        to="/clearpath-daily/in-focus" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        In Focus
                      </Link>
                      <Link 
                        to="/clearpath-daily/the-indicator" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        The Indicator
                      </Link>
                      <Link 
                        to="/clearpath-daily/the-public-record" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        The Public Record
                      </Link>
                      <Link 
                        to="/clearpath-daily/clearpath-lens" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        The ClearPath Lens
                      </Link>
                      <Link 
                        to="/clearpath-daily/signals-to-watch" 
                        className="block py-1.5 text-xs text-on-surface hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Signals to Watch
                      </Link>
                      <Link 
                        to="/archive" 
                        className="block py-1.5 text-xs text-primary font-bold pt-1 border-t border-outline-variant/30 mt-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Previous Editions
                      </Link>
                    </div>
                  )}
                </div>



                <Link to="/explainers" className={getLinkClass('/explainers', true)} onClick={() => setIsMobileMenuOpen(false)}>Analysis</Link>

                <Link to="/about" className={getLinkClass('/about', true)} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              </div>
              
              <div className="px-4 pt-4 border-t border-outline-variant space-y-2.5">
                <Link 
                  to="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-colors block text-center py-3 rounded-sm shadow-sm"
                  id="mobile-subscribe-button"
                >
                  Subscribe
                </Link>
                
                <Link 
                  to="/partner"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full border border-primary text-primary font-bold text-xs uppercase tracking-wider hover:bg-primary/5 transition-colors text-center block py-3 rounded-sm"
                  id="mobile-partner-button"
                >
                  Partner with us
                </Link>
              </div>
            </div>
          </>
        )}
      </header>
      
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

