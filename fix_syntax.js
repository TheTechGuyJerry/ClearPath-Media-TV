import fs from 'fs';
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');
content = content.replace('    setTimeout(() => setCopied(false), 2500);\n  };\n  };', '    setTimeout(() => setCopied(false), 2500);\n  };');
content = content.replace('  };\n  const [isShareOpen', '  const [isShareOpen');
content = content.replace('  };\n\n  useEffect', '\n  useEffect');

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
