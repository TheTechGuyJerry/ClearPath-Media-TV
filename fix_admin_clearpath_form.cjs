const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

const formReplacement = `
        <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant shadow-sm space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFields.map((f, i) => (
                <div key={i} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">{f.label} {f.required && '*'}</label>
                  {f.type === 'textarea' ? (
                    <textarea 
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      rows={5}
                      className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    >
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'boolean' ? (
                    <select
                      value={formData[f.name as keyof typeof formData] ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <input 
                      type={f.type}
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end border-t border-outline-variant pt-4 mt-4">
              <button type="button" onClick={handleCancel} className="px-4 py-2 border border-outline hover:bg-surface-container-high rounded text-sm font-semibold cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer">
                Save Record
              </button>
            </div>
          </form>
        </div>
`;

c = c.replace(/<CMSForm[\s\S]*?\/>/, formReplacement);

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', c);
