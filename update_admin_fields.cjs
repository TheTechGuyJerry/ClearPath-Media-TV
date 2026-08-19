const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// 1. clearpath-lens: remove lensHeadline
content = content.replace(
  /{ name: 'lensHeadline', label: 'Headline', type: 'text', required: true },/g,
  ''
);

// 2. the-indicator: remove supportingSourceTitle and supportingSourceUrl
content = content.replace(
  /{ name: 'supportingSourceTitle', label: 'Supporting Source Title', type: 'text' },/g,
  ''
);
content = content.replace(
  /{ name: 'supportingSourceUrl', label: 'Supporting Source URL', type: 'text' },/g,
  ''
);

// 3. signals-to-watch: remove excerpt and whyItMatters, and make event 1 and event 2
const signalsToWatchRegex = /\{ name: 'signalEvent'.*?\} \];/s;
const signalsToWatchReplacement = `{ name: 'signalEvent1', label: 'Event 1 Name', type: 'text', required: true },
      { name: 'signalDateOrDay1', label: 'Event 1 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle1', label: 'Event 1 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl1', label: 'Event 1 Related Link URL', type: 'text' },
      { name: 'signalEvent2', label: 'Event 2 Name', type: 'text' },
      { name: 'signalDateOrDay2', label: 'Event 2 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle2', label: 'Event 2 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl2', label: 'Event 2 Related Link URL', type: 'text' },
    ];`;

content = content.replace(signalsToWatchRegex, signalsToWatchReplacement);

// 4. in-focus: remove authorName and authorTitle, allow two focus entry data (we'll replicate fields with 1 and 2 suffixes)
// Currently, in-focus fields:
/*
      { name: 'goldNumber', label: 'Gold Number (01 or 02)', type: 'select', options: ['01', '02'] },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'authorName', label: 'Author Name', type: 'text' },
      { name: 'authorTitle', label: 'Author Title', type: 'text' },
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'image' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
*/
const inFocusRegex = /\{ name: 'goldNumber'.*?\} \];/s;
const inFocusReplacement = `{ name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'title1', label: 'Focus 01 Title', type: 'text', required: true },
      { name: 'readingTime1', label: 'Focus 01 Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage1', label: 'Focus 01 Cover Image URL', type: 'image' },
      { name: 'excerpt1', label: 'Focus 01 Excerpt', type: 'textarea' },
      { name: 'content1', label: 'Focus 01 Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters1', label: 'Focus 01 Why It Matters', type: 'textarea' },
      { name: 'title2', label: 'Focus 02 Title', type: 'text' },
      { name: 'readingTime2', label: 'Focus 02 Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage2', label: 'Focus 02 Cover Image URL', type: 'image' },
      { name: 'excerpt2', label: 'Focus 02 Excerpt', type: 'textarea' },
      { name: 'content2', label: 'Focus 02 Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters2', label: 'Focus 02 Why It Matters', type: 'textarea' },
    ];`;

content = content.replace(inFocusRegex, inFocusReplacement);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
