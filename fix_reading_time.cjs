const fs = require('fs');
const glob = require('glob');

const calcReadTimeFn = `
export function calculateReadTime(text: string = ''): string {
  if (!text) return '3 mins read';
  const words = text.trim().split(/\\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return \`\${mins} mins read\`;
}
`;

let formatters = fs.readFileSync('src/utils/formatters.ts', 'utf8');
if (!formatters.includes('calculateReadTime')) {
  formatters += calcReadTimeFn;
  fs.writeFileSync('src/utils/formatters.ts', formatters);
}

const pages = glob.sync('src/pages/news/*.tsx');
pages.forEach(page => {
  let content = fs.readFileSync(page, 'utf8');
  if (content.includes('readingTime') && !content.includes('calculateReadTime')) {
    content = content.replace(/\{(\w+)\.readingTime\}/g, "{$1.readingTime || calculateReadTime($1.content || $1.excerpt)}");
    if (!content.includes('calculateReadTime(')) {
        // Just in case the regex above failed because it was e.g. { article.readingTime }
    } else {
        content = `import { calculateReadTime } from '../../utils/formatters';\n` + content;
        fs.writeFileSync(page, content);
    }
  }
});
