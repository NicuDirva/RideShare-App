import React, { useEffect, useState } from 'react'
import { useNavigate, useHistory } from 'react-router-dom';
import SignIn from './auth/SignIn';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_auth';

function SearchBar() {

  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  const handleOnSearch = () => {
    navigate(`/visit-profile/${searchText}`);
  }

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
      {authUser ?
        <div>
          <input type='text' placeholder='Nickname' value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
          <button onClick={handleOnSearch}>Search</button>
        </div>
        :
        <SignIn />}
    </div>
  )
}

export default SearchBar
