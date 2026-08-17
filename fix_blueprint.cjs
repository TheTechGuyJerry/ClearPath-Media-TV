const fs = require('fs');
let c = fs.readFileSync('firebase-blueprint.json', 'utf8');

const newEntity = `
    "clearpathDailyArticle": {
      "title": "ClearPathDailyArticle",
      "description": "Daily articles and CMS formats.",
      "type": "object",
      "properties": {
        "slug": { "type": "string" },
        "status": { "type": "string" },
        "title": { "type": "string" },
        "content": { "type": "string" }
      }
    },`;

c = c.replace(/"entities": \{/, '"entities": {' + newEntity);

const newCollection = `
    "clearpath_daily_articles": { "schema": "clearpathDailyArticle", "description": "Daily news posts." },`;

c = c.replace(/"firestore": \{/, '"firestore": {' + newCollection);

fs.writeFileSync('firebase-blueprint.json', c);
