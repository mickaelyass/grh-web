import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { getRoleConfig } from '../config/roles'
import { getStoredUser, isAuthenticated } from '../utils/auth'

// ---------------------------------------------------------------------------
//  RequireRole — route guard of a role workspace.
//
//  An anonymous visitor goes to the login screen. An authenticated user who
//  opens another workspace (bookmark, manual URL) is redirected to HIS
//  dashboard instead of the old, non-existent `/access-denied` page.
// ---------------------------------------------------------------------------
const RequireRole = ({ role, children }) => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const user = getStoredUser()
  if (user && role && user.role !== role) {
    return <Navigate to={getRoleConfig(user.role).homePath} replace />
  }

  return children
}

RequireRole.propTypes = {
  role: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default RequireRole
