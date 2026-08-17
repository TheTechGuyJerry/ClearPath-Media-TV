const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const hookLogic = `
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = prevScrollPos < currentScrollPos;

      if (isScrollingDown && currentScrollPos > 80) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Close mobile menu on Escape key press`;

c = c.replace(/\/\/ Close mobile menu on Escape key press/, hookLogic);

c = c.replace(/<header className="bg-background border-b border-outline-variant w-full z-50 sticky top-0">/, `<header className={\`bg-background border-b border-outline-variant w-full z-50 sticky top-0 transition-transform duration-300 \${isNavVisible ? 'translate-y-0' : '-translate-y-full'}\`}>`);

fs.writeFileSync('src/components/Navbar.tsx', c);
