import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto gap-gutter">
        <div className="flex flex-col gap-unit-sm">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="ClearPath Media" className="h-20 md:h-28 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left hover:opacity-80 transition-opacity -ml-3" />
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            © 2026 ClearPath Media. Explaining power, policy, and society.
          </p>
        </div>
        <nav className="flex flex-wrap gap-unit-md md:gap-unit-lg py-unit-sm opacity-80 hover:opacity-100 transition-opacity">
          <Link to="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Newsletter</Link>
          <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">YouTube</a>
          <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Podcasts</a>
          <Link to="/partner" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Contact</Link>
          <Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Editorial Policy</Link>
          <Link to="/privacy-policy" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Privacy Policy</Link>
          <Link to="/terms-of-use" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary">Terms of Use</Link>
        </nav>
      </div>
    </footer>
  );
}
