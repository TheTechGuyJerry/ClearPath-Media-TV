const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The prompt said: "In focus, emove the author name and author title entry"
content = content.replace(
  /\{ name: 'authorName', label: 'Author Name', type: 'text' \},\s*\{ name: 'authorTitle', label: 'Author Title', type: 'text' \},/g,
  ""
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
