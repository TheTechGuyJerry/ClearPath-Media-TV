const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

// Ensure confirm isn't blocking inside delete handler, this was done in a previous step, but let's double check AdminElectionMatters
let amContent = fs.readFileSync('src/pages/admin/AdminElectionMatters.tsx', 'utf8');
if (amContent.includes('window.confirm') || amContent.includes('confirm(')) {
  console.log("AdminElectionMatters has confirm logic, replacing...");
  amContent = amContent.replace(/if\s*\(window\.confirm\([^)]+\)\)\s*\{/g, "{");
  amContent = amContent.replace(/if\s*\(confirm\([^)]+\)\)\s*\{/g, "{");
  fs.writeFileSync('src/pages/admin/AdminElectionMatters.tsx', amContent);
}

