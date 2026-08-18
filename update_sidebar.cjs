const fs = require('fs');
let code = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');

// Insert Today's brief section right after <div className="space-y-3.5">
const todaysBriefCode = `
          {/* 1. Today's Brief */}
          {(() => {
            const isCurrent = currentSectionSlug === 'todays-brief' || todaysBrief?.slug === currentArticleSlug;
            if (!todaysBrief || isCurrent) return null;
            return (
              <div className="p-3 rounded-xl border bg-surface-container-low hover:bg-surface-container border-outline-variant/60 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    TODAY'S BRIEF
                  </span>
                </div>
                <Link
                  to={getArticleUrl(todaysBrief, 'todays-brief')}
                  className="font-serif font-bold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"
                >
                  {todaysBrief.title}
                </Link>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>{dynPublicationDate}</span>
                  <Link to="/daily/todays-brief" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    Read Brief <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}
`;

code = code.replace('{/* 2. In Focus */}', todaysBriefCode + '\n          {/* 2. In Focus */}');

// Now, for all sections, if isCurrent is true, return null instead of highlighting.
code = code.replace(/if \(!mainInFocus\) return null;/g, 'if (!mainInFocus || isCurrent) return null;');
code = code.replace(/if \(!indicator\) return null;/g, 'if (!indicator || isCurrent) return null;');
code = code.replace(/if \(!publicRecord\) return null;/g, 'if (!publicRecord || isCurrent) return null;');
code = code.replace(/if \(!clearpathLens\) return null;/g, 'if (!clearpathLens || isCurrent) return null;');
code = code.replace(/if \(!topSignal\) return null;/g, 'if (!topSignal || isCurrent) return null;');

// Remove the highlighting HTML (e.g. bg-primary/5, CheckCircle, Reading span)
// The user doesn't want the current one repeated AT ALL. So we don't need the isCurrent styling anymore.
// We can just simplify it with another regex or leave the conditional styling since it will never hit isCurrent=true now.

fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', code);
