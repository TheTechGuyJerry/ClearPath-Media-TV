const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The prompt said: "for The Indicator, it shouldnt have source title and source"
content = content.replace(
  /\{ name: 'supportingSourceTitle', label: 'Source Link Title', type: 'text' \},/g,
  ""
);
content = content.replace(
  /\{ name: 'supportingSourceUrl', label: 'Source Link URL', type: 'text' \},/g,
  ""
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
