const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/admin/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // replace confirm() with true
  content = content.replace(/if \(!?window\.confirm\([^)]+\)\) return( false)?;?/g, '');
  content = content.replace(/if \(!?confirm\([^)]+\)\) return( false)?;?/g, '');
  content = content.replace(/if \(window\.confirm\([^)]+\)\) \{/g, 'if (true) {');
  content = content.replace(/if \(confirm\([^)]+\)\) \{/g, 'if (true) {');
  
  // replace alert() with console.log
  content = content.replace(/alert\(/g, 'console.log(');
  
  fs.writeFileSync(file, content);
});
