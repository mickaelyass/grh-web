import api from './http';
const API_URL = import.meta.env.VITE_API_BASE_URL; 
//const API_URL = "https://app-backend-011q.onrender.com/api";

//const API_URL = import.meta.env.VITE_API_BASE_URL;// Update this with your backend API URL
//const API_URL="http://localhost:3003/api"
/* export const uploadProfileImage = async (matricule, file) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  formData.append('matricule', matricule);

  try {
    const response = await api.post(`/upload`, formData, {
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
    const response = await api.get(`/user/${matricule}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching profile image:', error);
    throw error;
  }
}; */

export const getProfileImage = (matricule) => {
  return api.get(`/user/${matricule}`);
};

export const uploadProfileImage = async (matricule, file) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  formData.append('matricule', matricule);

 return api.post(`/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  
};




export const getFile = (matricule) => {
  return api.get(`/user/file/${matricule}`);
};

export const uploadFile = async (matricule, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('matricule', matricule);

 return api.post(`/doc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  
};

/* export const getUserProfile = async (matricule) => {
    try {
      const response = await api.get(`/user/${matricule}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }; */
  