import React, { useEffect, useState } from 'react';
import { getProfileImage } from '../services/ImageServices';

const ImageProfileEmploye = ({ matricule}) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
    try {
      const response = await getProfileImage(matricule);
      console.log(response);
      setProfileImageUrl(response.data.profileImageUrl);
      console.log(response.data.profileImageUrl);
    } catch (error) {
      setError('Failed to fetch profile image',error);
    }
  };
    fetchProfileImage();
    
  }, [matricule]);

 


  if (error) return <p>{error}</p>;

  return (
    <div className="container mb-3">
      {/*  <p className='h4 text-primary'>Profile Image</p> */}
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="img-fluid border border-primary"
          style={{ maxWidth: '150px' }}
        />
      ) : (
        <p>No profile image available</p>
      )}
    </div>
  );
};

export default ImageProfileEmploye;
