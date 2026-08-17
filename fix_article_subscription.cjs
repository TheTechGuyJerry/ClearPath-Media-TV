const fs = require('fs');

const filesToFix = [
  'src/pages/ArticlePage.tsx',
  'src/pages/ClearPathLensPage.tsx',
  'src/pages/news/SignalsToWatchPage.tsx',
  'src/pages/news/ThePublicRecordPage.tsx'
];

for (const file of filesToFix) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Move <SubscriptionSection /> outside of the main grid div if it's currently inside.
  
  // Find where it's used inside the article or main column
  if (c.includes('<SubscriptionSection />') && c.includes('</article>')) {
    c = c.replace(/\s*\{\/\* Subscription Section \*\/\}\s*<SubscriptionSection \/>\s*<\/article>/g, '\n          </article>');
    c = c.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/g, '\n      </div>\n      <div className="max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto">\n        <SubscriptionSection />\n      </div>\n    </div>\n  );\n}\n');
  } else if (c.includes('<SubscriptionSection />') && file.includes('SignalsToWatchPage')) {
    // Specifically for SignalsToWatchPage if it doesn't have an article tag
    c = c.replace(/\s*<SubscriptionSection \/>\s*<\/div>\s*\{\/\* Sidebar Column \*\/\}/g, '\n          </div>\n          {/* Sidebar Column */}');
    c = c.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/g, '\n      </div>\n      <div className="max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto">\n        <SubscriptionSection />\n      </div>\n    </div>\n  );\n}\n');
  } else if (c.includes('<SubscriptionSection />') && file.includes('ThePublicRecordPage')) {
    c = c.replace(/\s*\{\/\* Subscription Section \*\/\}\s*<SubscriptionSection \/>\s*<\/div>\s*\{\/\* Sidebar \*\/\}/g, '\n          </div>\n          {/* Sidebar */}');
    c = c.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/g, '\n      </div>\n      <div className="max-w-[1440px] 2xl:max-w-[1600px] px-margin-mobile md:px-margin-desktop mx-auto">\n        <SubscriptionSection />\n      </div>\n    </div>\n  );\n}\n');
  }
  
  fs.writeFileSync(file, c);
}
