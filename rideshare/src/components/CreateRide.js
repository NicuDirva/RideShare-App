import React, {  Component,useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase_auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_auth';
import HomePage from './Pages/HomePage';
import Profile from './Pages/ProfilePage';

function CreateRideForm (props) {
    const [authUser, setAuthUser] = useState(null);
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [departureData, setDepartureData] = useState('');
  const [creatorId, setCreatorId] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validare sau alte verificări pot fi adăugate aici înainte de a adăuga datele în baza de date

    try {
      // Adaugă un nou document în colecția "Ride"
      const docRef = await addDoc(collection(db, 'Ride'), {
        source_location: sourceLocation,
        destination_location: destinationLocation,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        available_seats: availableSeats,
        departure_data: departureData,
        creator_id: creatorId, 
      });

      console.log('Document adăugat cu ID:', docRef.id);

      // Resetarea stării formularului după adăugarea cu succes
      setSourceLocation('');
      setDestinationLocation('');
      setDepartureTime('');
      setArrivalTime('');
      setAvailableSeats('');
      setDepartureData('');
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
      });
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setCreatorId(user.uid);  // Actualizează creatorId cu ID-ul utilizatorului autentificat
      } else {
        setAuthUser(null);
        setCreatorId('');  // Dacă nu există utilizator autentificat, poți seta creatorId la o valoare implicită sau la '' (șir gol)
      }
    });
    return () => {
      listen();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
        <label>
        Departure data:
        <input type="text" value={departureData} onChange={(e) => setDepartureData(e.target.value)} required />
      </label>
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
        <input type="text" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateRideForm;