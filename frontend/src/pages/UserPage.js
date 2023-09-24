import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser } from '../api/apiCalls';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useTranslation } from 'react-i18next';
import {useApiProgress} from '../shared/ApiProgress';
import Spinner from '../components/Spinner';
 
const UserPage = () => {
    const [user , setUser] = useState({});
    const {username} = useParams();
    const [notFound ,setNotFound] = useState(false);
    const {t}=useTranslation();
    const pendingApiCall = useApiProgress('get','/api/1.0/users/' + username)

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

    if(pendingApiCall){
        return(
        <Spinner></Spinner>
        )
    }

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
            <ProfileCard user={user}>
            </ProfileCard>
        </div>
    );
};

export default UserPage;