const fs = require('fs');
let content = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');

content = content.replace(
  /\{clearpathLens\?\.lensHeadline\}/g,
  "{clearpathLens?.title}"
);

content = content.replace(
  /\{topSignal\?\.signalEvent\}/g,
  "{topSignal?.signalEvent1 || topSignal?.title}"
);

fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', content);
