import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser } from '../api/apiCalls';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const UserPage = () => {
    const [user , setUser] = useState();
    const [username] = useParams();

    useEffect(() => {
        const loadUser = async() => {
            try {
                const response =   await getUser(username)
                setUser(response.data)  
            } catch (error){}
        };
        loadUser();
    }, [username]);

    return (
        <div className="container"> 
            <ProfileCard >

            </ProfileCard>
        </div>
    );
};

export default UserPage;