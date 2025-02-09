import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilUser,
  cilCalculator,
  cilPaperPlane,
  cilLockLocked,
  cilSpeedometer,
  cilStar,
  cilAccountLogout,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navG = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/securite/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Securité',
    },
  },
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
    name: 'Mon profile',
    to: '/securite/mon-profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Soumettre Congés',
    to: '/securite/create-conge',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tableau de presence ',
    to: '/securite/create-presence',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Liste complet de presence ',
    to: '/securite/liste-presence',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Notifications',
    to: '/securite/notifs',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  
 
  {
    component: CNavTitle,
    name: 'Extras',
  },
 {
  component: CNavItem,
  name: 'Login',
  to: '/login',
  icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
},
 {
  component: CNavItem,
  name: 'Register',
  to: '/register',
  icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
},
]

export default _navG
