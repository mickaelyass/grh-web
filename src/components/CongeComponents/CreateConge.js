import React from 'react';
import CongeForm from '../CongeComponents/CongeForm';
import { createDemandeConges } from '../../services/apiConge';
import Footer from '../Footer';
import MenuUser from '../MenuUser';
import Head from '../Head';
import '../Dasbord.css';


const CreateConge = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('matricule', values.matricule);
    formData.append('date_debut', values.date_debut);
    formData.append('annee_jouissance', values.annee_jouissance);
    formData.append('raison', values.raison);
    if (values.piece_jointe_1) {
      formData.append('certificat', values.piece_jointe_1);
    }

    if (values.piece_jointe_2) {
      formData.append('attestation', values.piece_jointe_2);
    }

    try {
      await createDemandeConges(formData);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de la demande de congés');
    }
  };

  return (
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuUser isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
        <div className='row'>
          <div className="col-md-3 col-lg-2 bg-light sidebar"></div>
          <div className='col-md-9 col-lg-10 main-content'>
            <div className='container'>
              <h1 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Créer une Demande de Congés</h1>
              <CongeForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateConge;
