import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import auth from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import WelcomeNavBar from '../WelcomeNavBar';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                navigate('/signin');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div>
            <WelcomeNavBar />
            <div className='sign-up-container'>
                <form onSubmit={signUp}>
                    <h1>Create Account</h1>
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

                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
