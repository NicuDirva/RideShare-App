import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { Link } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <div className='signIn'>
        <SignIn />
      </div>
    </div>
  );
}

export default App;
