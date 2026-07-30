import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import JoinModal from './JoinModal';

// Toggle to true when ready to reveal hidden menu items (ClearPath Daily, Analysis, Weekly Features)
const SHOW_DRAFT_MENU_ITEMS = true;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isFeaturesActive = [
    '/news/west-african-monitor',
    '/news/state-in-focus',
    '/news/lga-brief',
    '/news/governance-brief',
    '/explainers'
  ].some(path => location.pathname === path || (path !== '/' && location.pathname.startsWith(path)));

  const getLinkClass = (path: string, isMobile: boolean = false) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isMobile) {
      return `block px-4 py-3 font-bold text-base transition-colors ${isActive ? 'bg-primary/10 text-primary border-l-[6px] border-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary border-l-[6px] border-transparent'}`;
    }
    return `font-bold text-[13px] xl:text-[14px] 2xl:text-[15px] tracking-wide h-full flex items-center px-1 transition-all duration-150 ease-in-out whitespace-nowrap
      ${isActive ? 'text-primary border-b-[4.5px] border-primary' : 'text-on-surface-variant/85 hover:text-primary border-b-[4.5px] border-transparent'}`;
  };

  return (
    <>
      <header className="bg-background border-b border-outline-variant w-full z-50 sticky top-0">
        <nav className="flex items-center justify-between w-full max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto h-16 md:h-20 xl:h-22 2xl:h-24 relative">
          
          {/* Logo container: cropped asset with exact 150px image width structure */}
          <div className="flex-shrink-0 flex items-center z-10">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="header-logo-link block w-auto min-w-0 p-0 shrink-0"
              aria-label="Go to homepage"
            >
              <img 
                src="/logo-header.png" 
                alt="ClearPath Media" 
                className="header-logo-image block w-[150px] min-w-[150px] h-auto max-w-none max-h-none object-contain shrink-0" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Group: Right-aligned using ml-auto */}
          <div className="hidden xl:flex items-center ml-auto h-full">
            {/* Navigation Links (28px - 32px gap between items) */}
            <div className="flex items-center gap-[28px] h-full mr-6">
              <Link to="/programmes" className={getLinkClass('/programmes')}>Programmes</Link>

              <Link to="/explainers" className={getLinkClass('/explainers')}>Analysis</Link>

              <Link to="/about" className={getLinkClass('/about')}>About</Link>
            </div>

            {/* Search Icon (24px gap from About on left, 22px gap to Partner button on right) */}
            <div className="flex items-center mr-5.5 relative">
              {isSearchOpen && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      navigate(`/briefing?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  className="absolute right-0 top-full mt-2 bg-surface-bright border border-outline-variant p-2 shadow-lg rounded-sm z-50 w-48 md:w-64 animate-fade-in"
                >
                  <input 
                    type="text" 
                    placeholder="Search briefings..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full border border-outline-variant rounded-sm px-3 py-1.5 text-xs bg-surface-container-low focus:outline-none focus:border-primary text-on-surface transition-all"
                  />
                </form>
              )}
              <button 
                onClick={() => {
                  if (isSearchOpen && searchQuery.trim()) {
                    navigate(`/briefing?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  } else {
                    setIsSearchOpen(!isSearchOpen);
                  }
                }}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low/30 rounded-full transition-all scale-100 duration-150 ease-in-out cursor-pointer"
                aria-label="Toggle search bar"
              >
                <Search className="w-5 h-5 xl:w-[21px] xl:h-[21px]" />
              </button>
            </div>
            
            {/* Action Buttons: 16px (gap-4) between Partner with us & Subscribe */}
            <div className="flex items-center gap-4">
              <Link 
                to="/partner"
                className="inline-flex border-[1.5px] border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-wider transition-all text-xs xl:text-[12.5px] 2xl:text-[13.5px] px-4 xl:px-5.5 2xl:px-7 rounded-[3px] items-center justify-center h-10 xl:h-[42px] 2xl:h-[46px] whitespace-nowrap"
                id="desktop-partner-button"
              >
                Partner with us
              </Link>

              <Link 
                to="/subscribe"
                className="inline-flex bg-primary text-white font-bold uppercase tracking-wider hover:bg-primary/95 transition-all text-xs xl:text-[12.5px] 2xl:text-[13.5px] px-5 xl:px-6.5 2xl:px-8.5 rounded-[3px] items-center justify-center h-10 xl:h-[42px] 2xl:h-[46px] shadow-sm whitespace-nowrap"
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
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-outline-variant absolute top-full left-0 w-full bg-background shadow-lg pb-6 animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col py-2">
              <Link to="/programmes" className={getLinkClass('/programmes', true)} onClick={() => setIsMobileMenuOpen(false)}>Programmes</Link>

              <Link to="/explainers" className={getLinkClass('/explainers', true)} onClick={() => setIsMobileMenuOpen(false)}>Analysis</Link>

              <Link to="/about" className={getLinkClass('/about', true)} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            </div>
            
            <div className="px-4 pt-4 border-t border-outline-variant space-y-2.5">
              <Link 
                to="/subscribe"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-white font-label-sm px-4 py-3 rounded-sm uppercase tracking-wider hover:bg-primary-container transition-colors block text-center font-bold text-xs font-label-sm shadow-sm"
                id="mobile-subscribe-button"
              >
                Subscribe
              </Link>
              
              <Link 
                to="/partner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full border border-primary text-primary font-label-sm px-4 py-3 rounded-sm uppercase tracking-wider hover:bg-primary/5 transition-colors text-center block font-bold text-xs font-label-sm"
                id="mobile-partner-button"
              >
                Partner with us
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
