const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

if (!content.includes('election-matters')) {
  content = content.replace(
    /\{ name: 'Briefings', path: '\/admin\/briefing', icon: FileText \},/,
    "{ name: 'Election Matters', path: '/admin/election-matters', icon: FileText },\n    { name: 'Briefings', path: '/admin/briefing', icon: FileText },"
  );
}

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
