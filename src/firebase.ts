// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_apiKey,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_authDomain,
    projectId: process.env.VUE_APP_FIREBASE_AUTH_projectId,
    storageBucket: process.env.VUE_APP_FIREBASE_AUTH_storageBucket,
    messagingSenderId: process.env.VUE_APP_FIREBASE_AUTH_messagingSenderId,
    appId: process.env.VUE_APP_FIREBASE_AUTH_appId,
  };

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp, firebaseAuth };
