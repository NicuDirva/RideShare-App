import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase_auth';
import NavBar from '../NavBars/NavBar';
import { onAuthStateChanged } from 'firebase/auth';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [authUser, setAuthUser] = useState(null);

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

        // Apelarea funcției pentru a obține profilul utilizatorului
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
              setAuthUser(user);
              getUserProfile();
            }
            else {
              setAuthUser(null);
            }
          });
    }, []); // Adăugarea lui auth.currentUser ca dependență

    return (
        <div>
            <NavBar />
            {userProfile ? (
                <div>
                    <p>Email: {userProfile.email}, Nickname: {userProfile.nickname}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
