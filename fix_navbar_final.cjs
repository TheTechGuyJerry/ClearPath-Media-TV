const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace Analysis with Election Matters Weekly if not done
if (content.includes("name: 'Analysis'")) {
    content = content.replace(/\{\s*name:\s*'Analysis',\s*path:\s*'\/explainers'\s*\}/g, "{ name: 'Election Matters Weekly', path: '/election-matters-weekly' }");
}

fs.writeFileSync('src/components/Navbar.tsx', content);
