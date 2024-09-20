import React, { useEffect, useState } from 'react';
import { getDossiers,getDossierSearch} from '../../services/api';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import Head from '../Head';
import MenuAdminD from '../MenuAdminD';
import '../Dasbord.css'

const DossierListD = () => {
  const [dossiers, setDossiers] = useState({
    actifs: [],
    retireesDecedes: [],
    autres: []
  });
  
  const [nom, setNom] = useState('');
  const [service, setService] = useState('');
  useEffect(() => {
    fetchDossiers();
    console.log(dossiers);
  },[]);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      const allDossiers = response.data;

      // Filtrer les dossiers en fonction de l'état de départ
      const actifs = allDossiers.filter(dossier => dossier.InfoPro.etat_depart === 'Actif');
      const retireesDecedes = allDossiers.filter(dossier => dossier.InfoPro.etat_depart === 'Retraite' || dossier.InfoPro.etat_depart === 'Décédé');
      const autres = allDossiers.filter(dossier => !['Actif', 'Retraite', 'Décédé'].includes(dossier.InfoPro.etat_depart));
  
      setDossiers({
        actifs,
        retireesDecedes,
        autres
      });
    } catch (error) {
      console.error('Error fetching dossiers', error);
    }
  };


    const handleSearch = async () => {
        try {
          const result = await getDossierSearch(nom, service);
          setDossiers({
            actifs: result.filter(dossier => dossier.InfoPro.etat_depart === 'Actif'),
            retireesDecedes: result.filter(dossier => dossier.InfoPro.etat_depart === 'Retraite' || dossier.InfoPro.etat_depart === 'Décédé'),
            autres: result.filter(dossier => !['Actif', 'Retraite', 'Décédé'].includes(dossier.InfoPro.etat_depart))
          });
        } catch (error) {
            console.error('Error during search:', error);
        }
      }
      const [isMenuOpen, setIsMenuOpen] = useState(true);

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };
      
    
      return (
        
        <div className="dashboard">
          <Head toggleMenu={toggleMenu} />
          <MenuAdminD isMenuOpen={isMenuOpen} />
          <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
          <div className="container d-flex bg-light">
        
        <div className="col-4 m-2">
          <input
            id="nom"
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
          />
        </div>
        <div className="col-4 m-2">
          <input
            id="service"
            type="text"
            className="form-control"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service"
          />
        </div>
        <button onClick={handleSearch} className="vh-10 btn btn-primary">Rechercher</button>
      </div>

       <div className='container-fluid'>
        
          <h1 className="mt-3 mb-3">Dossiers</h1>
          <Link to="/create-dossier" className="btn btn-primary mb-3">Créer un nouveau dossier</Link>
         {/* Liste des dossiers actifs */}
         <h2>Dossiers des Agents Actifs</h2>
          {dossiers.actifs.length > 0 ? (
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.actifs.map(dossier => (
                  <tr key={dossier.id_dossier}>
                    <td>{dossier.matricule}</td>
                    <td>{dossier.InfoIdent.nom}</td>
                    <td>{dossier.InfoIdent.prenom}</td>
                    <td>{dossier.InfoPro.poste_actuel_service}</td>
                    <td>
                      
                      <Link to={`/profileD/${dossier.id_dossier}`} className="btn btn-secondary me-2">Plus</Link>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun agent actif trouvé.</p>
          )}

         

          <h2>Autres Dossiers</h2>
          {dossiers.autres.length > 0 ? (
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.autres.map(dossier => (
                  <tr key={dossier.id_dossier}>
                    <td>{dossier.matricule}</td>
                    <td>{dossier.InfoIdent.nom}</td>
                    <td>{dossier.InfoIdent.prenom}</td>
                    <td>{dossier.InfoPro.poste_actuel_service}</td>
                    <td>
                     
                      <Link to={`/profileD/${dossier.id_dossier}`} className="btn btn-secondary me-2">Plus</Link>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun autre agent trouvé.</p>
          )}

<h2>Dossiers des Agents Retraités ou Décédés</h2>
          {dossiers.retireesDecedes.length > 0 ? (
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.retireesDecedes.map(dossier => (
                  <tr key={dossier.id_dossier}>
                    <td>{dossier.matricule}</td>
                    <td>{dossier.InfoIdent.nom}</td>
                    <td>{dossier.InfoIdent.prenom}</td>
                    <td>{dossier.InfoPro.poste_actuel_service}</td>
                    <td>
                     
                      <Link to={`/profileD/${dossier.id_dossier}`} className="btn btn-secondary me-2">Plus</Link>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun agent retraité ou décédé trouvé.</p>
          )}
      
      </div>
          </main>
          <Footer/>
        </div>
       
      );
          
          
};

export default DossierListD;
