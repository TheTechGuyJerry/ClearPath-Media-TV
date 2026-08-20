const fs = require('fs');
let content = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');
content = content.replace("import { app } from '../../lib/firebase';", "import { storage } from '../../lib/firebase';");
content = content.replace("const storage = getStorage(app);", "");
fs.writeFileSync('src/components/admin/RichTextEditor.tsx', content);
