const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

c = c.replace(/const \[isNavVisible, setIsNavVisible\] = useState\(true\);[\s\S]*?setPrevScrollPos\(currentScrollPos\);\n    };\n\n    window.addEventListener\('scroll', handleScroll, \{ passive: true \}\);\n    return \(\) => window.removeEventListener\('scroll', handleScroll\);\n  \}, \[prevScrollPos\]\);/m, "const isNavVisible = useNavVisible();");

if (!c.includes('import { useNavVisible }')) {
  c = "import { useNavVisible } from '../hooks/useNavVisible';\n" + c;
}

fs.writeFileSync('src/components/Navbar.tsx', c);
