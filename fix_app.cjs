const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importToAdd = "import ElectionMattersWeekly from './pages/ElectionMattersWeekly';\nimport AdminElectionMatters from './pages/admin/AdminElectionMatters';";
if (!content.includes('ElectionMattersWeekly')) {
  content = content.replace("import About from './pages/About';", importToAdd + "\nimport About from './pages/About';");
}

// Add route
if (!content.includes('<Route path="/election-matters-weekly"')) {
  content = content.replace(
    '<Route path="/about" element={<About />} />',
    '<Route path="/election-matters-weekly" element={<ElectionMattersWeekly />} />\n            <Route path="/about" element={<About />} />'
  );
}

// Add admin route
if (!content.includes('<Route path="election-matters"')) {
  content = content.replace(
    '<Route path="briefing" element={<AdminBriefings />} />',
    '<Route path="election-matters" element={<AdminElectionMatters />} />\n                    <Route path="briefing" element={<AdminBriefings />} />'
  );
}

fs.writeFileSync('src/App.tsx', content);
