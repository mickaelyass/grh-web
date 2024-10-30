import React, { useState } from 'react';
import { uploadProfileImage } from '../../services/ImageServices';

const ImageUploadForm = ({ matricule}) => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState();
  const [loading,setLoading]=useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
      setLoading(true);
    try {
      //console.log(selectedFile);
      const response = await uploadProfileImage(matricule, selectedFile);
      console.log(response.data);
      setSuccessMessage(response.data.message);
      setError(null);
      setSelectedFile(null);
    } catch (error) {
      setError('Failed to upload image.',error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container">
    
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Select Image:</label>
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={handleFileChange}
            style={{ width: '70%',  }}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading? 'Uploading...':'Uplaod'}
        </button>
      </form>
      {successMessage && <div className="mt-3 text-success">{successMessage}</div>}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default ImageUploadForm;