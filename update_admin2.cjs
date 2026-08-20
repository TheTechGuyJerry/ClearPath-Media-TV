const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

if (!content.includes("import { RichTextEditor }")) {
  content = content.replace(
    "import { Plus, Edit, Trash2 } from 'lucide-react';",
    "import { Plus, Edit, Trash2 } from 'lucide-react';\nimport { RichTextEditor } from '../../components/admin/RichTextEditor';"
  );
}

const target1 = `{f.type === 'textarea' ? (
                    <textarea 
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      rows={5}
                      className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent"
                    />
                  ) : f.type === 'select' ? (`;

const replace1 = `{f.type === 'textarea' ? (
                    <RichTextEditor 
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(val) => setFormData({...formData, [f.name]: val})}
                      placeholder={f.label}
                    />
                  ) : f.type === 'select' ? (`;

content = content.replace(target1, replace1);

const target2 = `{f.type === 'textarea' ? (
                      <textarea 
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-emerald-200 focus:border-emerald-500 rounded text-sm font-mono bg-white"
                      />
                    ) : f.type === 'select' ? (`;

const replace2 = `{f.type === 'textarea' ? (
                      <RichTextEditor 
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(val) => setFormData({...formData, [f.name]: val})}
                        placeholder={f.label}
                      />
                    ) : f.type === 'select' ? (`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
