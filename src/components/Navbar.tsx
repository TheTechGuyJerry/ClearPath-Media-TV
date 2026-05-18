import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import JoinModal from './JoinModal';

export default function Navbar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto h-20">
          <div className="flex items-center gap-gutter h-full">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-headline-md font-headline-md font-bold tracking-tight text-primary">
              CLEARPATH MEDIA
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
          <div className="flex items-center gap-unit-md">
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all scale-95 duration-150 ease-in-out">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden lg:flex bg-primary text-white font-label-sm px-4 py-2 rounded-sm uppercase tracking-wide hover:bg-primary-container transition-colors"
            >
              Subscribe
            </button>
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
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full bg-primary text-white font-label-sm px-4 py-3 rounded-sm uppercase tracking-wide hover:bg-primary-container transition-colors mt-2"
              >
                Subscribe
              </button>
            </div>
          </div>
        )}
      </header>

      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
