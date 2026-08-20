const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

if (!content.includes('import rehypeRaw')) {
  content = content.replace("import ReactMarkdown from 'react-markdown';", "import ReactMarkdown from 'react-markdown';\nimport rehypeRaw from 'rehype-raw';\nimport DOMPurify from 'dompurify';");
}

const safeRenderCode = `
  const getSafeContent = (rawContent: string | undefined | null) => {
    if (!rawContent) return 'Content not found.';
    return DOMPurify.sanitize(rawContent, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    });
  };
`;

if (!content.includes('getSafeContent(')) {
  content = content.replace("export default function ArticlePage() {", "export default function ArticlePage() {\n" + safeRenderCode);
}

// Replace <ReactMarkdown>{article.content...}</ReactMarkdown>
content = content.replace(/<ReactMarkdown>\{article\.content1 \|\| article\.content \|\| ''\}<\/ReactMarkdown>/g, "<ReactMarkdown rehypePlugins={[rehypeRaw]}>{getSafeContent(article.content1 || article.content)}</ReactMarkdown>");
content = content.replace(/<ReactMarkdown>\{article\.content2 \|\| ''\}<\/ReactMarkdown>/g, "<ReactMarkdown rehypePlugins={[rehypeRaw]}>{getSafeContent(article.content2)}</ReactMarkdown>");
content = content.replace(/<ReactMarkdown>\s*\{article\.content \|\| 'Content not found\.'\}\s*<\/ReactMarkdown>/g, "<ReactMarkdown rehypePlugins={[rehypeRaw]}>{getSafeContent(article.content)}</ReactMarkdown>");

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
