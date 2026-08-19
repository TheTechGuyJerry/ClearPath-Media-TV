const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
  /<Link\s*to="\/explainers"\s*className=\{getLinkClass\('\/explainers'\)\}\s*onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}\s*>\s*Analysis\s*<\/Link>/g,
  '<Link to="/election-matters-weekly" className={getLinkClass(\'/election-matters-weekly\')} onClick={() => setIsMobileMenuOpen(false)}>Election Matters Weekly</Link>'
);
fs.writeFileSync('src/components/Navbar.tsx', content);
