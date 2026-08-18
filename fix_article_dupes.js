import fs from 'fs';

let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const lines = content.split('\n');
const fixedLines = [];
let found = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const [isShareOpen, setIsShareOpen] = useState(false);')) {
    found++;
    if (found > 1) {
      // skip these duplicate lines
      i += 7; // skips isShareOpen, copied, currentUrl, empty line, handleCopyLink and its body
      continue;
    }
  }
  fixedLines.push(lines[i]);
}

fs.writeFileSync('src/pages/ArticlePage.tsx', fixedLines.join('\n'));
console.log("Fixed duplicates");
