import { Alert } from '../../../ui/Alert'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Col, Container, Row } from '../../../ui/Grid'
import { ListGroup, ListGroupItem } from '../../../ui/ListGroup'
import { Spinner } from '../../../ui/Spinner'
import React, { useEffect, useState } from 'react';
import { getDossier} from '../../../services/api';
import { useParams} from 'react-router-dom';
import '../Dasbord.css'
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfileD = () => {
 const { id } = useParams();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [dossier, setDossier] = useState(null);
   const [details, setDetails] = useState([]);
   const [showDetails, setShowDetails] = useState(false);
 
   useEffect(() => {
     fetchDossier();
   }, [id]);
 
   const fetchDossier = async () => {
     try {
       const response = await getDossier(id);
       setDossier(response.data);
     } catch (error) {
       setError(error.message);
     } finally {
       setLoading(false);
     }
   };
 
   const fetchDetails = () => {
     setDetails(dossier?.InfoPro?.Details || []);
     setShowDetails(true);
   };
 
   const formatDate = (dateString) => {
     try {
       return format(new Date(dateString), 'eeee dd MMMM yyyy', { locale: fr });
     } catch {
       return 'Date invalide';
     }
   };
 
   const renderField = (label, value, isBadge = false) => {
     if (!value) return null;
     return (
       <ListGroupItem>
         <strong>{label}:</strong> {isBadge ? <Badge color="info">{value}</Badge> : value}
       </ListGroupItem>
     );
   };
 
   if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;
   if (error) return <Alert color="danger" className="text-center mt-5">{error}</Alert>;
   if (!dossier) return <Alert color="info" className="text-center mt-5">Aucun dossier trouvé.</Alert>;
 
   return (
     <Container fluid className="py-4">
       <Row>
         <Col xs={12}>
           <Card className="shadow">
             <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
               <h2 className="mb-2">
                 Profil de {dossier.InfoIdent.prenom} {dossier.InfoIdent.nom}
               </h2>
               <Button color="info" onClick={fetchDetails}>Voir le parcours</Button>
             </CardHeader>
             <CardBody>
               <Row>
                 <Col xs={12} md={6}>
                   <h5 className="text-primary">Utilisateur</h5>
                   <ListGroup>
                     {renderField('Matricule', dossier.Utilisateur.matricule)}
                     {renderField('Role', dossier.Utilisateur.role, true)}
                   </ListGroup>
 
                   <h5 className="text-primary mt-4">Informations Bancaires</h5>
                   <ListGroup>
                     {renderField('RIB', dossier.InfoBank.rib)}
                     {renderField('MTN', dossier.InfoBank.mtn)}
                     {renderField('Celtics', dossier.InfoBank.celtics)}
                     {renderField('Libercom', dossier.InfoBank.libercom)}
                   </ListGroup>
 
                   <h5 className="text-primary mt-4">Informations Complémentaires</h5>
                   <ListGroup>
                     {renderField('Observation particulière', dossier.InfoComplementaire.observation_particuliere)}
                     {renderField('Détail distinction', dossier.InfoComplementaire.detail_distinction)}
                     {renderField('Situation santé', dossier.InfoComplementaire.situat_sante)}
                     {renderField('Sanction punitive', dossier.InfoComplementaire.saction_punitive)}
                   </ListGroup>
                 </Col>
 
                 <Col xs={12} md={6}>
                   <h5 className="text-primary">Informations Identitaires</h5>
                   <ListGroup>
                     {renderField('CNSS', dossier.InfoIdent.cnss)}
                     {renderField('Nom du conjoint', dossier.InfoIdent.nom_du_conjoint)}
                     {renderField('Sexe', dossier.InfoIdent.sexe)}
                     {renderField('Date de naissance', formatDate(dossier.InfoIdent.dat_nat))}
                     {renderField('Lieu de naissance', dossier.InfoIdent.lieu_nat)}
                     {renderField('Situation matrimoniale', dossier.InfoIdent.situat_matri)}
                     {renderField('Email', dossier.InfoIdent.email)}
                     {renderField('Date de mariage', formatDate(dossier.InfoIdent.dat_mariage))}
                     {renderField("Nombre d'enfants", dossier.InfoIdent.nbre_enfants)}
                   </ListGroup>
 
                   <h5 className="text-primary mt-4">Informations Professionnelles</h5>
                   <ListGroup>
                     {renderField('Statut', dossier.InfoPro.statut)}
                     {renderField('Date prise de fonction', formatDate(dossier.InfoPro.dat_prise_fonction))}
                     {renderField('Date de départ en retraite', formatDate(dossier.InfoPro.dat_de_depart_retraite))}
                     {renderField('Date de prise de service dans le département', formatDate(dossier.InfoPro.dat_de_prise_service_dans_departement))}
                     {renderField('Date première prise de service', formatDate(dossier.InfoPro.dat_first_prise_de_service))}
                   </ListGroup>
                 </Col>
               </Row>
             </CardBody>
           </Card>
         </Col>
       </Row>
 
       {showDetails && (
         <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
           <div className="modal-dialog modal-lg modal-dialog-centered">
             <div className="modal-content">
               <div className="modal-header">
                 <h5 className="modal-title">Parcours de l'agent</h5>
                 <button type="button" className="btn-close" onClick={() => setShowDetails(false)}></button>
               </div>
               <div className="modal-body">
                 {details.length > 0 ? (
                   <ul className="list-group">
                     {details.map((detail) => (
                       <li key={detail.id_detail} className="list-group-item">
                         <p><strong>État :</strong> {detail.etat}</p>
                         <p><strong>Poste actuel :</strong> {detail.poste_actuel}</p>
                         <p><strong>Service actuel :</strong> {detail.service_actuel}</p>
                         <p><strong>Nouveau poste :</strong> {detail.nouveau_poste}</p>
                         <p><strong>Motif :</strong> {detail.motif_changement}</p>
                         <p><strong>Date changement :</strong> {formatDate(detail.date_changement)}</p>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-center">Aucun détail trouvé pour cet agent.</p>
                 )}
               </div>
               <div className="modal-footer">
                 <Button color="secondary" onClick={() => setShowDetails(false)}>Fermer</Button>
               </div>
             </div>
           </div>
         </div>
       )}
     </Container>
   
  );

};

export default ProfileD;
