const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('title1?:')) {
  content = content.replace(
    /title: string;/g,
    "title: string;\n  title1?: string;\n  title2?: string;\n  excerpt1?: string;\n  excerpt2?: string;\n  content1?: string;\n  content2?: string;"
  );
}

if (!content.includes('signalEvent1?:')) {
  content = content.replace(
    /signalEvent\?: string;/g,
    "signalEvent?: string;\n  signalEvent1?: string;\n  signalEvent2?: string;\n  signalDateOrDay1?: string;\n  signalDateOrDay2?: string;\n  relatedLinkTitle1?: string;\n  relatedLinkTitle2?: string;\n  relatedLinkUrl1?: string;\n  relatedLinkUrl2?: string;"
  );
}

fs.writeFileSync('src/types.ts', content);
