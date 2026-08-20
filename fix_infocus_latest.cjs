const fs = require('fs');
let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

// replace the block using inFocusStories[0] with latestDoc
const blockRegex = /\{inFocusStories\.length > 0 && \([\s\S]*?<\/section>\s*\)\}/;

const newBlock = `{latestDoc && (
              <section className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all group py-16">
                <span className="text-sm font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full mb-6">
                  {latestDoc.publishedAt}
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors mb-8">
                  <Link to={getArticleUrl(latestDoc, 'in-focus')}>
                    In Focus
                  </Link>
                </h2>
                <Link
                  to={getArticleUrl(latestDoc, 'in-focus')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>
            )}`;

if (content.match(blockRegex)) {
  content = content.replace(blockRegex, newBlock);
  fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);
  console.log("Success replacing with latestDoc");
} else {
  console.log("Failed to match blockRegex");
}
