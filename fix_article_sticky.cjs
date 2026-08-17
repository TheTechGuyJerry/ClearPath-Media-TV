const fs = require('fs');
let c = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

if (!c.includes('import { useNavVisible }')) {
  c = c.replace(/import React, \{ useState \} from 'react';/, "import React, { useState } from 'react';\nimport { useNavVisible } from '../hooks/useNavVisible';");
}

c = c.replace(/const \[copied, setCopied\] = useState\(false\);/, "const [copied, setCopied] = useState(false);\n  const isNavVisible = useNavVisible();");

c = c.replace(/<div className="sticky top-\[64px\] md:top-\[72px\] xl:top-\[80px\] z-30 bg-background\/95 backdrop-blur-md py-3\.5 border-b border-outline-variant\/30 mb-5 transition-all shadow-xs -mx-4 px-4 sm:-mx-6 sm:px-6">/, `<div className={\`sticky \${isNavVisible ? 'top-[64px] md:top-[72px] xl:top-[80px]' : 'top-0'} z-30 bg-background/95 backdrop-blur-md py-3.5 border-b border-outline-variant/30 mb-5 transition-all duration-300 shadow-xs -mx-4 px-4 sm:-mx-6 sm:px-6\`}>`);

fs.writeFileSync('src/pages/ArticlePage.tsx', c);
