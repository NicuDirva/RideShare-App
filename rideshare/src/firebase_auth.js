// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
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
const storage = getStorage();

function useAuth() {
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
  }, []) 

  return currentUser;
}

async function upload (file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + '.png');

  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);

  const photoURL = await getDownloadURL(fileRef);

/////

const uid = currentUser.uid;
const q = query(collection(db, 'Profile'), where('id', '==', uid));
const querySnapshot = await getDocs(q);

if (querySnapshot.size > 0) {
  const userDocSnapshot = querySnapshot.docs[0];
  const profileRef = userDocSnapshot.ref;

  // Actualizează nickname-ul în baza de date
  await updateDoc(profileRef, {
    imgURL: photoURL,
  });
}
///////////

  updateProfile(currentUser, {photoURL});

  setLoading(false);
  alert("Uploaded file!");
}

export {db, auth, useAuth, upload}