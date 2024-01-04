import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase_auth';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                navigate('/home');
            })
            .catch((error) => {
                console.log(error);

                // Tratează eroarea de autentificare incorectă
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                    alert('Invalid email or password. Please try again.');
                } else {
                    alert(errorMessage);
                }
            });
    };

    return (
        <div>
            <NavBar />
            <div className='sign-container'>
                <div className='content-container'>
                    <form onSubmit={signIn}>
                        <h1>Sign In to your Account</h1>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                        <button type='submit'>Log In</button>
                    </form>
                    <div>
                        <Link to="/signup" style={{ textDecoration: 'none' }}>Don't have an account? Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
