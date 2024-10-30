import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUtilisateur, updateUtilisateur } from '../../../services/apiUser';
import UtilisateurForm from './UtilisateurForm';
import { useParams} from 'react-router-dom';
import '../Dasbord.css' ;

const EditUtilisateur = () => {
  const navigate = useNavigate();
  const { id} = useParams();
  const [Utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    fetchUtilisateur();
  }, [id]);

  const fetchUtilisateur = async () => {
    try {
      const response = await getUtilisateur(id);
      setUtilisateur(response.data);
    } catch (error) {
      console.error('Error fetching Utilisateur', error);
    }
  };

  const handleSubmit = async (UtilisateurData) => {
    try {
      await updateUtilisateur(id, UtilisateurData);
      console.log(UtilisateurData);
      navigate('/utilisateur-list');
    } catch (error) {
      console.error('Error updating Utilisateur', error);
    }
    
  };

 

  return (
    
    <div className="dashboard">
      <div className="container">
      <h1>Edit Utilisateur</h1>
      {Utilisateur ? (
        <UtilisateurForm user={Utilisateur} onSubmit={handleSubmit} />
      ) : (
        <p>Chargement du Utilisateur...</p>
      )}
    </div>
    </div>
   
  );
};

export default EditUtilisateur;
