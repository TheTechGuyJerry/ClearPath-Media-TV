const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

c = c.replace(/import CMSForm from '\.\.\/\.\.\/components\/admin\/CMSForm';\n/, '');

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', c);
