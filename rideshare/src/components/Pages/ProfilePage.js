import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db, useAuth, upload } from '../../firebase_auth';
import NavBar from '../NavBar';
import { onAuthStateChanged } from 'firebase/auth';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoURL, setPhotoURL] = useState('https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=');
    const currentUser = useAuth();
    const [newNickname, setNewNickname] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newDescription, setNewDescription] = useState('');
  
    const handleNicknameChange = async () => {
        try {
            if (authUser) {
              const uid = authUser.uid;
              const q = query(collection(db, 'Profile'), where('id', '==', uid));
              const querySnapshot = await getDocs(q);
        
              if (querySnapshot.size > 0) {
                const userDocSnapshot = querySnapshot.docs[0];
                const profileRef = userDocSnapshot.ref;
        
                // Actualizează nickname-ul în baza de date
                await updateDoc(profileRef, {
                  nickname: newNickname,
                });
        
                // Actualizează starea locală cu noul nickname
                setUserProfile({ ...userProfile, nickname: newNickname });
        
                // Poți adăuga o notificare sau afișa un mesaj de succes
                console.log('Nickname updated successfully!');
              } else {
                console.log('Documentul nu există');
              }
            }
            setNewNickname('');
          } catch (error) {
            console.error('Eroare la actualizarea nickname-ului:', error);
          }
    };
  
    const handlePhoneChange = async () => {
        try {
            if (authUser) {
              const uid = authUser.uid;
              const q = query(collection(db, 'Profile'), where('id', '==', uid));
              const querySnapshot = await getDocs(q);
        
              if (querySnapshot.size > 0) {
                const userDocSnapshot = querySnapshot.docs[0];
                const profileRef = userDocSnapshot.ref;
        
                // Actualizează nickname-ul în baza de date
                await updateDoc(profileRef, {
                  phone: newPhone,
                });
        
                // Actualizează starea locală cu noul nickname
                setUserProfile({ ...userProfile, phone: newPhone });
        
                // Poți adăuga o notificare sau afișa un mesaj de succes
                console.log('Phone updated successfully!');
              } else {
                console.log('Documentul nu există');
              }
            }
            setNewPhone('');
          } catch (error) {
            console.error('Eroare la actualizarea phone-ului:', error);
          }
    };
  
    const handleDescriptionChange = async () => {
        try {
            if (authUser) {
              const uid = authUser.uid;
              const q = query(collection(db, 'Profile'), where('id', '==', uid));
              const querySnapshot = await getDocs(q);
        
              if (querySnapshot.size > 0) {
                const userDocSnapshot = querySnapshot.docs[0];
                const profileRef = userDocSnapshot.ref;
        
                // Actualizează nickname-ul în baza de date
                await updateDoc(profileRef, {
                  description: newDescription,
                });
        
                // Actualizează starea locală cu noul nickname
                setUserProfile({ ...userProfile, description: newDescription });
        
                // Poți adăuga o notificare sau afișa un mesaj de succes
                console.log('Description updated successfully!');
              } else {
                console.log('Documentul nu există');
              }
            }
            setNewDescription('');
          } catch (error) {
            console.error('Eroare la actualizarea description-ului:', error);
          }
    };


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

        if (currentUser && currentUser.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }

    }, [currentUser]);

    const changeAvatar = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    }

    const uploadAvatar = () => {
        upload(photo, currentUser, setLoading);
    }

    return (
        <div>
            <NavBar />
            {userProfile ? (
                <div className='main-container'>
                    <div className='left-container'>
                        <div className='avatar-container'>
                            <img alt='Avatar' className='avatar' src={photoURL} />
                            <input onChange={changeAvatar} type='file' />
                            <button disabled={loading || !photo} onClick={uploadAvatar}>Upload</button>
                        </div>
                        <br />
                        <br />
                        <div className='nickname-container'>
                            <p>Nickname: {userProfile.nickname}</p>
                            <input type='text' placeholder='New Nickname' value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                            <button onClick={handleNicknameChange}>Change Nickname</button>
                        </div>
                        <br />
                        <br />
                        <div className='description-container'>
                            <p>Description: {userProfile.description}</p>
                            <input type='text' placeholder='New Description' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                            <button onClick={handleDescriptionChange}>Change Description</button>
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className='information-container'>
                            <p>Information</p>
                            <div>
                                <div>
                                    <p>Email</p>
                                    <p>{userProfile.email}</p>
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <p>{userProfile.phone}</p>
                                    <input type='text' placeholder='New Phone' value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                                    <button onClick={handlePhoneChange}>Change Phone</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
