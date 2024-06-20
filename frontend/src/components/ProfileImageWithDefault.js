import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = props => {
  const { image, tempimage } = props;

  let imageSource = defaultPicture;
  if (image) {
    imageSource = 'images/' + image;
  }
  console.log('tempImage',tempimage);
  console.log('imagesource',imageSource);
  return (
    <img
      alt={`Profile`}
      src={tempimage ? tempimage : imageSource}
      {...props}
      onError={event => {
        event.target.src = defaultPicture;
      }}
    />
  );
};

export default ProfileImageWithDefault;