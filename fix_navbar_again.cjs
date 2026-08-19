const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// I saw the 'ClearPath Daily' link might not be removed if it's slightly different
const regex = /\{\s*name:\s*'ClearPath Daily',\s*path:\s*'\/clearpath-daily'\s*\},\s*/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/Navbar.tsx', content);
