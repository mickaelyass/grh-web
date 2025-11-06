import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilUser,
  cilCalculator,
  cilPaperPlane,
  cilLockLocked,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navU = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/user/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'USER',
    },
  },
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
    name: 'Mon profile',
    to: '/user/mon-profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mon evaluation',
    to: '/user/evaluation',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Soumettre Congés',
    to: '/user/create-conge',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },

 /*  {
    component: CNavItem,
    name: 'Notifications',
    to: '/user/notifs',
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
}, */
]

export default _navU
