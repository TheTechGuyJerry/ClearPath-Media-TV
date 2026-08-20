const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

if (!content.includes("import { RichTextEditor }")) {
  content = content.replace(
    "import { Plus, Edit, Trash2 } from 'lucide-react';",
    "import { Plus, Edit, Trash2 } from 'lucide-react';\nimport { RichTextEditor } from '../../components/admin/RichTextEditor';"
  );
}

// Replace the two occurrences of <textarea> mapping for f.type === 'textarea'

content = content.replace(
  /\{f\.type === 'textarea' \? \([\s\S]*?<textarea[\s\S]*?className="[^"]*font-mono[^"]*"[\s\S]*?\/>[\s\S]*?\) : f\.type === 'select'/g,
  `{f.type === 'textarea' ? (
                    <RichTextEditor 
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(val) => setFormData({...formData, [f.name]: val})}
                      placeholder={f.label}
                    />
                  ) : f.type === 'select'`
);

// We should run this replacement multiple times to catch both loops if they match.
// Wait, the first regex replaced the first instance. Let's do it with a more generic replacement.
