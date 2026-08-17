const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

c = c.replace('const [briefings,    clearpathDailyArticles, setBriefings] = useState<Briefing[]>([]);', 'const [briefings, setBriefings] = useState<Briefing[]>([]);');

fs.writeFileSync('src/pages/admin/AdminContext.tsx', c);
