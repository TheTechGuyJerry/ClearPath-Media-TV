const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

if (!content.includes('EditorErrorBoundary')) {
  content = content.replace("import { RichTextEditor } from '../../components/admin/RichTextEditor';", "import { RichTextEditor } from '../../components/admin/RichTextEditor';\nimport { EditorErrorBoundary } from '../../components/admin/EditorErrorBoundary';");
}

content = content.replace(/<RichTextEditor/g, '<EditorErrorBoundary><RichTextEditor');
content = content.replace(/placeholder=\{f\.label\}\s*\/>/g, 'placeholder={f.label}\n                    /></EditorErrorBoundary>');

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', content);
