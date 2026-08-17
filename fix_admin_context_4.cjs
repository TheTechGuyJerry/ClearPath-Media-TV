const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

c = c.replace(/NewsletterSubscriber \} from '\.\.\/\.\.\/types';/, 'NewsletterSubscriber, ClearPathDailyArticle } from \'../../types\';');

fs.writeFileSync('src/pages/admin/AdminContext.tsx', c);
