const fs = require('fs');
let code = fs.readFileSync('src/components/common/RichContentRenderer.tsx', 'utf8');

// Replace the content assignment
const replaceContent = `
  if (!content || !content.trim()) {
`;
const newContent = `
  // Replace non-breaking spaces with normal spaces to prevent unbreakable lines overflowing
  const normalizedContent = content ? content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') : '';

  if (!normalizedContent || !normalizedContent.trim()) {
`;

code = code.replace(replaceContent, newContent);

// Replace content with normalizedContent in DOMPurify
code = code.replace('DOMPurify.sanitize(content,', 'DOMPurify.sanitize(normalizedContent,');

// Replace content in isHtml check
code = code.replace('test(content);', 'test(normalizedContent);');

// Add break-words back
code = code.replace('w-full max-w-full min-w-0\n        text-on-surface', 'w-full max-w-full min-w-0 break-words\n        text-on-surface');

fs.writeFileSync('src/components/common/RichContentRenderer.tsx', code);
