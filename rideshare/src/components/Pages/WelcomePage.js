import { Link } from 'react-router-dom'
import SignIn from '../auth/SignIn'
import HomePage from './HomePage';
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';


function WelcomePage() {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUser(user);
          }
          else {
            setAuthUser(null);
          }
        });
      }, []);
      
    return (
        <div>
            <SignIn />
        </div>

    )
}

export default WelcomePage

