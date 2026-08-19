const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// Replace the in-focus fields definition block entirely to be sure
const oldInFocus = `  } else if (menuSlug === 'in-focus') {
    allFields = [
      ...systemFields,
      { name: 'goldNumber', label: 'Gold Number (01 or 02)', type: 'select', options: ['01', '02'] },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },      
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'image' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
    ];`;

const newInFocus = `  } else if (menuSlug === 'in-focus') {
    allFields = [
      ...systemFields,
      { name: 'publishedAt', label: 'Published Date', type: 'text' },      
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'image' },
      { name: 'title1', label: 'Focus 1 Title', type: 'text', required: true },
      { name: 'excerpt1', label: 'Focus 1 Excerpt', type: 'textarea' },
      { name: 'content1', label: 'Focus 1 Main Content (Markdown)', type: 'textarea' },
      { name: 'title2', label: 'Focus 2 Title', type: 'text' },
      { name: 'excerpt2', label: 'Focus 2 Excerpt', type: 'textarea' },
      { name: 'content2', label: 'Focus 2 Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
    ];`;

// Find where in-focus fields are defined, it might not match exactly due to spacing
// Let's use a regex replace
const regex = /\} else if \(menuSlug === 'in-focus'\) \{[\s\S]*?\];/;
content = content.replace(regex, newInFocus);

// Let's also update the initial state for title1 etc. if not there
content = content.replace(
  /title: '', excerpt: '', title2: '', excerpt2: ''/g, // We previously did this
  "title1: '', excerpt1: '', content1: '', title2: '', excerpt2: '', content2: '', title: '', excerpt: '', content: ''"
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
