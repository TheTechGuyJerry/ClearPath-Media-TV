const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace mobile Analysis link
content = content.replace(
  /<Link to="\/explainers" className=\{getLinkClass\('\/explainers', true\)\} onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}>Analysis<\/Link>/,
  '<Link to="/election-matters-weekly" className={getLinkClass(\'/election-matters-weekly\', true)} onClick={() => setIsMobileMenuOpen(false)}>Election Matters Weekly</Link>'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
