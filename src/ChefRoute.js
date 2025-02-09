import React from 'react'


const MonprofileC = React.lazy(() => import('./views/comp/MonprofileC.js'))
const FicheEvaluationSup = React.lazy(() => import('./views/comp/FicheEvaluationSup.js'))
const CreateCongeC = React.lazy(() => import('./views/comp/CongeComponents/CreateCongeC'))
const ListeDemandeC= React.lazy(() => import('./views/comp/CongeComponents/CongeListC.js'))
const ChefNotifs = React.lazy(() => import('./views/comp/NotifsC.js'))
const DecisionChef = React.lazy(() => import('./views/comp/CongeComponents/DecisionChef.js'))
const ListeEvaluationS = React.lazy(() => import('./views/comp/ListeEvaluationS.js'))
const DashboardAdmin = React.lazy(() => import('./views/comp/DashbordAdmin.js'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const FicheEvaluation = React.lazy(() => import('./views/comp/FicheEvaluation'))



const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/service/*', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: DashboardAdmin },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },

  { path: '/liste-evaluations', name: 'liste  des evaluation des agents', element: ListeEvaluationS, exact: true },
  { path: '/evaluation', name: 'Faire mon evaluation', element: FicheEvaluation, exact: true },
  { path: '/evaluations/edit/:id', name: 'apprecier la fiche', element: FicheEvaluationSup, exact: true },
  { path: '/create-conge-chef', name: 'Faire une demande de congés', element: CreateCongeC, exact: true },
  { path: '/conge-list-chef', name: 'Faire une demande de congés', element: ListeDemandeC, exact: true },
  { path: '/notifs-chef', name: 'Les notifications user', element: ChefNotifs, exact: true },

  { path: '/chef-demande/:id_cong', name: 'Décision chef', element: DecisionChef, exact: true },


  { path: '/mon-profile-chef', name: 'Mon profile', element: MonprofileC, exact: true },
  

]

export default routes
