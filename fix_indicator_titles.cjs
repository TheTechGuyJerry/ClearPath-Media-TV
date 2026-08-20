const fs = require('fs');

// Fix Home.tsx
let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const oldTitleLine = "title: a.categorySlug === 'the-indicator' ? (a.indicatorNumber ? a.indicatorNumber + ' - ' : '') + (a.title || 'View Indicator') : a.categorySlug === 'the-public-record' ? (a.title || a.quote || 'The Public Record') : (a.title || 'Read ' + a.category),";
const newTitleLine = "title: a.categorySlug === 'the-indicator' ? (a.indicatorNumber || 'View Indicator') : a.categorySlug === 'the-public-record' ? (a.title || a.quote || 'The Public Record') : (a.title || 'Read ' + a.category),";

if (homeContent.includes(oldTitleLine)) {
  homeContent = homeContent.replace(oldTitleLine, newTitleLine);
  fs.writeFileSync('src/pages/Home.tsx', homeContent);
  console.log("Updated Home.tsx");
}

// Fix ClearPathDailySidebar.tsx
let sidebarContent = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');

const targetBlock = `<Link
                  to={getArticleUrl(indicator as any, 'the-indicator')}
                  className="flex items-baseline gap-2 group"
                >
                  <span className="text-base font-black font-mono text-primary group-hover:underline">
                    {indicator?.indicatorNumber}
                  </span>
                  <span className="font-serif font-bold text-xs text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {indicator?.title}
                  </span>
                </Link>`;

const replacementBlock = `<Link
                  to={getArticleUrl(indicator as any, 'the-indicator')}
                  className="flex items-baseline gap-2 group"
                >
                  <span className="text-base font-black font-mono text-primary group-hover:underline line-clamp-1">
                    {indicator?.indicatorNumber || 'View Indicator'}
                  </span>
                </Link>`;

if (sidebarContent.includes(targetBlock)) {
  sidebarContent = sidebarContent.replace(targetBlock, replacementBlock);
  fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', sidebarContent);
  console.log("Updated ClearPathDailySidebar.tsx");
} else {
  // Let's try replacing with regex to ignore whitespace variations
  const regex = /<Link[\s\S]*?to=\{getArticleUrl\(indicator as any, 'the-indicator'\)\}[\s\S]*?className="flex items-baseline gap-2 group"[\s\S]*?>[\s\S]*?<span className="text-base font-black font-mono text-primary group-hover:underline">[\s\S]*?\{indicator\?\.indicatorNumber\}[\s\S]*?<\/span>[\s\S]*?<span className="font-serif font-bold text-xs text-on-surface group-hover:text-primary transition-colors line-clamp-1">[\s\S]*?\{indicator\?\.title\}[\s\S]*?<\/span>[\s\S]*?<\/Link>/;
  
  if (regex.test(sidebarContent)) {
    sidebarContent = sidebarContent.replace(regex, replacementBlock);
    fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', sidebarContent);
    console.log("Updated ClearPathDailySidebar.tsx using regex");
  } else {
    console.log("Could not find target block in ClearPathDailySidebar.tsx");
  }
}
