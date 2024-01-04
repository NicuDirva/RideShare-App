// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
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

async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + '.png');

  setLoading(true);
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
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

  updateProfile(currentUser, { photoURL });
  const q2 = query(collection(db, 'Ride'), where('creator_id', '==', currentUser.uid));
  const querySnapshot1 = await getDocs(q2);

  const updatePromises = [];

  querySnapshot1.forEach((doc) => {
    const rideRef = doc.ref;

    // Adaugă promisiunea actualizării în array-ul de promisiuni
    updatePromises.push(updateDoc(rideRef, { creator_photo_url: photoURL }));
  });

  // Așteaptă ca toate promisiunile de actualizare să se încheie
  await Promise.all(updatePromises);

  // Facem update și la ride-urile ale căror e membru
  const memberQuery = query(collection(db, 'Ride'), where('members', 'array-contains', currentUser.uid));
  const memberQuerySnapshot = await getDocs(memberQuery);
  const memberUpdatePromises = memberQuerySnapshot.docs.map(async (doc) => {
    const rideRef = doc.ref;
    console.log(`CREATORRRRRR IDDDDD: ${doc.data.creator_id}`);
  
    if (doc.data().members && Array.isArray(doc.data().members)) {
      const updatedMembers = doc.data().members.map((member) => {
        if (member.memberId === currentUser.uid) {
          console.log(`Member IDDDDD: ${currentUser.uid}`);
          return { ...member, memberURL: photoURL };
        }
        return member;
      });
  
      // Actualizează câmpul "members" în Firestore
      await updateDoc(rideRef, { members: updatedMembers });
    } else {
      console.error('members nu este definit sau nu este un array', doc.id);
    }
  });
  
  // Așteaptă ca toate promisiunile de actualizare să se încheie
  await Promise.all(memberUpdatePromises);
  setLoading(false);
  alert("Uploaded file!");
}

export { db, auth, useAuth, upload }