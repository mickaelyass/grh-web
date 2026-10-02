import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from '../ui/Breadcrumb'
import { findRouteMeta } from '../config/routes'
import { homePathForRole } from '../config/roles'

// ---------------------------------------------------------------------------
//  AppBreadcrumb — "Accueil / <nom de la page>".
//  The previous version mixed in a `path-to-regexp` prefix lookup, printed an
//  English "Home" label and could not resolve dynamic segments; it now reads
//  the label straight from the route registry.
// ---------------------------------------------------------------------------
const AppBreadcrumb = () => {
  const { pathname } = useLocation()
  const meta = findRouteMeta(pathname)

  const home = meta?.role ? homePathForRole(meta.role) : '/login'
  const isPersonalSpace = meta?.role === 'user' || meta?.role === 'securite'
  const trail = meta?.name && meta.name !== 'Tableau de bord' ? [meta.name] : []

  if (meta?.name === 'Tableau de bord') return null

  return (
    <Breadcrumb className="gp-breadcrumb my-0">
      <BreadcrumbItem>
        <Link to={home}>{isPersonalSpace ? 'Accueil' : 'Tableau de bord'}</Link>
      </BreadcrumbItem>
      {trail.map((label) => (
        <BreadcrumbItem key={label} active>
          {label}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
