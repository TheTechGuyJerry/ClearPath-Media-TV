const fs = require('fs');

let c = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const dailyMenuHtml = `
          {/* ClearPath Daily category */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
            <div className="space-y-1 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center text-white/40 px-3 text-[10px] uppercase tracking-wider font-bold">
                <span className="text-white/40">ClearPath Daily</span>
              </div>
              <div className="space-y-0.5 pt-1 border-l border-white/10 ml-2 pl-2">
                <Link to="/admin/clearpath-daily/todays-brief" className={getSubLinkClass('/admin/clearpath-daily/todays-brief')}>Today's Brief</Link>
                <Link to="/admin/clearpath-daily/in-focus" className={getSubLinkClass('/admin/clearpath-daily/in-focus')}>In Focus</Link>
                <Link to="/admin/clearpath-daily/the-indicator" className={getSubLinkClass('/admin/clearpath-daily/the-indicator')}>The Indicator</Link>
                <Link to="/admin/clearpath-daily/the-public-record" className={getSubLinkClass('/admin/clearpath-daily/the-public-record')}>The Public Record</Link>
                <Link to="/admin/clearpath-daily/clearpath-lens" className={getSubLinkClass('/admin/clearpath-daily/clearpath-lens')}>The ClearPath Lens</Link>
                <Link to="/admin/clearpath-daily/signals-to-watch" className={getSubLinkClass('/admin/clearpath-daily/signals-to-watch')}>Signals to Watch</Link>
              </div>
            </div>
          )}
`;

// Insert after the Explainers category
c = c.replace(/\{\/\* Main system views \*\/\}/, dailyMenuHtml + '\n          {/* Main system views */}');

fs.writeFileSync('src/components/admin/AdminLayout.tsx', c);
