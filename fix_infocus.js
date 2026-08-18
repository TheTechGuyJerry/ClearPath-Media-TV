import fs from 'fs';

let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

const target = `                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                        {story.authorName?.[0] || 'CP'}
                      </div>
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wide">
                        {story.authorName || 'ClearPath'}
                      </span>
                    </div>`;

const replacement = `                    {story.authorName && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                          {story.authorName[0]}
                        </div>
                        <span className="text-[11px] font-bold text-on-surface uppercase tracking-wide">
                          {story.authorName}
                        </span>
                      </div>
                    )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);

console.log("Fixed InFocus.");
