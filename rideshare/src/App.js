import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import { Link } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <h1>Bine ai venit!</h1>
      <Link to="signin" style={{ textDecoration: 'none' }}>Log In</Link>
      <Link to="signup" style={{ textDecoration: 'none' }}>Create Account</Link>
    </div>
  );
}

export default App;
