const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('<Route path="clearpath-daily" element={<Navigate to="/admin/clearpath-daily/todays-brief" replace />} />')) {
  content = content.replace(
    /<Route path="clearpath-daily\/:menuSlug" element=\{<AdminClearPathDaily \/>\} \/>/,
    '<Route path="clearpath-daily" element={<Navigate to="/admin/clearpath-daily/todays-brief" replace />} />\n                    <Route path="clearpath-daily/:menuSlug" element={<AdminClearPathDaily />} />'
  );
  fs.writeFileSync('src/App.tsx', content);
}
