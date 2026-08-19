const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

if (!content.includes('election-matters')) {
  content = content.replace(
    /<Link\s*to="\/admin\/briefing"/,
    `<Link
                to="/admin/election-matters"
                className={getLinkClass('/admin/election-matters')}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Election Matters Weekly</span>
                </div>
              </Link>
              <Link
                to="/admin/briefing"`
  );
}

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
