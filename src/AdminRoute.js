import React from 'react'

const Register = React.lazy(() => import('./views/pages/register/Register'))
const RegisterA = React.lazy(() => import('./views/pages/register/RegisterA'))
const AdminNotification = React.lazy(() => import('./views/comp/Notifs.js'))
const DashboardAdmin = React.lazy(() => import('./views/comp/DashbordAdmin.js'))
const DossierList = React.lazy(() => import('./views/comp/DossierComponents/DossierList'))
const ListePresences = React.lazy(() => import('./views/comp/ListePresence'))
const ListeEvaluations = React.lazy(() => import('./views/comp/ListeEvaluationA.js'))
const ListeDemande = React.lazy(() => import('./views/comp/CongeComponents/ListeDemande'))
const Profile = React.lazy(() => import('./views/comp/DossierComponents/Profile'))
const CreateDossier = React.lazy(() => import('./views/comp/DossierComponents/CreateDossier'))
const EditDossier = React.lazy(() => import('./views/comp/DossierComponents/EditDossier'))
const EditUtilisateur = React.lazy(() => import('./views/comp/UtilisateurComponents/EditUtilisateur.js'))
const GererEtat = React.lazy(() => import('./views/comp/DossierComponents/GererEtat.js'))
const  UtilisateurList = React.lazy(() => import('./views/comp/UtilisateurComponents/UtilisateurList.js'))

const MutationForm = React.lazy(() => import('./views/comp/DossierComponents/MutationForm'))
const DetachementForm = React.lazy(() => import('./views/comp/DossierComponents/DetachementForm'))
const MiseEnDisponibilité = React.lazy(() => import('./views/comp//DossierComponents/MiseEnDisponibilité'))
const MiseADisposition = React.lazy(() => import('./views/comp/DossierComponents/MiseADisposition'))
//import Dashboard from './views/dashboard/Dashboard'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base






const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/admin/*', exact: true, name: 'Home'},
  { path: '/dashboard', name: 'Dashboard', element: DashboardAdmin },

  //dossier list
  { path: '/liste-presence', name: 'liste complet  de presence ', element: ListePresences, exact: true },
  { path: '/liste-evaluation', name: 'liste complet  des evaluations', element: ListeEvaluations, exact: true },
  { path: '/notifs-admin', name: "Notifications de l'admin", element: AdminNotification, exact: true },
  { path: '/Conge-liste', name: 'Liste de demande de conge', element: ListeDemande, exact: true },
  { path: '/dossier-list', name: 'Liste des dossiers', element: DossierList, exact: true },
  { path: '/create-dossier', name: 'Créer un nouveau dossier', element: CreateDossier, exact: true },
  { path: '/edit-dossier/:id_dossier', name: 'Editer un dossier', element: EditDossier, exact: true },
  { path: '/profile/gerer-etat/:id_dossier', name: 'Changer Etat', element: GererEtat, exact: true },
  { path: '/mutation-form/:matricule', name: 'Formulaire de Mutation', element: MutationForm, exact: true },
  { path: '/detachement-form/:matricule', name: 'Formulaire de Détachement', element: DetachementForm, exact: true },
  { path: '/mise-en-disponibilite-form/:matricule', name: 'Formulaire de Mise en Disponibilité', element: MiseEnDisponibilité, exact: true },
  { path: '/mise-a-disposition-form/:matricule', name: 'Formulaire de Mise à Disposition', element: MiseADisposition, exact: true },
  { path: '/utilisateur-list', name: 'Liste des utilisateurs', element: UtilisateurList, exact: true },
  { path: '/edit-utilisateur/:id', name: 'Editer un utilisateur', element: EditUtilisateur, exact: true },
  { path: '/profile/:id', name: 'Mon profile', element: Profile, exact: true },
  { path: '/register', name: 'Liste des utilisateurs', element: Register, exact: true },
  { path: '/register-admin', name: 'Editer un utilisateur', element: RegisterA, exact: true },

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  
  { path: '/theme/typography', name: 'Typography', element: Typography },


]

export default routes
