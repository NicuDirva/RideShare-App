import React, { useState } from 'react'
import VisitProfile from './Pages/SearchProfile';
import { useNavigate, useHistory } from 'react-router-dom';

function SearchBar() {

    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleOnSearch = () => {
      navigate(`/visit-profile/${searchText}`);
    }
  return (
    <div>
        <input type='text' placeholder='Nickname' value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
        <button onClick={handleOnSearch}>Search</button>
    </div>
  )
}

export default SearchBar
