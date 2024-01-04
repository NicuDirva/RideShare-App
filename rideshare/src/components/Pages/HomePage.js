import React, { useEffect, useState } from 'react'
import { auth, useAuth } from '../../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import NavBar from '../NavBar';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase_auth';
import CreateRideForm from '../CreateRide';
import { useNavigate } from 'react-router-dom';
import SignIn from '../auth/SignIn';

function HomePage() {
  const [authUser, setAuthUser] = useState(null);
  const [ridesData, setRidesData] = useState([]);
  const [showCreateRideForm, setShowCreateRideForm] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const currentUser = useAuth();
  const navigate = useNavigate();

  const handleClickPhoto = (creatorId) => {
    // Redirecționează utilizatorul către profilul creatorului
    navigate(`/click-photo/${creatorId}`);
  };

  const handleActivate = () => {
    setShowCreateRideForm(false);
  }

  const handleDeleteRide = async (rideId) => {
    try {
      // Șterge documentul din colecția "Ride" cu ID-ul specificat
      console.error(`Id ul Ride ului pe care am apasat stergere este ${rideId}`);
      await deleteDoc(doc(db, 'Ride', rideId));

      // Actualizează starea pentru a reflecta ștergerea ride-ului
      console.log('RidesData înainte de ștergere:', ridesData);
      await setRidesData((ridesData) => ridesData.filter(ride => ride.id !== rideId));
    
      console.log('RidesData după ștergere:', ridesData);
    } catch (error) {
      console.error('Eroare la ștergerea ride-ului:', error);
    }
  };

  const handleCreateRide = () => {
    setShowCreateRideForm(true);
  }

  const handleCreateRideSubmit = () => {
    setShowCreateRideForm(false);
  };
  const handleAddRide = (newRide) => {
    // Adaugă noul ride la lista existentă
    setRidesData((ridesData) => [...ridesData, newRide]);
  };

  const handleRemoveMember = async (rideId, memberId) => {
    try {
      // Obține documentul "Ride" cu ID-ul specificat
      const rideRef = doc(db, 'Ride', rideId);
      const rideDoc = await getDoc(rideRef);

      if (rideDoc.exists()) {
        // Verifică dacă utilizatorul curent este creatorul ride-ului
        if (rideDoc.data().creator_id === authUser.uid) {
          // Elimină membrul specificat din lista de membri
          const updatedMembers = rideDoc.data().members.filter(member => member.memberId !== memberId);

          // Actualizează documentul "Ride" cu lista de membri actualizată
          await updateDoc(rideRef, {
            members: updatedMembers,
          });

          // Actualizează starea pentru a reflecta eliminarea membrului din ride
          setRidesData((ridesData) =>
            ridesData.map((ride) =>
              ride.id === rideId
                ? {
                  ...ride,
                  data: {
                    ...ride.data,
                    members: updatedMembers,
                  },
                }
                : ride
            )
          );

          console.log('Membrul a fost eliminat cu succes.');
        } else {
          console.log('Nu ai permisiunea să elimini membri din acest ride.');
        }
      } else {
        console.error('Ride-ul nu există.');
      }
    } catch (error) {
      console.error('Eroare la eliminarea membrului din ride:', error);
    }
  };


  const handleCancelJoinRide = async (rideId) => {
    try {
      // Obține documentul "Ride" cu ID-ul specificat
      const rideRef = doc(db, 'Ride', rideId);
      const rideDoc = await getDoc(rideRef);

      if (rideDoc.exists()) {
        // Obține ID-ul utilizatorului curent
        const userId = authUser.uid;

        // Verifică dacă utilizatorul curent este membru al ride-ului
        const isMember = rideDoc.data().members.some(member => member.memberId === userId);

        if (isMember) {
          // Elimină utilizatorul curent din lista de membri
          const updatedMembers = rideDoc.data().members.filter(member => member.memberId !== userId);

          // Actualizează documentul "Ride" cu lista de membri actualizată
          await updateDoc(rideRef, {
            members: updatedMembers,
          });

          // Actualizează starea pentru a reflecta eliminarea din ride
          setRidesData((ridesData) =>
            ridesData.map((ride) =>
              ride.id === rideId
                ? {
                  ...ride,
                  data: {
                    ...ride.data,
                    members: updatedMembers,
                  },
                }
                : ride
            )
          );

          console.log('Alăturarea a fost anulată cu succes.');
        } else {
          console.log('Utilizatorul nu este membru al acestui ride.');
        }
      } else {
        console.error('Ride-ul nu există.');
      }
    } catch (error) {
      console.error('Eroare la anularea alăturării la ride:', error);
    }
  };





  const handleJoinRide = async (rideId) => {
    try {
      // Obține documentul "Ride" cu ID-ul specificat
      const rideRef = doc(db, 'Ride', rideId);
      const rideDoc = await getDoc(rideRef);
      console.log(`ID RIDEEEEEEEEEEEEEEE: ${rideId}`);

      if (rideDoc.exists()) {
        // Verifică dacă utilizatorul curent nu este deja membru
        const userId = authUser.uid;

        const q = query(collection(db, 'Profile'), where('id', '==', userId));
        const querySnapshot = await getDocs(q);

        const userDocSnapshot = querySnapshot.docs[0];
        const imgURL = userDocSnapshot.data().imgURL;

        setCurrentMember({ userId, imgURL });
        console.log(`ID MEMBERRRRRRRR: ${userId}`);
        console.log(`imgURLLLLLLLLLLLLLLL: ${imgURL}`);
        const isMember = rideDoc.data().members.some(member => member.memberId === userId);


        if (!isMember) {
          // Adaugă utilizatorul curent la lista de membri
          await updateDoc(rideRef, {
            members: [
              ...rideDoc.data().members,
              {
                memberId: currentMember.userId,
                memberURL: currentMember.imgURL,
              },
            ],
          });

          // Actualizează starea pentru a reflecta adăugarea la ride
          setRidesData((ridesData) =>
            ridesData.map((ride) =>
              ride.id === rideId
                ? {
                  ...ride,
                  data: {
                    ...ride.data,
                    members: [
                      ...ride.data.members,
                      {
                        memberId: currentMember.userId,
                        memberURL: currentMember.imgURL,
                      },
                    ],
                  },
                }
                : ride
            )
          );
        } else {
          console.log('Utilizatorul este deja membru al acestui ride.');
        }
      } else {
        console.error('Ride-ul nu există.');
      }
    } catch (error) {
      console.error('Eroare la adăugarea utilizatorului la ride:', error);
    }
  };














  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);

      }
      else {
        setAuthUser(null);
      }
    });

    async function getCollectionData() {
      try {
        const q1 = collection(db, 'Ride');
        const querySnapshot1 = await getDocs(q1);

        const ridesArray = [];
        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          const rideWithId = {
            id: doc.id, // Adăugați ID-ul documentului la obiectul ride
            data: data,
          };
          ridesArray.push(rideWithId);
        });

        // Actualizează starea cu array-ul de date
        setRidesData(ridesArray);
      } catch (error) {
        console.error('Eroare la obținerea datelor:', error);
      }

    }

    getCollectionData();
    if (currentUser && currentUser.photoURL) {
      console.log(`IMG LA CURENT USERRRRR: ${currentUser.photoURL}`)
    }

  }, [currentUser]);

  return (
    <div>
      {

        authUser ?
          <div>
            <NavBar />

            <h2>Rides:</h2>

            {showCreateRideForm ? (
              <CreateRideForm onSubmit={[handleCreateRideSubmit, handleAddRide]} onActivate={handleActivate} />
            ) : (
              <button className='my-button' onClick={handleCreateRide}>Creează Ride</button>
            )}

            <div className='rides-container'>
              {ridesData.map((ride) => (
                <div className='ride-container'>

                  <div class='ride-participants-info'>
                    <div className='fiveth-div'>
                      <div>Driver:</div>
                      <div><img
                        onClick={() => handleClickPhoto(ride.data.creator_id)}
                        alt='Avatar'
                        className='avatar_post'
                        src={ride.data.creator_photo_url}
                      /></div>
                    </div>
                    <div className='fourth-div'>
                      <div>Riders:</div>
                      <div className='riders-img'>
                        {ride.data.members.map(member => (
                          <div key={member.memberId}>
                            <img
                              onClick={() => handleClickPhoto(member.memberId)}
                              alt='Avatar'
                              className='avatar_post'
                              src={member.memberURL}
                            />
                            {authUser && ride.data.creator_id === authUser.uid && (
                              <div>
                                <button onClick={() => handleRemoveMember(ride.id, member.memberId)}>Elimină Membru</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='first-div'>
                    <div ><p>From: {ride.data.source_location}</p></div>
                    <div><p>To: {ride.data.destination_location}</p></div>
                  </div>

                  <div className='second-div'>
                    <div><p>Departure time: {ride.data.departure_time}</p></div>
                    {(ride.data.available_seats > ride.data.members.length && ride.data.creator_id !== authUser.uid && (!ride.data.members || !ride.data.members.some(member => member.memberId === authUser.uid))) ? (
                      <button onClick={() => handleJoinRide(ride.id)}>Alatura-te!</button>
                    ) : null}
                    {!(!ride.data.members || !ride.data.members.some(member => member.memberId === authUser.uid)) ? (
                      <button onClick={() => handleCancelJoinRide(ride.id)}>Anuleaza!</button>
                    ) : null}
                    <div><p>Arrival time: {ride.data.arrival_time}</p></div>
                  </div>
                  <div className='third-div'>
                    <div><p>Number of seats: {ride.data.available_seats}</p></div>
                    {authUser && ride.data.creator_id === authUser.uid && (
                      <button onClick={() => handleDeleteRide(ride.id)}>Șterge Ride</button>
                    )}
                    <div><p>Date: {ride.data.departure_data}</p></div>
                  </div>

                </div>
              ))}
            </div>



          </div>
          : <SignIn/>
      }
    </div>
  )
}

export default HomePage