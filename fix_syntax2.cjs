const fs = require('fs');

const files = [
  'src/pages/ArticlePage.tsx',
  'src/pages/ClearPathLensPage.tsx',
  'src/pages/news/SignalsToWatchPage.tsx',
  'src/pages/news/ThePublicRecordPage.tsx'
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/<\/div>\s*<\/main>\s*<div className="max-w-\[1440px\] 2xl:max-w-\[1600px\] px-margin-mobile md:px-margin-desktop mx-auto">\s*<SubscriptionSection \/>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*/, '        </div>\n      </div>\n      <div className="max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto">\n        <SubscriptionSection />\n      </div>\n    </div>\n  );\n}\n');
  fs.writeFileSync(file, c);
}
