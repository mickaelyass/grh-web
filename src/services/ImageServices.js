import axios from 'axios';

const API_URL = 'http://localhost:3003/api';

/* export const uploadProfileImage = async (matricule, file) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  formData.append('matricule', matricule);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
 */
/* export const getProfileImage = async (matricule) => {
  try {
    const response = await axios.get(`${API_URL}/user/${matricule}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching profile image:', error);
    throw error;
  }
}; */

export const getProfileImage = (matricule) => {
  return axios.get(`${API_URL}/user/${matricule}`);
};

export const uploadProfileImage = async (matricule, file) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  formData.append('matricule', matricule);

 return axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  
};




export const getFile = (matricule) => {
  return axios.get(`${API_URL}/user/file/${matricule}`);
};

export const uploadFile = async (matricule, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('matricule', matricule);

 return axios.post(`${API_URL}/doc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  
};

/* export const getUserProfile = async (matricule) => {
    try {
      const response = await axios.get(`${API_URL}/user/${matricule}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }; */
  