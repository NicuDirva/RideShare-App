import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import auth from '../../firebase';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
        })
        .catch((error) => {
            console.log(error);
        });
    }

  return (
    <div className='sign-in-container'>
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

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Afișează mesajul de eroare dacă există */}
        </form>
    </div>
  )
}

export default SignIn
