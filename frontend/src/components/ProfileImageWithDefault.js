import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = props => {
  const { image, tempimage } = props;

  let imageSource = defaultPicture;
  console.log('imagee',image);
  if (image) {
    imageSource = 'images/' + image;
  }
  return (
    <img
      alt={`Profile`}
      src={tempimage || imageSource}
      {...props}
     
    />
  );
};

export default ProfileImageWithDefault;