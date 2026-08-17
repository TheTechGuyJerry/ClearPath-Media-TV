const fs = require('fs');

let c = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

c = c.replace(/const commonFields = \[.*?\];/s, '');
c = c.replace(/let specificFields: any\[\] = \[\];.*?const allFields = \[...commonFields, ...specificFields.*?\];/s, `
  let allFields: any[] = [];
  
  // Base fields that almost everything uses for routing/system
  const systemFields = [
    { name: 'slug', label: 'Slug / URL ID', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
    { name: 'isFeatured', label: 'Is Featured?', type: 'boolean' }
  ];

  if (menuSlug === 'todays-brief') {
    allFields = [
      ...systemFields,
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'authorName', label: 'Author Name', type: 'text' },
      { name: 'authorTitle', label: 'Author Title', type: 'text' },
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'text' },
      { name: 'imageCaption', label: 'Image Caption', type: 'text' },
      { name: 'imageCredit', label: 'Image Credit', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
      { name: 'whatToWatchNext', label: 'What To Watch Next', type: 'textarea' },
    ];
  } else if (menuSlug === 'in-focus') {
    allFields = [
      ...systemFields,
      { name: 'goldNumber', label: 'Gold Number (01 or 02)', type: 'select', options: ['01', '02'] },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'authorName', label: 'Author Name', type: 'text' },
      { name: 'authorTitle', label: 'Author Title', type: 'text' },
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
    ];
  } else if (menuSlug === 'the-indicator') {
    allFields = [
      ...systemFields,
      { name: 'indicatorNumber', label: 'Indicator Number (e.g. ₦1.42T or 73.4%)', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'excerpt', label: 'Description', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
      { name: 'supportingSourceTitle', label: 'Supporting Source Title', type: 'text' },
      { name: 'supportingSourceUrl', label: 'Supporting Source URL', type: 'text' },
    ];
  } else if (menuSlug === 'the-public-record') {
    allFields = [
      ...systemFields,
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'speakerName', label: 'Speaker Name', type: 'text', required: true },
      { name: 'speakerPosition', label: 'Speaker Position', type: 'text' },
      { name: 'speakerInstitution', label: 'Speaker Institution', type: 'text' },
      { name: 'speakerSetting', label: 'Setting (e.g., Press Conference)', type: 'text' },
      { name: 'publishedAt', label: 'Date', type: 'text' },
      { name: 'content', label: 'Context', type: 'textarea' },
      { name: 'supportingSourceTitle', label: 'Source Link Title', type: 'text' },
      { name: 'supportingSourceUrl', label: 'Source Link URL', type: 'text' },
    ];
  } else if (menuSlug === 'clearpath-lens') {
    allFields = [
      ...systemFields,
      { name: 'lensHeadline', label: 'Headline', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'coverImage', label: 'Featured Image URL', type: 'text' },
      { name: 'introductorySummary', label: 'Introductory Summary (Markdown)', type: 'textarea' },
      { name: 'institutionalAnalysis', label: 'Institutional Analysis (Markdown)', type: 'textarea' },
    ];
  } else if (menuSlug === 'signals-to-watch') {
    allFields = [
      ...systemFields,
      { name: 'signalEvent', label: 'Event Name', type: 'text', required: true },
      { name: 'signalDateOrDay', label: 'Date or Day', type: 'text' },
      { name: 'excerpt', label: 'Short Explanation', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
      { name: 'relatedLinkTitle', label: 'Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl', label: 'Related Link URL', type: 'text' },
    ];
  } else {
    allFields = systemFields;
  }
`);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', c);
