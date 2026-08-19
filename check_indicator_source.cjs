const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');

// The rendering for source is probably a bit different. Let's see what it is.
if (content.includes("Source: {currentIndicator.supportingSourceTitle")) {
    const regex = /<div className="pt-2">[\s\S]*?<a[\s\S]*?href=\{currentIndicator.supportingSourceUrl\}[\s\S]*?<\/a>[\s\S]*?<\/div>/;
    content = content.replace(regex, "");
    fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', content);
    console.log("Fixed source rendering in IndicatorPage");
}
