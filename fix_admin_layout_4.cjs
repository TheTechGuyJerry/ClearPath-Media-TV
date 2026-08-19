const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

content = content.replace(
  /\{\(userRole === 'super_admin' \|\| userRole === 'admin' \|\| userRole === 'content_admin' \|\| userRole === 'viewer_admin'\) && \(\s*\{userRole === 'super_admin' && \(/,
  `{userRole === 'super_admin' && (`
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
