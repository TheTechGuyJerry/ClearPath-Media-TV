const fs = require('fs');
let c = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

if (!c.includes('Navigate')) {
  c = c.replace(/import \{ useParams, Link \} from 'react-router-dom';/, "import { useParams, Link, Navigate, useLocation } from 'react-router-dom';");
} else {
  c = c.replace(/import \{ useParams, Link \} from 'react-router-dom';/, "import { useParams, Link, useLocation } from 'react-router-dom';");
}

const redirectLogic = `  const location = useLocation();
  if (location.pathname.startsWith('/article/')) {
    const weeklySlugs = ['west-african-monitor', 'state-in-focus', 'lga-brief', 'governance-brief', 'bccn-news'];
    const categorySlug = article?.categorySlug || 'todays-brief';
    if (weeklySlugs.includes(categorySlug)) {
      return <Navigate to={\`/weekly-feature/\${slug}\`} replace />;
    } else {
      return <Navigate to={\`/clearpath-daily/\${categorySlug}/\${slug}\`} replace />;
    }
  }
`;

c = c.replace(/const currentUrl = window.location.href;/, redirectLogic + '\n  const currentUrl = window.location.href;');

fs.writeFileSync('src/pages/ArticlePage.tsx', c);
