const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

if (!code.includes('import { ClearPathDailyArticle }')) {
  code = "import { ClearPathDailyArticle } from '../../types';\n" + code;
  fs.writeFileSync('src/pages/admin/AdminContext.tsx', code);
}
