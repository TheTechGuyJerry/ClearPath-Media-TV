const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('createdAt?: string;')) {
  code = code.replace(/export interface ClearPathDailyArticle \{/, `export interface ClearPathDailyArticle {
  createdAt?: string;
  introductorySummary?: string;
  institutionalAnalysis?: string;
  relatedLinkUrl?: string;
  relatedLinkTitle?: string;
  supportingSourceUrl?: string;
  supportingSourceTitle?: string;
  speakerPosition?: string;
  speakerSetting?: string;
  speakerInstitution?: string;
  context?: string;`);
}

fs.writeFileSync('src/types.ts', code);
