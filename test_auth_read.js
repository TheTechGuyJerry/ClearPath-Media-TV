import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, 'jerryagbedun@gmail.com', 'admin1234') // Fake password, wait we don't know the password
.then(() => getDocs(collection(db, 'audience_analytics_events')))
.then(s => console.log('Count:', s.size))
.then(() => process.exit(0))
.catch(e => { console.error(e); process.exit(1); });
