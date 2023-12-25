import React, { useEffect, useState } from 'react'
import auth from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth';

function AuthDetails() {
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

    const userSignOut = () => {
        signOut(auth).
            then(() => {
                console.log("Sign Out with succesfull!")
            }).
            catch(error => console.log(error))
    }

    return (
        <div>{authUser ?
            <>
                <p>{`Signed In as ${authUser.email}`}</p>
                <button onClick={userSignOut}>Sign Out</button>
            </>
            : <p>Signed Up</p>}</div>
    )
}

export default AuthDetails
