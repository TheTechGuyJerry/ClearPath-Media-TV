const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Wait, looking at the previous output, the desktop Analysis link was replaced successfully if it was there, but let's check the mainNav array.
console.log(content.match(/const mainNav = \[([\s\S]*?)\];/)[1]);
