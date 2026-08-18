import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const hookCode = `      // 6. ClearPath Daily Articles
      if (results[5].status === 'fulfilled') {
        const cpDocs = results[5].value.docs.map((d) => ({ id: d.id, ...d.data() }));
        cpDocs.sort((a, b) => {
          const tA = new Date(a.publishedAt || a.createdAt || 0).getTime();
          const tB = new Date(b.publishedAt || b.createdAt || 0).getTime();
          return tB - tA;
        });
        setCpArticles(cpDocs);
      } else {
        console.error('CP Articles Load Error: ', results[5].reason);
      }

      const isProgActive`;

content = content.replace("      const isProgActive", hookCode);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Fixed home.tsx");
