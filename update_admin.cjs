const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

content = content.replace(
  /'signalDateOrDay', 'signalEvent', 'relatedLinkTitle', 'relatedLinkUrl'/,
  "'signalDateOrDay1', 'signalEvent1', 'relatedLinkTitle1', 'relatedLinkUrl1', 'signalDateOrDay2', 'signalEvent2', 'relatedLinkTitle2', 'relatedLinkUrl2'"
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
