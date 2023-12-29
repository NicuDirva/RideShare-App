import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import WelcomePage from './WelcomePage';
import NavBar from '../NavBars/NavBar';

function HomePage() {
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
        {
        authUser ?
        <>

            <div>
                <NavBar />
                <p>Home Page</p>
            </div>
        </>
        : <p>Loading...</p>
        }
    </div>
  )
}

export default HomePage
