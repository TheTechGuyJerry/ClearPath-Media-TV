const fs = require('fs');

const files = [
  'src/pages/news/TodaysBriefPage.tsx',
  'src/pages/news/InFocusPage.tsx',
  'src/pages/news/TheIndicatorPage.tsx',
  'src/pages/news/ThePublicRecordPage.tsx',
  'src/pages/news/SignalsToWatchPage.tsx',
  'src/pages/ClearPathLensPage.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  
  // Find the start of the section
  const sectionStartRegex = /\{?\/\*\s*(?:Lead )?Featured.*?\*\/\}?\s*(?:\{[a-zA-Z]+\s*&&\s*\()?\s*<section className="bg-surface-bright border-2 border-primary\/20.*?>/;
  
  const match = content.match(sectionStartRegex);
  if (match) {
    const startIndex = match.index;
    
    // Find the matching </section>
    let openTags = 0;
    let pos = startIndex + match[0].length;
    let endIndex = -1;
    
    while (pos < content.length) {
      if (content.substr(pos, 9) === '<section ' || content.substr(pos, 9) === '<section>') {
        openTags++;
      } else if (content.substr(pos, 10) === '</section>') {
        if (openTags === 0) {
          endIndex = pos + 10;
          // Check if there's a trailing `)}` for Lead Featured
          const tail = content.substr(endIndex, 20);
          if (tail.includes(')}')) {
            endIndex += tail.indexOf(')}') + 2;
          }
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
  } else {
    console.log(`No match found in ${file}`);
  }
}
