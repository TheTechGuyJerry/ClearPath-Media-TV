import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import JoinModal from './JoinModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getLinkClass = (path: string, isMobile: boolean = false) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isMobile) {
      return `block px-4 py-3 font-label-md text-label-md transition-colors ${isActive ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`;
    }
    return `font-label-md text-label-md h-full flex items-center px-3 py-2 transition-all duration-150 ease-in-out hover:bg-surface-container-low rounded-t-sm
      ${isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'}`;
  };

  return (
    <>
      <header className="bg-background border-b border-outline-variant w-full z-50 sticky top-0">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop mx-auto h-20 md:h-24 relative">
          
          {/* Left: Logo container to prevent touching/overlapping */}
          <div className="flex-shrink-0 w-44 md:w-56 h-full flex items-center z-10">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-full py-2">
              <img src="/logo.png" alt="ClearPath Media" className="h-[80px] md:h-[110px] w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left" />
            </Link>
          </div>

          {/* Center: Centralized menu links - detached from logo */}
          <div className="hidden lg:flex items-center justify-center gap-unit-md h-full pt-1 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/programmes" className={getLinkClass('/programmes')}>Programmes</Link>
            <Link to="/programmes/election-matters" className={getLinkClass('/programmes/election-matters')}>Election Matters</Link>
            <Link to="/explainers" className={getLinkClass('/explainers')}>Explainers</Link>
            <Link to="/about" className={getLinkClass('/about')}>About</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-unit-md mt-1 flex-shrink-0 z-10">
            <div className="flex items-center gap-1 relative">
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
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all scale-95 duration-150 ease-in-out cursor-pointer"
                aria-label="Toggle search bar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            <Link 
              to="/partner"
              className="hidden lg:inline-flex border border-primary text-primary hover:bg-primary/5 font-label-sm px-4 py-2 rounded-sm uppercase tracking-wider transition-all text-xs font-bold items-center justify-center h-10"
              id="desktop-partner-button"
            >
              Partner with us
            </Link>

            <Link 
              to="/subscribe"
              className="hidden lg:inline-flex bg-primary text-white font-label-sm px-5 py-2.5 rounded-sm uppercase tracking-wider hover:bg-primary-container transition-all text-xs font-bold items-center justify-center h-10 shadow-sm"
              id="desktop-subscribe-button"
            >
              Subscribe
            </Link>

            <button 
              className="lg:hidden p-2 text-on-surface-variant hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-outline-variant absolute top-full left-0 w-full bg-background shadow-lg pb-6">
            <div className="flex flex-col py-2">
              <Link to="/" className={getLinkClass('/', true)} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/programmes" className={getLinkClass('/programmes', true)} onClick={() => setIsMobileMenuOpen(false)}>Programmes</Link>
              <Link to="/programmes/election-matters" className={getLinkClass('/programmes/election-matters', true)} onClick={() => setIsMobileMenuOpen(false)}>Election Matters</Link>
              <Link to="/explainers" className={getLinkClass('/explainers', true)} onClick={() => setIsMobileMenuOpen(false)}>Explainers</Link>
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
