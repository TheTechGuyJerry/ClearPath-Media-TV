const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const titleLogic = `
          <div className="mb-8">
            <Link to="/clearpath-daily/todays-brief" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to ClearPath Daily
            </Link>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">
                {article.category || 'CLEARPATH DAILY'}
              </span>
              <span className="text-sm font-mono text-on-surface-variant flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {article.readingTime || '5 min read'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-on-surface leading-[1.1] mb-6">
              {article.categorySlug === 'in-focus' ? (article.title1 || article.title) : article.title}
            </h1>
`;

content = content.replace(
  /<div className="mb-8">[\s\S]*?<h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-on-surface leading-\[1\.1\] mb-6">[\s\S]*?<\/h1>/,
  titleLogic
);

const contentLogic = `
            {article.categorySlug === 'in-focus' && article.title1 ? (
              <div className="space-y-16">
                <div>
                  <h2 className="text-3xl font-bold font-serif mb-4 text-on-surface">{article.title1}</h2>
                  <div className="prose prose-slate lg:prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-on-surface font-medium">
                    <ReactMarkdown>{article.content1 || article.content || ''}</ReactMarkdown>
                  </div>
                </div>
                {article.title2 && (
                  <div>
                    <h2 className="text-3xl font-bold font-serif mb-4 text-on-surface">{article.title2}</h2>
                    <div className="prose prose-slate lg:prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-on-surface font-medium">
                      <ReactMarkdown>{article.content2 || ''}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="prose prose-slate lg:prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-on-surface font-medium">
                <ReactMarkdown>
                  {article.content || 'Content not found.'}
                </ReactMarkdown>
              </div>
            )}
`;

content = content.replace(
  /<div className="prose prose-slate lg:prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-on-surface font-medium">\s*<ReactMarkdown>\s*\{article\.content \|\| 'Content not found\.'\}\s*<\/ReactMarkdown>\s*<\/div>/,
  contentLogic
);

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
