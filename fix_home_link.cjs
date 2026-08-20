const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = "link: '/daily/' + a.categorySlug + '/' + a.slug";
const replacementStr = "link: getArticleUrl(a, a.categorySlug)";

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Success Home.tsx link fix");
} else {
  console.log("Failed to find link string in Home.tsx");
}
