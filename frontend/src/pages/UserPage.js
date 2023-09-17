import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser } from '../api/apiCalls';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useTranslation } from 'react-i18next';

const UserPage = () => {
    const [user , setUser] = useState();
    const {username} = useParams();
    const [notFound ,setNotFound] = useState(false);
    const {t}=useTranslation();

    useEffect(() => {
        setNotFound(false);
    },[user])

    useEffect(() => {
        const loadUser = async() => {
            try {
                const response =   await getUser(username)
                setUser(response.data)               
            } catch (error){
                setNotFound(true);
            }
        };
        loadUser();
    }, [username]);

    if(notFound){
        return (
            <div className='container'>
                 <div className="alert alert-danger text-center">
                    <div>
                    <span className="material-icons" style = {{fontSize:'48px'}}>error</span>
                    </div>
                   {t('User not found')}
                    </div>
            </div>     
        );      
    }

    return (
        <div className="container"> 
            <ProfileCard >
            </ProfileCard>
        </div>
    );
};

export default UserPage;