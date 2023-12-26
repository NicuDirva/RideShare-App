import { Link } from 'react-router-dom'
import SignIn from './auth/SignIn'
import AuthDetails from './auth/AuthDetails'
import HomePage from './HomePage';
import React, { useEffect, useState } from 'react'
import auth from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


function WelcomePage() {
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

            <div className='signIn'>
                <SignIn />
            </div>


        </div>

    )
}

export default WelcomePage

