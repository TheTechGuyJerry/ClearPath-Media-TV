const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The prompt said: "remove the short explanation and why it matters in signals to watch"
content = content.replace(
  /\{ name: 'shortExplanation', label: 'Short Explanation', type: 'textarea' \},\s*\{ name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' \},/g,
  ""
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
