import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase_auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_auth';
import SignIn from './auth/SignIn';

function CreateRideForm(props) {
  const [authUser, setAuthUser] = useState(null);
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [departureData, setDepartureData] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [creatorPhotoURL, setCreatorPhotoURL] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adaugă un nou document în colecția "Ride", inclusiv un câmp "members" cu un array gol
      const docRef = await addDoc(collection(db, 'Ride'), {
        source_location: sourceLocation,
        destination_location: destinationLocation,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        available_seats: availableSeats,
        departure_data: departureData,
        creator_id: creatorId,
        creator_photo_url: creatorPhotoURL,
        members: [] // Adaugă câmpul "members" cu un array gol
      });

      const newRide = {
        id: docRef.id,
        data: {
          source_location: sourceLocation,
          destination_location: destinationLocation,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          available_seats: availableSeats,
          departure_data: departureData,
          creator_id: creatorId,
          creator_photo_url: creatorPhotoURL,
          members: [] // Adaugă câmpul "members" cu un array gol
        },
      };

      console.log('Document adăugat cu ID:', docRef.id);
      props.onSubmit[1](newRide);

      // Resetarea stării formularului după adăugarea cu succes
      setSourceLocation('');
      setDestinationLocation('');
      setDepartureTime('');
      setArrivalTime('');
      setAvailableSeats('');
      setDepartureData('');
      setIsVisible(false);
    } catch (error) {
      console.error('Eroare la adăugarea documentului:', error);
    }

    if (props && props.onSubmit && Array.isArray(props.onSubmit) && props.onSubmit.length > 0) {
      props.onSubmit[0]({
        source_location: sourceLocation,
        destination_location: destinationLocation,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        available_seats: availableSeats,
        departure_data: departureData,
        creator_id: creatorId,
        creator_photo_url: creatorPhotoURL,
        members: [] // Adaugă câmpul "members" cu un array gol în obiectul trimis prin onSubmit
      });
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked'); // Adaugă acest rând
    setIsVisible(false);
    props.onActivate();
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setCreatorId(user.uid);
        const id = user.uid;
        console.log(`IDDDD: ${id}`)
        const q = query(collection(db, 'Profile'), where('id', '==', id));
        const querySnapshot = await getDocs(q);

        // Verifică dacă există vreun document în rezultatele query-ului
        if (querySnapshot.size > 0) {
          const userDocSnapshot = querySnapshot.docs[0];
          const profileData = userDocSnapshot.data();

          // Verifică dacă imgURL este definit
          if (profileData && profileData.imgURL) {
            setCreatorPhotoURL(profileData.imgURL);
            console.log(`URLLLLL: ${profileData.imgURL}`);
          } else {
            console.log('imgURL nu este definit în documentul găsit');
          }
        } else {
          console.log('Documentul nu există');
        }

      }  // Actualizează creatorId cu ID-ul utilizatorului autentificat
      else {
        setAuthUser(null);
        setCreatorId('');  // Dacă nu există utilizator autentificat, poți seta creatorId la o valoare implicită sau la '' (șir gol)
      }
    });
    return () => {
      listen();
    }
  }, []);

  return (
    <div>
      {authUser ?
        isVisible && (
          <div className='forms-container'>
            <form onSubmit={handleSubmit}>
              <label>
                Departure data:
                <input type="date" value={departureData} onChange={(e) => setDepartureData(e.target.value)} required />
              </label>
              <br />
              <label>
                Source Location:
                <input type="text" value={sourceLocation} onChange={(e) => setSourceLocation(e.target.value)} required />
              </label>
              <br />
              <label>
                Destination Location:
                <input type="text" value={destinationLocation} onChange={(e) => setDestinationLocation(e.target.value)} required />
              </label>
              <br />
              <label>
                Departure Time:
                <input type="text" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
              </label>
              <br />
              <label>
                Arrival Time:
                <input type="text" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
              </label>
              <br />
              <label>
                Available Seats:
                <input type="number" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} required />
              </label>
              <br />
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancel}>Cancel</button>

            </form>
          </div>
        )
        :
        <SignIn />
      }
    </div>
  );
}

export default CreateRideForm