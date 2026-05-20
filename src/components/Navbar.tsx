import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop mx-auto h-20 md:h-24">
          <div className="flex items-center gap-gutter h-full">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-full py-2">
              <img src="/logo.png" alt="Clearpath Media" className="h-[80px] md:h-[110px] w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left" />
            </Link>
            <div className="hidden lg:flex items-center gap-unit-lg h-full pt-1">
              <Link to="/" className={getLinkClass('/')}>Home</Link>
              <Link to="/programmes" className={getLinkClass('/programmes')}>Programmes</Link>
              <Link to="/briefing" className={getLinkClass('/briefing')}>Briefing</Link>
              <Link to="/explainers" className={getLinkClass('/explainers')}>Explainers</Link>
              <Link to="/about" className={getLinkClass('/about')}>About</Link>
              <Link to="/partner" className={getLinkClass('/partner')}>Partner With Us</Link>
            </div>
          </div>
          <div className="flex items-center gap-unit-md mt-1">
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all scale-95 duration-150 ease-in-out">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to="/partner"
              className="hidden lg:inline-flex bg-primary text-white font-label-sm px-5 py-2.5 rounded-sm uppercase tracking-wider hover:bg-primary-container transition-all text-xs font-bold items-center justify-center h-10"
              id="desktop-partner-button"
            >
              Partner with us
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
          <div className="lg:hidden border-t border-outline-variant absolute top-full left-0 w-full bg-background shadow-lg pb-4">
            <div className="flex flex-col py-2">
              <Link to="/" className={getLinkClass('/', true)} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/programmes" className={getLinkClass('/programmes', true)} onClick={() => setIsMobileMenuOpen(false)}>Programmes</Link>
              <Link to="/briefing" className={getLinkClass('/briefing', true)} onClick={() => setIsMobileMenuOpen(false)}>Briefing</Link>
              <Link to="/explainers" className={getLinkClass('/explainers', true)} onClick={() => setIsMobileMenuOpen(false)}>Explainers</Link>
              <Link to="/about" className={getLinkClass('/about', true)} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link to="/partner" className={getLinkClass('/partner', true)} onClick={() => setIsMobileMenuOpen(false)}>Partner With Us</Link>
            </div>
            <div className="px-4 pt-2 border-t border-outline-variant">
              <Link 
                to="/partner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-white font-label-sm px-4 py-3 rounded-sm uppercase tracking-wider hover:bg-primary-container transition-colors mt-2 text-center block font-bold text-xs font-label-sm"
                id="mobile-partner-button"
              >
                Partner with us
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
