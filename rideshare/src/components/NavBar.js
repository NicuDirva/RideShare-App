import React, { useEffect, useState } from 'react'
import { auth, useAuth } from '../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SearchBar from './SearchBar';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase_auth';

function NavBar() {
  const [userProfile, setUserProfile] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const currentUser = useAuth();
  
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        // Verifică dacă utilizatorul este autentificat
        if (auth.currentUser) {
          const uid = auth.currentUser.uid;
          const q = query(collection(db, 'Profile'), where('id', '==', uid));
          const querySnapshot = await getDocs(q);

          // Verifică dacă există vreun document în rezultatele query-ului
          if (querySnapshot.size > 0) {
            // Ia primul document (dacă sunt mai multe, ia primul)
            const userDocSnapshot = querySnapshot.docs[0];

            // Setează starea cu datele despre profil
            setUserProfile(userDocSnapshot.data());
          } else {
            // Dacă documentul nu există, poți trata acest caz în consecință
            console.log('Documentul nu există');
          }
        }
      } catch (error) {
        console.error('Eroare la obținerea profilului:', error);
      }
    };

    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        getUserProfile();
      }
      else {
        setAuthUser(null);
      }
    });

  }, [currentUser]);

  const userSingOut = () => {
    signOut(auth).catch(error => console.log(error))
  }

  return (
    <div>
      {authUser ?
        <div>
          <nav className='nav'>
            <h1>Ride~Share</h1>
            <ul>
              <li>Hi {userProfile?.nickname}</li>
              <li><SearchBar /></li>
              <li><a href='/home'>Home</a></li>
              <li><a href='/profile'>Profile</a></li>
              <li><a href='/welcome' onClick={userSingOut}>Sign Out</a></li>
            </ul>
          </nav>
        </div>
        :
        <div>
          <nav className='nav'>
            <h1>Ride~Share</h1>
          </nav>
        </div>}
    </div>
  )
}

export default NavBar
