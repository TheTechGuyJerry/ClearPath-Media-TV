const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

if (!c.includes('import AdminClearPathDaily')) {
  // Add import
  c = c.replace(/import AdminProgrammes from '\.\/pages\/admin\/AdminProgrammes';/, 'import AdminProgrammes from \'./pages/admin/AdminProgrammes\';\nimport AdminClearPathDaily from \'./pages/admin/AdminClearPathDaily\';');
  
  // Add route
  c = c.replace(/<Route path="programmes" element={<AdminProgrammes \/>} \/>/, '<Route path="programmes" element={<AdminProgrammes />} />\n                    <Route path="clearpath-daily/:menuSlug" element={<AdminClearPathDaily />} />');
  
  fs.writeFileSync('src/App.tsx', c);
}
