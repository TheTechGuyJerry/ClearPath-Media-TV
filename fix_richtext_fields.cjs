const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

const targetRegex = /\{f\.type === 'textarea' \? \([\s\S]*?<EditorErrorBoundary><RichTextEditor[\s\S]*?\/><\/EditorErrorBoundary>\s*\)\s*:\s*f\.type === 'select' \? \(/g;

const richTextFields = "['content', 'content1', 'content2', 'introductorySummary', 'institutionalAnalysis'].includes(f.name)";

const replaceString = `{f.type === 'textarea' ? (
                    ${richTextFields} ? (
                      <EditorErrorBoundary>
                        <RichTextEditor 
                          value={formData[f.name as keyof typeof formData] as string || ''}
                          onChange={(val) => setFormData({...formData, [f.name]: val})}
                          placeholder={f.label}
                        />
                      </EditorErrorBoundary>
                    ) : (
                      <textarea 
                        required={f.required}
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                        rows={5}
                        className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent"
                      />
                    )
                  ) : f.type === 'select' ? (`

// We have two replacements for f.type === 'textarea' handling.
content = content.replace(targetRegex, replaceString);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
