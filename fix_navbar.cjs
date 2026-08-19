const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
    /\{ name: 'ClearPath Daily', path: '\/clearpath-daily' \},/g,
    ""
);
fs.writeFileSync('src/components/Navbar.tsx', content);
