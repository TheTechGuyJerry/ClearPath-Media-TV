const fs = require('fs');
let content = fs.readFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', 'utf8');

// Find the <p> and the image block
const pRegex = /(<p className="text-sm sm:text-base text-slate-600 dark:text-on-surface-variant leading-relaxed max-w-3xl line-clamp-3">\s*\{mainAnalysis\?\.excerpt \|\| 'No featured analysis is available at the moment\.'\}\s*<\/p>)/;
const imgRegex = /(\s*\{mainAnalysis\?\.coverImage && \(\s*<div className="w-full aspect-\[21\/9\] sm:aspect-\[16\/6\] md:aspect-\[21\/9\] rounded-2xl overflow-hidden shadow-xs mt-4 group">\s*<Link to=\{mainAnalysis \? getArticleUrl\(mainAnalysis as any, 'todays-brief'\) : '#'\}>\s*<img\s*src=\{mainAnalysis\.coverImage\}\s*alt=\{mainAnalysis\?\.title \|\| 'Placeholder'\}\s*className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"\s*loading="lazy"\s*\/>\s*<\/Link>\s*<\/div>\s*\)\})/;

// We want the image block to be before the p block
let newContent = content.replace(pRegex, '%%P_BLOCK%%');
newContent = newContent.replace(imgRegex, '%%IMG_BLOCK%%');

const pBlockMatch = content.match(pRegex);
const imgBlockMatch = content.match(imgRegex);

if (pBlockMatch && imgBlockMatch) {
  // Replace the first token with img, second with p
  // Wait, in the original they are p then img. So in newContent, %%P_BLOCK%% is before %%IMG_BLOCK%%
  newContent = newContent.replace('%%P_BLOCK%%', imgBlockMatch[1].trim());
  newContent = newContent.replace('%%IMG_BLOCK%%', '\n            ' + pBlockMatch[1]);
  fs.writeFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', newContent);
  console.log("Success");
} else {
  console.log("Failed to match blocks");
}
