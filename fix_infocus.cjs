const fs = require('fs');
let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

// Replace map of inFocusStories (since we've updated how it gets rendered to support 2 focus entries in ONE object)
const regex = /\{inFocusStories\.map\(\(story, idx\) => \([\s\S]*?\}\)\}/;

const replacement = `
              {inFocusStories.map((story) => (
                <React.Fragment key={story.id}>
                  {/* Focus 01 */}
                  {story.title1 && (
                  <section className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all group h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant">
                        <div className="bg-[#1e293b] text-[#facc15] font-serif font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">
                          01
                        </div>
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                          {story.publishedAt}
                        </span>
                      </div>
                      <div className="space-y-4 mb-6">
                        <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider block">
                          DEEP DIVE
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors">
                          <Link to={getArticleUrl({ ...story, title: story.title1 }, 'in-focus')}>
                            {story.title1}
                          </Link>
                        </h2>
                        <p className="text-sm font-medium text-on-surface-variant/90 leading-relaxed line-clamp-3">
                          {story.excerpt1}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-end border-t border-outline-variant/40 mt-auto">
                      <Link
                        to={getArticleUrl({ ...story, title: story.title1 }, 'in-focus')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </section>
                  )}

                  {/* Focus 02 */}
                  {story.title2 && (
                  <section className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all group h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant">
                        <div className="bg-[#1e293b] text-[#facc15] font-serif font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">
                          02
                        </div>
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                          {story.publishedAt}
                        </span>
                      </div>
                      <div className="space-y-4 mb-6">
                        <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider block">
                          DEEP DIVE
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors">
                          <Link to={getArticleUrl({ ...story, title: story.title2 }, 'in-focus')}>
                            {story.title2}
                          </Link>
                        </h2>
                        <p className="text-sm font-medium text-on-surface-variant/90 leading-relaxed line-clamp-3">
                          {story.excerpt2}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-end border-t border-outline-variant/40 mt-auto">
                      <Link
                        to={getArticleUrl({ ...story, title: story.title2 }, 'in-focus')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </section>
                  )}
                </React.Fragment>
              ))}
`;

content = content.replace(regex, replacement.trim());

const importRegex = /import React from 'react';/;
if (!importRegex.test(content)) {
  content = "import React from 'react';\n" + content;
}

fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);
