import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DossierList from './components/DossierComponents/DossierList';
import CreateDossier from './components/DossierComponents/CreateDossier';
import EditDossier from './components/DossierComponents/EditDossier';
import DashbordAdmin from './components/DashbordAdmin';
import UtilisateurList from './components/UtilisateurComponents/UtilisateurList';
import EditUtilisateur from './components/UtilisateurComponents/EditUtilisateur';
import RegisterUtilisateur from './components/UtilisateurComponents/RegisterUtilisateur';
import LoginUtilisateur from './components/UtilisateurComponents/LoginUtilisateur';
import DashboardUser from './components/DashbordUser';
import Monprofile from './components/Monprofile';
import Profile from './components/DossierComponents/Profile';
import CongeList from './components/CongeComponents/CongeList';
import CreateConge from './components/CongeComponents/CreateConge';
import GererDemande from './components/CongeComponents/DecisionChef';
import Notification from './components/Notification';
import EditDossierUser from './components/DossierComponents/EditDossierUser';
import Notif from './components/Notif';
import Notifs from './components/Notifs';
import Documents from './components/Documents';
import DashboardChefService from './components/DashbordChefService';
import DashboardDirectrice from './components/DashbordDirectrice';
import RegisterAdmin from './components/UtilisateurComponents/RegisterAdmin';
import DecisionChef from './components/CongeComponents/DecisionChef';
import DecisionDirectrice from './components/CongeComponents/DecisionDirectrice';
import MonprofileC from './components/MonprofileC';
import CreateCongeC from './components/CongeComponents/CreateCongeC';
import CongeListC from './components/CongeComponents/CongeListC';
import NotifC from './components/NotifsC';
import CongeListD from './components/CongeComponents/CongeListD';
import DossierListD from './components/DossierComponents/DossierListD';
import UtilisateurListD from './components/UtilisateurComponents/UtilisateurListD';
import NotifsD from './components/NotifsD';
import ProfileD from './components/DossierComponents/ProfileD';
import ChangeEtat from './components/DossierComponents/GererEtat';
import ListeDemandes from './components/CongeComponents/ListeDemande';
import CongeListDt from './components/CongeComponents/CongesListDt';
import MutationForm from './components/DossierComponents/MutationForm';
import DetachementForm from './components/DossierComponents/DetachementForm';
import MiseEnDisponibilité from './components/DossierComponents/MiseEnDisponibilité';
import MiseADisposition from './components/DossierComponents/MiseADisposition';

import ProtectedRoute from './components/ProtectRoutes'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-dashbord" element={
            <ProtectedRoute><DashbordAdmin /></ProtectedRoute>} /> 
        <Route path="/user-dashbord" element={  <ProtectedRoute><DashboardUser /></ProtectedRoute>} /> 
        <Route path="/chef-service-dashbord" element={  <ProtectedRoute><DashboardChefService/></ProtectedRoute>} /> 
        <Route path="/directrice-dashbord" element={  <ProtectedRoute><DashboardDirectrice /></ProtectedRoute>} /> 
        <Route path="/create-dossier" element={  <ProtectedRoute><CreateDossier /></ProtectedRoute>} />
        <Route path="/edit-dossier/:id" element={  <ProtectedRoute><EditDossier /></ProtectedRoute>} />
        <Route path="/edit-dossier-user/:id" element={  <ProtectedRoute><EditDossierUser /></ProtectedRoute>} />
        <Route path="/create-conge" element={  <ProtectedRoute><CreateConge /></ProtectedRoute>} />
        <Route path="/create-conge-chef" element={  <ProtectedRoute><CreateCongeC /></ProtectedRoute>} />
        <Route path="/manage-demande/:id_cong" element={  <ProtectedRoute><DecisionChef /></ProtectedRoute>} />
        <Route path="/directrice-demande/:id_cong" element={  <ProtectedRoute><DecisionDirectrice/></ProtectedRoute>} />
        <Route path="/decision-directrice" element={  <ProtectedRoute><DecisionDirectrice /></ProtectedRoute>} />
        <Route path="/dossier-list" element={  <ProtectedRoute><DossierList /></ProtectedRoute>} />
        <Route path="/dossier-list-directrice" element={  <ProtectedRoute><DossierListD /></ProtectedRoute>} />
        <Route path="/conge-list" element={  <ProtectedRoute><CongeList /></ProtectedRoute>} />
        <Route path="/conge-liste" element={  <ProtectedRoute><ListeDemandes /></ProtectedRoute>} />
        <Route path="/conge-list-chef" element={  <ProtectedRoute><CongeListC /></ProtectedRoute>} />
        <Route path="/conge-list-directrice" element={  <ProtectedRoute><CongeListD /></ProtectedRoute>} />
        <Route path="/conge-list-directriceg" element={  <ProtectedRoute><CongeListDt/></ProtectedRoute>} />
        <Route path="/gerer-demande" element={  <ProtectedRoute><GererDemande /></ProtectedRoute>} />
        <Route path="/utilisateur-list" element={  <ProtectedRoute><UtilisateurList /></ProtectedRoute>} />
        <Route path="/utilisateur-list-directrice" element={  <ProtectedRoute><UtilisateurListD /></ProtectedRoute>} />
        <Route path="/edit-utilisateur/:id" element={  <ProtectedRoute><EditUtilisateur /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterUtilisateur/>} />
        <Route path="/register_admin" element={<RegisterAdmin/>} />
        <Route path="/login" element={<LoginUtilisateur/>} />
        <Route path="/mon-profile" element={  <ProtectedRoute><Monprofile/></ProtectedRoute>} />
        <Route path="/mon-profile-chef" element={  <ProtectedRoute><MonprofileC/></ProtectedRoute>} />
        <Route path="/profile/:id" element={  <ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/profileD/:id" element={  <ProtectedRoute><ProfileD/></ProtectedRoute>} />
        <Route path="/" element={<LoginUtilisateur/>} />
        <Route path="/notification" element={  <ProtectedRoute><Notification/></ProtectedRoute>} />
        <Route path="/notifs" element={  <ProtectedRoute><Notif/></ProtectedRoute>} />
        <Route path="/mutation-form/:matricule" element={  <ProtectedRoute><MutationForm/></ProtectedRoute>} />
        <Route path="/detachement-form/:matricule" element={  <ProtectedRoute><DetachementForm/></ProtectedRoute>} />
        <Route path="/mise-en-disponibilite-form/:matricule" element={  <ProtectedRoute><MiseEnDisponibilité/></ProtectedRoute>} />
        <Route path="/mise-a-disposition-form/:matricule" element={  <ProtectedRoute><MiseADisposition/></ProtectedRoute>} />
        <Route path="/notifs-chef" element={  <ProtectedRoute><NotifC/></ProtectedRoute>} />
        <Route path="/notifs_admin" element={  <ProtectedRoute><Notifs/></ProtectedRoute>} />
        <Route path="/notifs-directrice" element={  <ProtectedRoute><NotifsD/></ProtectedRoute>} />
        <Route path="/documents" element={  <ProtectedRoute><Documents/></ProtectedRoute>} />
        <Route path="/profile/gerer-etat/:id_dossier" element={  <ProtectedRoute><ChangeEtat/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

