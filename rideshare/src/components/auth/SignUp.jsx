import React, { useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db} from '../../firebase_auth';
import { useNavigate, Link } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import NavBar from '../NavBar';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const createProfile = async (user, email) => {
        if (user) {
            const uid = user.uid;
            const collectionRef = collection(db, "Profile");
            const payload = {email: email, nickname: "", phone: "", description: "Acest user inca nu are o descriere.", id: uid, avatar_url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1300845620%2Fvector%2Fuser-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DyBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o%3D&tbnid=TKFsruyOZwCqgM&vet=12ahUKEwjIwMbY5LKDAxVQi_0HHXMHCfAQMygKegQIARBl..i&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Favatar&docid=0zpuT7PRhpWJMM&w=612&h=612&q=image%20avatar&ved=2ahUKEwjIwMbY5LKDAxVQi_0HHXMHCfAQMygKegQIARBl" };
            await addDoc(collectionRef, payload);
        } else {
            // Tratează cazul în care utilizatorul nu există
        }
    };
    
    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(userCredential);
                navigate('/signin');
                createProfile(user, email);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <NavBar/>
            <div className='sign-container'>
                <div className='content-container'>
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

                    <div>
                        <Link to="/signin" style={{ textDecoration: 'none' }}>Have an account? Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
