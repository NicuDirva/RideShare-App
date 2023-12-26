import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import { Link } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';


function App() {
  return (
    <div className="App">
      <div className='signIn'>
        <SignIn />
      </div>
      {/* <li><Link to="signin" style={{ textDecoration: 'none' }}>Log In</Link></li>
      <li><Link to="signup" style={{ textDecoration: 'none' }}>Create Account</Link></li> */}
    </div>
  );
}

export default App;
