import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, writeBatch, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const config={apiKey:process.env.VITE_FIREBASE_API_KEY,authDomain:process.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:process.env.VITE_FIREBASE_PROJECT_ID,storageBucket:process.env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:process.env.VITE_FIREBASE_APP_ID};
if(Object.values(config).some(v=>!v)) throw new Error('Missing Firebase values. Create .env from .env.example first.');
const rl=createInterface({input,output}); const email=await rl.question('Admin email: '); const password=await rl.question('Admin password: '); rl.close();
const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app); await signInWithEmailAndPassword(auth,email,password);
const products=[
 ['White Oxford Shirt','shirt','White','#F6F3ED',3795],['Black Oxford Shirt','shirt','Black','#272A29',4200],['Navy Blue Oxford Shirt','shirt','Navy Blue','#1F3A5F',4400],['Sky Blue Oxford Shirt','shirt','Sky Blue','#9EC8D5',3900],['Olive Green Oxford Shirt','shirt','Olive Green','#65715A',4200],['Beige Oxford Shirt','shirt','Beige','#DCC8AB',3900],['Grey Oxford Shirt','shirt','Grey','#9CA3A0',4000],['Maroon Oxford Shirt','shirt','Maroon','#713F3F',4300],['Mustard Oxford Shirt','shirt','Mustard','#C59A3A',4100],
 ['Black Trouser','trouser','Black','#242827',5200],['Navy Trouser','trouser','Navy Blue','#263542',5100],['Grey Trouser','trouser','Grey','#4C5351',5200],['Beige Trouser','trouser','Beige','#D8C6A9',4800],['Khaki Trouser','trouser','Khaki','#BEB5A4',4700],['White Trouser','trouser','White','#F4F1E9',4800],['Olive Trouser','trouser','Olive','#67715D',4900],['Charcoal Trouser','trouser','Charcoal','#4C5351',5200],['Midnight Trouser','trouser','Midnight','#263542',5100],
 ['Black Leather Belt','belt','Black','#1E2422',2800],['Brown Leather Belt','belt','Brown','#7B4B35',2900],['Dark Brown Belt','belt','Dark Brown','#4B2F27',3000],['Tan Belt','belt','Tan','#B47A50',2600],['Cognac Leather Belt','belt','Cognac','#A85D32',2800],['Charcoal Belt','belt','Charcoal','#4C5351',2700]
];
const shirtRules={White:['Black','Navy Blue','Grey','Beige'],Black:['Grey','Khaki','Olive','Black'],'Navy Blue':['Beige','Grey','Khaki','White'],'Sky Blue':['Grey','Navy Blue','Black'],'Olive Green':['Black','Beige','Khaki','Grey'],Beige:['Charcoal','Midnight','Black'],Grey:['Midnight','Black'],Maroon:['Beige','Khaki','Black','Grey'],Mustard:['Black','Grey','Khaki']};
const beltRules={Black:['Black','Dark Brown','Charcoal'],Navy:['Black','Brown'],Grey:['Black','Dark Brown','Charcoal'],Beige:['Brown','Dark Brown','Tan'],Khaki:['Brown','Tan'],Olive:['Brown','Black'],Charcoal:['Black','Dark Brown'],Midnight:['Black'],White:['Brown','Tan']};
let batch=writeBatch(db);for(const [name,type,color,colorHex,priceCents] of products){const ref=doc(collection(db,'products'));batch.set(ref,{name,type,color,colorHex,priceCents,inventoryCount:20,imageUrl:'',active:true,createdAt:serverTimestamp()})}for(const [shirtColor,trousers] of Object.entries(shirtRules))for(const trouserColor of trousers){for(const beltColor of (beltRules[trouserColor]||['Black'])){const ref=doc(collection(db,'matchingRules'));batch.set(ref,{shirtColor,trouserColor,beltColor,skinTone:'all',priority:1,active:true,createdAt:serverTimestamp()})}}await batch.commit();console.log(`Seeded ${products.length} products and matching rules successfully.`);

