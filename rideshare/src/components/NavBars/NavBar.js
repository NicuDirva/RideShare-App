import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase_auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import WelcomePage from '../Pages/WelcomePage';
import { useNavigate } from 'react-router-dom';

function NavBar() {
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

  const navigate = useNavigate();
  return (
    <div>
      {authUser ?
        <div>
          <nav className='nav'>
            <h1>Ride~Share</h1>
            <ul>
              <li>Hi {authUser.email}</li>
              <li><a href='/home'>Home</a></li>
              <li><a href='/profile'>Profile</a></li>
              <li><a href='/welcome'>Sign Out</a></li>
            </ul>
          </nav>
        </div>
        :
        <p></p>}
    </div>
  )
}

export default NavBar
