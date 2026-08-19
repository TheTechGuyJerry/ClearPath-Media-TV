const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Ensure that Analysis does not exist in any desktop nav maps
content = content.replace(
  /<Link\s*to="\/explainers"\s*className=\{getLinkClass\('\/explainers'\)\}\s*>\s*Analysis\s*<\/Link>/g,
  '<Link to="/election-matters-weekly" className={getLinkClass(\'/election-matters-weekly\')}>Election Matters Weekly</Link>'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
