import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNqd9i_VrmRyUq7-1alP-8LL4MYyUEJEU",
  authDomain: "expense-tracker-2366f.firebaseapp.com",
  projectId: "expense-tracker-2366f",
  storageBucket: "expense-tracker-2366f.firebasestorage.app",
  messagingSenderId: "312561605",
  appId: "1:312561605:web:d90fe27b2f7a020dfc45ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };