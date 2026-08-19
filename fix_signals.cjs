const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

content = content.replace(
  /\{ name: 'signalEvent', label: 'Event Name', type: 'text', required: true \},\s*\{ name: 'signalDateOrDay', label: 'Date or Day', type: 'text' \},\s*\{ name: 'excerpt', label: 'Short Explanation', type: 'textarea' \},\s*\{ name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' \},\s*\{ name: 'relatedLinkTitle', label: 'Related Link Title', type: 'text' \},\s*\{ name: 'relatedLinkUrl', label: 'Related Link URL', type: 'text' \},/g,
  `{ name: 'signalEvent1', label: 'Event 1 Name', type: 'text', required: true },
      { name: 'signalDateOrDay1', label: 'Event 1 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle1', label: 'Event 1 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl1', label: 'Event 1 Related Link URL', type: 'text' },
      { name: 'signalEvent2', label: 'Event 2 Name', type: 'text' },
      { name: 'signalDateOrDay2', label: 'Event 2 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle2', label: 'Event 2 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl2', label: 'Event 2 Related Link URL', type: 'text' },`
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
