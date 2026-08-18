import fs from 'fs';

let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const target = `                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
                    {article.authorName?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface leading-none">{article.authorName || 'ClearPath Editorial'}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{article.publishedAt}</p>
                  </div>
                </div>`;

const replacement = `                <div className="flex items-center gap-3">
                  {article.authorName ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
                        {article.authorName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface leading-none">{article.authorName}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{article.publishedAt}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-xs text-on-surface-variant">{article.publishedAt}</p>
                    </div>
                  )}
                </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/ArticlePage.tsx', content);

let inFocusContent = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');
const inFocusTarget = `                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface">
                        {story.authorName?.[0] || 'CP'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface leading-none">{story.authorName || 'ClearPath'}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{story.publishedAt}</p>
                      </div>`;
const inFocusReplacement = `                      {story.authorName ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface">
                            {story.authorName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-on-surface leading-none">{story.authorName}</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{story.publishedAt}</p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-[10px] text-on-surface-variant">{story.publishedAt}</p>
                        </div>
                      )}`;
inFocusContent = inFocusContent.replace(inFocusTarget, inFocusReplacement);
fs.writeFileSync('src/pages/news/InFocusPage.tsx', inFocusContent);

console.log("Fixed authors.");
