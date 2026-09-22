import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const config={apiKey:process.env.VITE_FIREBASE_API_KEY,authDomain:process.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:process.env.VITE_FIREBASE_PROJECT_ID,storageBucket:process.env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:process.env.VITE_FIREBASE_APP_ID};
const rl=createInterface({input,output});const email=await rl.question('Email: ');const password=await rl.question('Password: ');rl.close();const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);const c=await signInWithEmailAndPassword(auth,email,password);const uid=c.user.uid;const snap=await getDoc(doc(db,'users',uid));console.log(`Authentication UID: ${uid}`);console.log(`Firestore document path: users/${uid}`);console.log(`Document exists: ${snap.exists()}`);console.log(`Role: ${snap.exists()?snap.data().role:'MISSING'}`);if(!snap.exists()||snap.data().role!=='admin')process.exitCode=2;
