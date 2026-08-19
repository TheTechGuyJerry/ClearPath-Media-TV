const fs = require('fs');

let content = fs.readFileSync('src/components/admin/CMSForm.tsx', 'utf8');

const replacement = `
              <div className="flex flex-col gap-3">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 300 * 1024) {
                      console.log('Image must be less than 300KB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setField('FIELDMACRO', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {data.FIELDMACRO && typeof data.FIELDMACRO === 'string' && data.FIELDMACRO.length > 0 && (
                  <div className="relative w-32 h-20 rounded overflow-hidden border border-outline">
                    <img src={data.FIELDMACRO} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
`;

// Replace various image inputs
const replaceField = (fieldKey) => {
    const regex = new RegExp('<input type="text" value=\\{data.' + fieldKey + ' \\|\\| \'\'\\} onChange=\\{\\(e\\) => setField\\(\'' + fieldKey + '\', e.target.value\\)\\} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />', 'g');
    content = content.replace(regex, replacement.replace(/FIELDMACRO/g, fieldKey));
}

replaceField('coverImage');
replaceField('thumbnailImage');
replaceField('cardImageUrl');
replaceField('coverImageUrl');
replaceField('thumbnailUrl');

fs.writeFileSync('src/components/admin/CMSForm.tsx', content);
