import React from 'react'

const DirectriceNotification = React.lazy(() => import('./views/comp/NotifsD.js'))
const DashboardAdmin = React.lazy(() => import('./views/comp/DashbordAdmin.js'))
const DossierListD = React.lazy(() => import('./views/comp/DossierComponents/DossierListD.js'))
const ListeDemandeDA = React.lazy(() => import('./views/comp/CongeComponents/CongesListDt.js'))
const ListeDemandeDG = React.lazy(() => import('./views/comp/CongeComponents/CongeListD.js'))
const ProfileD = React.lazy(() => import('./views/comp/DossierComponents/ProfileD.js'))
const CreateDossier = React.lazy(() => import('./views/comp/DossierComponents/CreateDossier'))
const EditDossier = React.lazy(() => import('./views/comp/DossierComponents/EditDossier'))
const EditUtilisateur = React.lazy(() => import('./views/comp/UtilisateurComponents/EditUtilisateur.js'))
const GererEtat = React.lazy(() => import('./views/comp/DossierComponents/GererEtat.js'))
const UtilisateurListD = React.lazy(() => import('./views/comp/UtilisateurComponents/UtilisateurListD.js'))
const DecisionDirectrice = React.lazy(() => import('./views/comp/CongeComponents/DecisionDirectrice.js'))


const MutationForm = React.lazy(() => import('./views/comp/DossierComponents/MutationForm'))
const DetachementForm = React.lazy(() => import('./views/comp/DossierComponents/DetachementForm'))
const MiseEnDisponibilité = React.lazy(() => import('./views/comp//DossierComponents/MiseEnDisponibilité'))
const MiseADisposition = React.lazy(() => import('./views/comp/DossierComponents/MiseADisposition'))
//import Dashboard from './views/dashboard/Dashboard'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const FicheEvaluationComitte = React.lazy(() => import('./views/comp/FicheEvaluationComitte.js'))
const ListeEvaluationsd = React.lazy(() => import('./views/comp/ListeEvaluation.js'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/directrice/*', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: DashboardAdmin },
  { path: '/liste-evaluationd', name: 'liste  des evaluation des agents', element: ListeEvaluationsd, exact: true },
  { path: '/evaluations/editCommitte/:id', name: 'apprecier la fiche commite', element: FicheEvaluationComitte, exact: true },

  //dossier list
  { path: '/notifs-directrice', name: "Notifications de la directrice", element: DirectriceNotification, exact: true },
  { path: '/gestion-conges/deja-gerer', name: 'Liste de demande de conge', element: ListeDemandeDG, exact: true },
  { path: '/gestion-conges/en-attente', name: 'Liste de demande de conge', element: ListeDemandeDA, exact: true },
  { path: '/dossier-list-directrice', name: 'Liste des dossiers ', element: DossierListD, exact: true },
  { path: '/create-dossier', name: 'Créer un nouveau dossier', element: CreateDossier, exact: true },
  { path: '/edit-dossier/:id', name: 'Editer un dossier', element: EditDossier, exact: true },
  { path: '/profile/gerer-etat/:id_dossier', name: 'Changer Etat', element: GererEtat, exact: true },
  { path: '/mutation-form/:matricule', name: 'Formulaire de Mutation', element: MutationForm, exact: true },
  { path: '/detachement-form/:matricule', name: 'Formulaire de Détachement', element: DetachementForm, exact: true },
  { path: '/mise-en-disponibilite-form/:matricule', name: 'Formulaire de Mise en Disponibilité', element: MiseEnDisponibilité, exact: true },
  { path: '/mise-a-disposition-form/:matricule', name: 'Formulaire de Mise à Disposition', element: MiseADisposition, exact: true },
  { path: '/utilisateur-list-directrice', name: 'Liste des utilisateurs d', element: UtilisateurListD, exact: true },
 
  { path: '/directrice-demande/:id_cong', name: 'Editer un utilisateur', element: DecisionDirectrice, exact: true },

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/profileD/:id', name: 'Mon profile', element: ProfileD, exact: true },
  
]

export default routes
