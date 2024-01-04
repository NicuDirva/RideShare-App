import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase_auth';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import SignIn from '../auth/SignIn';
import { onAuthStateChanged } from 'firebase/auth';

function VisitProfile() {
    const { nickname } = useParams();
    const [profileData, setProfileData] = useState([]);
    const [authUser, setAuthUser] = useState(null);

    const getCollectionProfile = async () => {

        const q = query(collection(db, 'Profile'), where('nickname', '==', nickname));
        const querySnapshot = await getDocs(q);

        const profilesArray = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const profile = {
                data: data,
            };
            profilesArray.push(profile);
        });
        setProfileData(profilesArray);
    };

    useEffect(() => {
        getCollectionProfile();
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);

            }
            else {
                setAuthUser(null);
            }
        });
    }, [nickname]);

    return (
        <div>
            {
                authUser ?
                    <div>
                        <NavBar />
                        <div>
                            {profileData.map((profile) => (
                                <div className='search-profile-container'>
                                    <img alt='Avatar' className='avatar_post' src={profile.data.imgURL} />
                                    <div className='profile-info-row'>
                                        <div>
                                            <p>Nickname: {profile.data.nickname}</p>
                                            <p>Description: {profile.data.description}</p>
                                        </div>
                                        <div>
                                            <p>Email: {profile.data.email}</p>
                                            <p>Phone: {profile.data.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <SignIn />}
        </div>
    );
}

export default VisitProfile;
