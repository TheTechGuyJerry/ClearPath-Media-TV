const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUsers.tsx', 'utf8');

content = content.replace(
  /if \(confirm\(`Are you sure you want to permanently remove administrator credentials for "\$\{user\.name \|\| user\.displayName\}" \(\$\{user\.email\}\)\?`\)\) \{/g,
  'if (true) {'
);

fs.writeFileSync('src/pages/admin/AdminUsers.tsx', content);
