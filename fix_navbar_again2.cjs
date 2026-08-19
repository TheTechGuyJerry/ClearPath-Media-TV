const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Also remove the submenu for clearpath daily if it exists, wait, the navbar is using a static mainNav array.
console.log(content.match(/\{ name: 'Election Matters Weekly', path: '\/election-matters-weekly' \}/) ? "Found Election Matters" : "Not Found");
