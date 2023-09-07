// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCR0nmp6ixIp_yId4Hpk2JZg_RMBV-IJv0",
  authDomain: "worklist-97f24.firebaseapp.com",
  projectId: "worklist-97f24",
  storageBucket: "worklist-97f24.appspot.com",
  messagingSenderId: "403260112309",
  appId: "1:403260112309:web:9994cf8cc1a3c068ef2dfc",
  measurementId: "G-N9WHD20YKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider();

export {auth , provider }
export{db}