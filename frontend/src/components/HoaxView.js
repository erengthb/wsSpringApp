import React from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const HoaxView = (props) => {
  const { hoax } = props;
  const{user,content} = hoax;
  const{username,displayName,image} = user;

  return (
    <div>
      <div className='card p-1'>
        <div className="d-flex">
        <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-1" />
        <div className ="flex-fill m-auto pl-2">
            <Link to={`/user/${username}`} className="text-decoration-none text-dark">
             <h6>{displayName}@{username}</h6>
            </Link>
        </div>
        
        
        </div>
          <div className="pl-5">
            {content}
          </div>
      
      </div>
    </div>
  )
}

export default HoaxView