const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The prompt said: "in focus we have 2 focus section for one page each day, so the gold number entry should allow for to focus entry data for each day"
content = content.replace(
  /\{ name: 'title', label: 'Title', type: 'text', required: true \},\s*\{ name: 'excerpt', label: 'Excerpt', type: 'textarea' \},/g,
  `{ name: 'title1', label: 'Focus 1 Title', type: 'text', required: true },
      { name: 'excerpt1', label: 'Focus 1 Excerpt', type: 'textarea' },
      { name: 'title2', label: 'Focus 2 Title', type: 'text' },
      { name: 'excerpt2', label: 'Focus 2 Excerpt', type: 'textarea' },`
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
