const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// 1. Move the auto-save block
const autoSaveBlock = `
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  React.useEffect(() => {
    if (!formData || !selectedArticleId || selectedArticleId === 'new') return;
    const timer = setTimeout(async () => {
       // Only auto-save if status is draft or we want to save anyway.
       // The prompt says "Add automatic draft saving"
       try {
         await handleSaveItem('clearpath_daily_articles', formData);
         setLastSaved(new Date());
       } catch(e) {}
    }, 15000);
    return () => clearTimeout(timer);
  }, [formData, selectedArticleId, handleSaveItem]);
`;

content = content.replace(autoSaveBlock, '');

// insert it after selectedArticleId
content = content.replace(
  'const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);',
  'const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);\n' + autoSaveBlock
);

// 2. Fix the f.required error
content = content.replace(
  `].map((f, i) => (`,
  `].map((f: any, i) => (`
);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
