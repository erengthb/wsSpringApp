import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = props => {
  const { image, tempimage } = props;

  let imageSource = defaultPicture;
  if (image) {
    imageSource = process.env.REACT_APP_API_URL + '/' + image;
  }

  return (
    <img
      alt="Profile"
      src={tempimage ? tempimage : imageSource}
      {...props}
      onError={event => {
        console.error('Image load failed:', event.target.src);
        event.target.src = defaultPicture;
      }}
    />
  );
};

export default ProfileImageWithDefault;
