import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, addDoc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage, firebaseConfigured } from './firebase';import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
export const requireFirebase=()=>{if(!firebaseConfigured)throw new Error('Firebase is not configured. Copy .env.example to .env and add your Firebase web config.')};
export async function register({name,email,phone,password}){requireFirebase();const c=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(c.user,{displayName:name});await setDoc(doc(db,'users',c.user.uid),{name,email,phone,role:'customer',skinTone:null,stylePreferences:{},createdAt:serverTimestamp()});return c.user}
export async function login(email,password){requireFirebase();return(await signInWithEmailAndPassword(auth,email,password)).user}export async function resetPassword(email){requireFirebase();return sendPasswordResetEmail(auth,email)}export async function changePassword(password){requireFirebase();if(!auth.currentUser)throw new Error('Please sign in again.');return updatePassword(auth.currentUser,password)}export async function logout(){if(auth)return signOut(auth)}export function watchAuth(cb){return auth?onAuthStateChanged(auth,cb):()=>{}}
export async function saveProfile(uid,data){requireFirebase();return setDoc(doc(db,'users',uid),data,{merge:true})}export async function getProfile(uid){requireFirebase();return(await getDoc(doc(db,'users',uid))).data()}
export async function listCatalog(type){requireFirebase();const s=await getDocs(query(collection(db,'products'),where('type','==',type)));return s.docs.map(x=>({id:x.id,...x.data()})).filter(x=>x.active!==false)}
export async function listBoxes(skinTone){requireFirebase();const s=await getDocs(query(collection(db,'curatedBoxes'),where('skinTones','array-contains',skinTone)));return s.docs.map(x=>({id:x.id,...x.data()})).filter(x=>x.active!==false)}
export function watchCart(uid,cb){return onSnapshot(collection(db,'carts',uid,'items'),s=>cb(s.docs.map(x=>({id:x.id,...x.data()}))))}export async function addCartItem(uid,item){requireFirebase();return addDoc(collection(db,'carts',uid,'items'),{...item,createdAt:serverTimestamp()})}export async function removeCartItem(uid,id){requireFirebase();return deleteDoc(doc(db,'carts',uid,'items',id))}export async function updateCartItem(uid,id,data){requireFirebase();return setDoc(doc(db,'carts',uid,'items',id),data,{merge:true})}
export async function createOrder(uid,data){
  requireFirebase();
  const api=import.meta.env.VITE_ORDER_API_URL;
  const currentUser=auth?.currentUser;
  const backendItems=(data.items||[]).flatMap(x=>[
    x.shirtId?{productId:x.shirtId,quantity:x.quantity||1}:null,
    x.trouserId?{productId:x.trouserId,quantity:x.quantity||1}:null,
    x.beltId?{productId:x.beltId,quantity:x.quantity||1}:null
  ].filter(Boolean));
  if(!api)throw new Error('Secure order service is not configured.');
  if(!currentUser)throw new Error('Please sign in before placing an order.');
  if(backendItems.length!==((data.items||[]).length*3))throw new Error('This cart contains an old item. Remove it and build the capsule again.');
  if(api&&currentUser&&backendItems.length===((data.items||[]).length*3)){
    const token=await currentUser.getIdToken();
    const response=await fetch(`${api}/api/orders`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({items:backendItems,shipping:data.shipping,paymentMethod:data.paymentMethod})});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||'Secure order validation failed.');
    return {id:result.orderId,...result};
  }
  throw new Error('Secure order service is unavailable.');
}export async function listOrders(uid){requireFirebase();const s=await getDocs(query(collection(db,'orders'),where('userId','==',uid)));return s.docs.map(x=>({id:x.id,...x.data()}))}
export async function adminList(name){requireFirebase();const s=await getDocs(collection(db,name));return s.docs.map(x=>({id:x.id,...x.data()}))}export async function adminUpsert(name,id,data){requireFirebase();return setDoc(doc(db,name,id||undefined),{...data,updatedAt:serverTimestamp()},{merge:true})}export async function adminDelete(name,id){requireFirebase();return deleteDoc(doc(db,name,id))}export async function adminUploadImage(file,path){requireFirebase();if(!storage)throw new Error('Firebase Storage is not configured');const target=ref(storage,path);await uploadBytes(target,file);return getDownloadURL(target)}



