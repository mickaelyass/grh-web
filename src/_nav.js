import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAccountLogout,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDoor,
  cilDrop,
  cilFolder,
  cilList,
  cilLockLocked,
  cilMenu,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'ADMIN',
    },
  },
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
    name: 'Creation dossier',
    to: '/admin/create-dossier',
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Liste des dossiers ',
    to: '/admin/dossier-list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Listes des utilisateurs',
    to: '/admin/utilisateur-list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Demandes de congés',
    to: '/admin/conge-liste',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
   /*  {
      component: CNavItem,
      name: 'Liste complet de presence ',
      to: '/admin/liste-presence',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    }, */
    
    {
      component: CNavItem,
      name: "Liste Fiche d'évaluation  ",
      to: '/admin/liste-evaluation',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
/*   {
    component: CNavItem,
    name: 'Notifications',
    to: '/admin/notifs-admin',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  }, */

  {
    component: CNavTitle,
    name: 'Extras',
  },
 /* {
  component: CNavItem,
  name: 'Login',
  to: '/login',
  icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
},
 {
  component: CNavItem,
  name: 'Register',
  to: '/admin/register',
  icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
}, */
{
  component: CNavItem,
  name: 'Register Particulier',
  to: '/admin/register-admin',
  icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
},
     
]


export default _nav
