import React, { useEffect, useState } from 'react'
import auth from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import WelcomePage from './WelcomePage';
import NavBar from './NavBar';

function HomePage() {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        });

        return () => {
            listen();
        }
    }, []);

  return (
    <div>
        {
        authUser ?
        <>

            <div>
                <NavBar />
                <p>{`Welcome ${authUser.email}`}</p>
            </div>
        </>
        : <WelcomePage />
        }
    </div>
  )
}

export default HomePage
