import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import NavBar from '../NavBar';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase_auth';
import CreateRideForm from '../CreateRide';
import Profile from './ProfilePage';

function HomePage() {
  const [authUser, setAuthUser] = useState(null);
  const [ridesData, setRidesData] = useState([]);
  const [showCreateRideForm, setShowCreateRideForm] = useState(false);


  const handleDeleteRide = async (rideId) => {
    try {
      // Șterge documentul din colecția "Ride" cu ID-ul specificat
      console.error(`Id ul Ride ului pe care am apasat stergere este ${rideId}`);
      await deleteDoc(doc(db, 'Ride', rideId));

      // Actualizează starea pentru a reflecta ștergerea ride-ului
      setRidesData((ridesData) => ridesData.filter(ride => ride.data.id !== rideId));
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

  }, []);

  return (
    <div>
      {

        authUser ?
          <div>
            <NavBar />

            <h2>Rides:</h2>

            <div className='rides-container'>
              {ridesData.map((ride) => (
                <div className='ride-container'>
                  <div className='first-div'>
                    <div ><p>From: {ride.data.source_location}</p></div>
                    <div><p>To: {ride.data.destination_location}</p></div>
                  </div>

                  <div className='second-div'>
                    <div><p>Departure time: {ride.data.departure_time}</p></div>
                    <div><p>Arrival time: {ride.data.arrival_time}</p></div>
                  </div>
                  <div className='third-div'>
                    <div><p>Number of seats: {ride.data.available_seats}</p></div>
                    <div>{authUser && ride.data.creator_id === authUser.uid && (
                      <button onClick={() => handleDeleteRide(ride.id)}>Șterge Ride</button>
                    )}</div>
                    <div><p>Date: {ride.data.departure_data}</p></div>
                  </div>

                  <div className='fourth-div'>
                  </div>
                
                </div>
              ))}
            </div>

            {showCreateRideForm ? (
              <CreateRideForm onSubmit={[handleCreateRideSubmit, handleAddRide]} />
            ) : (
              <button onClick={handleCreateRide}>Creează Ride</button>
            )}


          </div>
          : <p>Loading...</p>
      }
    </div>
  )
}

export default HomePage