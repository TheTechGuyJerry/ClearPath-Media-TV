const fs = require('fs');

const file = 'src/pages/news/SignalsToWatchPage.tsx';

let content = fs.readFileSync(file, 'utf-8');

const sectionStartRegex = /\{\/\*\s*Timeline of Upcoming Signals\s*\*\/\}\s*<section className="bg-surface-bright border-2 border-primary\/20.*?>/;

const match = content.match(sectionStartRegex);
if (match) {
  const startIndex = match.index;
  let openTags = 0;
  let pos = startIndex + match[0].length;
  let endIndex = -1;
  
  while (pos < content.length) {
    if (content.substr(pos, 9) === '<section ' || content.substr(pos, 9) === '<section>') {
      openTags++;
    } else if (content.substr(pos, 10) === '</section>') {
      if (openTags === 0) {
        endIndex = pos + 10;
        break;
      } else {
        openTags--;
      }
    }
    pos++;
  }
  
  if (endIndex !== -1) {
    console.log(`Removing section from ${file}`);
    content = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync(file, content);
  }
}
