const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace("limit(15)", "limit(50)");

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Success modifying Home.tsx limit");
