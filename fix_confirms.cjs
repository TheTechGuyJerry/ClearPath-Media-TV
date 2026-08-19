const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');
content = content.replace(/!confirm\([^)]+\)/g, 'false'); // If it was !confirm(...), now it's false, so it won't return early. Wait, if !false => true => it would return false! We should replace `if (!skipConfirm && !confirm(...)) return false;` with nothing or just remove the confirm check.

// Actually let's just replace the exact lines
content = content.replace(/if \(!skipConfirm && !confirm\([^)]+\)\) return false;/g, '');
fs.writeFileSync('src/pages/admin/AdminContext.tsx', content);

let usersContent = fs.readFileSync('src/pages/admin/AdminUsers.tsx', 'utf8');
usersContent = usersContent.replace(/if \(\s*confirm\([^)]+\)\s*\)\s*\{/g, 'if (true) {');
fs.writeFileSync('src/pages/admin/AdminUsers.tsx', usersContent);

