const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const regex = /<Link\s*to="\/admin\/election-matters"[\s\S]*?<\/Link>\s*<Link\s*to="\/admin\/briefing"/;

content = content.replace(regex, `{userRole === 'super_admin' && (
              <Link
                to="/admin/election-matters"
                className={getLinkClass('/admin/election-matters')}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Election Matters Weekly</span>
                </div>
              </Link>
            )}
            {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'content_admin' || userRole === 'viewer_admin') && (
              <Link
                to="/admin/briefing"`);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
