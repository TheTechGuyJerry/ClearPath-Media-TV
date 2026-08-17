import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
getDocs(query(collection(db, 'audience_analytics_events'), limit(1))).then(s => console.log(s.docs[0].data())).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
