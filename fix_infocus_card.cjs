const fs = require('fs');
let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

const regex = /\{\/\* The Top 2 "In Focus" Stories \(Gold Numbers\) \*\/\}([\s\S]*?)<div className="grid grid-cols-1 md:grid-cols-2 gap-6">([\s\S]*?)<\/div>\s*\{\/\* Side-by-Side: More Deep Dives & Sidebar \*\/\}/;

const newSection = `{/* The Latest "In Focus" Story */}
            {inFocusStories.length > 0 && (
              <section className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all group py-16">
                <span className="text-sm font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full mb-6">
                  {inFocusStories[0].publishedAt}
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors mb-8">
                  <Link to={getArticleUrl(inFocusStories[0], 'in-focus')}>
                    In Focus
                  </Link>
                </h2>
                <Link
                  to={getArticleUrl(inFocusStories[0], 'in-focus')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>
            )}
            
            {/* Side-by-Side: More Deep Dives & Sidebar */}`;

if (content.match(regex)) {
  content = content.replace(regex, newSection);
  fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);
  console.log("Success replacing InFocus top section");
} else {
  console.log("Failed to match InFocus top section");
}
