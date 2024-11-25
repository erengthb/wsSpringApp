import React from 'react';
import UserList from '../components/UserList';
import HoaxSubmit from '../components/HoaxSubmit';
import { useSelector } from 'react-redux';

const Homepage = () => {

   const {isLoggedIn}  = useSelector(store => ({isLoggedIn:store.isLoggedIn}))

    return (
        <div className="container"> 
                <div  className='row'>
                    <div className='col'>
                       {isLoggedIn && <HoaxSubmit></HoaxSubmit>}
                 </div>
                     <div className='col'>
                         <UserList></UserList>
                     </div>
             </div>
        </div>
    );
};

export default Homepage;