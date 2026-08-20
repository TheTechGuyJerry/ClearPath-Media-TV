const fs = require('fs');
let content = fs.readFileSync('src/pages/ClearPathLensPage.tsx', 'utf8');

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
  content = content.replace("export default function ClearPathLensPage() {", "export default function ClearPathLensPage() {\n" + safeRenderCode);
}

content = content.replace(/<ReactMarkdown>\{currentLens\.introductorySummary \|\| currentLens\.excerpt \|\| ''\}<\/ReactMarkdown>/g, "<ReactMarkdown rehypePlugins={[rehypeRaw]}>{getSafeContent(currentLens.introductorySummary || currentLens.excerpt || '')}</ReactMarkdown>");
content = content.replace(/<ReactMarkdown>\{currentLens\.institutionalAnalysis \|\| currentLens\.content \|\| ''\}<\/ReactMarkdown>/g, "<ReactMarkdown rehypePlugins={[rehypeRaw]}>{getSafeContent(currentLens.institutionalAnalysis || currentLens.content || '')}</ReactMarkdown>");

fs.writeFileSync('src/pages/ClearPathLensPage.tsx', content);
