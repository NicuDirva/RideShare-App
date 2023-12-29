// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIp-Z4eoSrkIkbPvhMiy7agXqWVGvXzJ4",
  authDomain: "rideshare-9fcf4.firebaseapp.com",
  projectId: "rideshare-9fcf4",
  storageBucket: "rideshare-9fcf4.appspot.com",
  messagingSenderId: "622707152816",
  appId: "1:622707152816:web:9eff8ed4e1e83cc5c8a875",
  measurementId: "G-97MRPDZ8Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export {db, auth}