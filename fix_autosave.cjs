const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

const autoSaveHook = `
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

if (!content.includes('setLastSaved')) {
  content = content.replace("const [formData, setFormData] = useState<ClearPathDailyArticle>", autoSaveHook + "\n  const [formData, setFormData] = useState<ClearPathDailyArticle>");
}

const saveButtonIndicator = `{lastSaved && <span className="text-xs text-on-surface-variant self-center mr-4">Draft auto-saved {lastSaved.toLocaleTimeString()}</span>}`;

if (!content.includes('Draft auto-saved')) {
  content = content.replace(
    '<button type="button" onClick={handleCancel}',
    saveButtonIndicator + '\n              <button type="button" onClick={handleCancel}'
  );
}

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
