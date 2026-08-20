const fs = require('fs');
let content = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');

// 1. Todays Brief link
content = content.replace(/to="\/daily\/todays-brief"/g, "to={getArticleUrl(todaysBrief, 'todays-brief')}");
content = content.replace(/to="\/clearpath-daily\/todays-brief"/g, "to={getArticleUrl(todaysBrief, 'todays-brief')}");

// 2. In Focus link
content = content.replace(/to={`\/clearpath-daily\/in-focus`}/g, "to={getArticleUrl(mainInFocus, 'in-focus')}");

// 3. The Indicator link
content = content.replace(/to="\/clearpath-daily\/the-indicator"/g, "to={getArticleUrl(indicator as any, 'the-indicator')}");

// 4. The Public Record link
content = content.replace(/to="\/clearpath-daily\/the-public-record"/g, "to={getArticleUrl(publicRecord as any, 'the-public-record')}");
// Also change the title display for public record
content = content.replace(/"\{publicRecord\?\.quote\}"/, "{publicRecord?.title || publicRecord?.quote}");
// Change font style to normal from italic since it's a title now
content = content.replace(/className="font-serif italic text-xs text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"/, 'className="font-serif font-bold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"');

// 5. Signals to Watch link
content = content.replace(/to="\/clearpath-daily\/signals-to-watch"/g, "to={getArticleUrl(topSignal as any, 'signals-to-watch')}");
content = content.replace(/\{topSignal\?\.signalEvent1 \|\| topSignal\?\.title\}/, "{topSignal?.title}");

fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', content);
