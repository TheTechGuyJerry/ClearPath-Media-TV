import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
getDocs(collection(db, 'audience_analytics_events')).then(s => console.log('Count:', s.size)).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
