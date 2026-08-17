const fs = require('fs');
let c = fs.readFileSync('firestore.rules', 'utf8');

const newRule = `
    // 13. ClearPath Daily Articles
    match /clearpath_daily_articles/{docId} {
      allow read: if true;
      allow write: if isEditorOrSuperAdmin();
    }
  }
}
`;

c = c.replace(/  \}\n\}\n$/, newRule);

fs.writeFileSync('firestore.rules', c);
