import React, { useEffect, useState } from 'react';
import { getFile } from '../services/ImageServices';

const Documents = ({ matricule }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getFile(matricule);
        console.log(response.data);
        setDocuments(response.data);
      } catch (error) {
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    if (matricule) {
      fetchDocuments();
    }
  }, [matricule]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-center mt-5">No documents found for this user.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="list-group">
        {documents.map((document, index) => (
          <div key={index} className="list-group-item">
            <iframe
              className="img-fluid my-3"
              src={document.file_url}
              title={`Document ${index}`}
              style={{ width: '100%', height: '70%' }}
            />
            <a
              href={document.file_url}
              download
              className="btn btn-primary mt-2"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
