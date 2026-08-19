const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The prompt said: "for clearpath leands, remove the headline entry, no need for headline"
content = content.replace(
  /\{ name: 'lensHeadline', label: 'Headline', type: 'text' \},/g,
  ""
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
