const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// The initial fields state for in-focus
content = content.replace(
  /title: '', excerpt: '', authorName: '', authorTitle: ''/g,
  "title1: '', excerpt1: '', title2: '', excerpt2: ''"
);

// We had already removed authorName and authorTitle in an earlier step, let's just make sure
content = content.replace(
  /title: '', excerpt: ''/g,
  "title1: '', excerpt1: '', title2: '', excerpt2: ''"
);


fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
