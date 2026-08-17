const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Remove orderBy
code = code.replace(/orderBy\('publishedAt', 'desc'\), /, '');

// Client side sort
code = code.replace(/const articles = results\[5\]\.value\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as ClearPathDailyArticle\[\];/, `let articles = results[5].value.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ClearPathDailyArticle[];
        articles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });`);

fs.writeFileSync('src/pages/Home.tsx', code);
