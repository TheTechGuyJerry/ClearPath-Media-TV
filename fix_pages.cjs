const fs = require('fs');

// 1. Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(
    /<Link to="\/explainers" className=\{getLinkClass\('\/explainers'\)\}>Analysis<\/Link>/,
    '<Link to="/election-matters-weekly" className={getLinkClass(\'/election-matters-weekly\')}>Election Matters Weekly</Link>'
);
navbar = navbar.replace(
    /<Link to="\/explainers" className=\{getLinkClass\('\/explainers', true\)\} onClick=\{[^>]*\}>Analysis<\/Link>/,
    '<Link to="/election-matters-weekly" className={getLinkClass(\'/election-matters-weekly\', true)} onClick={() => setIsMobileMenuOpen(false)}>Election Matters Weekly</Link>'
);
fs.writeFileSync('src/components/Navbar.tsx', navbar);

// 2. ClearPathLensPage.tsx
let lensPage = fs.readFileSync('src/pages/ClearPathLensPage.tsx', 'utf8');
lensPage = lensPage.replace(/\{article\.lensHeadline\}/g, '');
lensPage = lensPage.replace(/<h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-serif text-on-surface leading-tight mb-6">\s*<\/h2>/, '');
fs.writeFileSync('src/pages/ClearPathLensPage.tsx', lensPage);

// 3. ClearPathDailySidebar.tsx
let sidebar = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');
sidebar = sidebar.replace(/article\.lensHeadline \|\|/g, '');
fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', sidebar);

// 4. TheIndicatorPage.tsx
let indicatorPage = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');
const indicatorRegex = /\{currentIndicator\.supportingSourceUrl && \([\s\S]*?\}\)/;
indicatorPage = indicatorPage.replace(indicatorRegex, '');
fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', indicatorPage);

