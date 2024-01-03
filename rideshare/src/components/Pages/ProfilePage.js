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
  const [photoURL, setPhotoURL] = useState('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgFBQkGBxYIBwYGBw8ICQgWIBEiIiAdHx8YHSggGCYlGx8fITEhJSkrLi4uFx8zODMsNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAMgAyAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwIBB//EADEQAQACAQIDBQYFBQAAAAAAAAABAgMEEgURIiEyQlJxEyMxUVNiQXKBkcEzYWNz0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9bAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHm960pNrzWta13WtZSa7id8szTBNsOPu7vFYFpqNfp9Pzi991vp4+qyDfjUR/Tw7v8AZdUALWONX59WHHy+26Vp+K4MsxW+7Ba31O7+6gAa74jM4NdqMHKKZLWr9O3VVdaHXU1VeU+7yV72PzegJgAAAAAAAAAAAAAAAAI+vzew0uS8T1bdtfWQVXFtZObJOGk+7xW6tvilXAAAAAA9UvalovSbVtXqraryA0fD9XGqw8521yU6b1/lLZjQ6idNqKX59Pdv6NPE845wAAAAAAAAAAAAAAAq+O35YcdPNfd+y0VHHufPD8u0FQAAAAAAAA0+hvN9HitPx2Mw0vDqzXRYonybgSQAAAAAAAAAAAAAFbxyk209LxH9K/V+qyQeL5JporREbva22flBnwAAAAAAAeqV32rWPFba1VKxStaR8KV2spEzExMTtmrR8Nve+jx2yza1rc+q3yBKAAAAAAAAAAAAAAcNZhjUafJSY7du6vq7gMlMcpmJ+NXxO4pprYM83iPd57bq2/v8kEAAAAAH2Im0xERum3drUHTTYbajPTHX42t1W8sNRWsUrWsfCtdtVbwnQ3wzOXL02tXbXH5YWYAAAAAAAAAAAAAAAAOebHXNjtjvG6L12/lZnNjthy2x3jtpba1Sp43p+da56x216L/wCnAAAAWnBNPFsls1o7MXTT1VbQcHrt0VZ89psCcAAAAAAAAAAAAAAAAAAj8RrFtFlifJuSFfxnNFNN7OJ6s9tv6AoQAAAGh4ReLaKkeS01szyz4LqIplthtPZl6qeoLsAAAAAAAAAAAAAAAAR82s0+Hv5MfPy16rK/U8YtbnXT02/wCTJ/wFjqtTj01N2Se3w4/FZntTqL6nLN7+Lu18sOeS98lpvktbJa3is8gAAAAPtZmtotWds16q2fAF/wAP19NRSKXmtMte9XzJ7JRMxPOJ2ystHxW9OVNRFstfDkr3qguxzw5seeu7FeuSPtdAAAAAAAAAHy1orWbWmtYr3rWecuSmKlr5Lba171lBrtdk1NpiN2PHXu4/N6gmavi0Vmaaatck/Vt3Vbl1ObNMzkyXt9u7pcQAAAAAAAAAAAAHql70tFqWtjmvirZPwcXy05RmrXPHm7tlcA0en4hp8/ZF/ZW+nk6UtkU3R8Qy6a0VtNsuP6dvD6A0I54ctM+OMmO26tnQAAAEDi+onDp9lZ22z9P6fiCu4prJ1OXZSfd4rdP3T80EAAAAAAAAAAAAAAAAAAAS+H6u2my9u62O/fr/AC0UTFqxaJ3RbqrZkl5wXUTfDbFad04O76AsgAFBxrJu1ez8MVIqAIAAAAAAAAAAAAAAAAAAAACXwvN7HWU5z05eiwA0YAP/2Q==');
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

  const uploadAvatar = async () => {
    upload(photo, currentUser, setLoading);

    ///Facem update si la ride urile ale caror e creator
    const q = query(collection(db, 'Ride'), where('creator_id', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    const updatePromises = [];

    querySnapshot.forEach((doc) => {
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
  }

  return (
    <div>
      <NavBar />
      {userProfile ? (
        <div className='main-container'>
          <div className='left-container'>
            <div className='avatar-container'>
              <img alt='Avatar' className='avatar' src={photoURL} />
              <br/>
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
              <p>Information:</p>
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
