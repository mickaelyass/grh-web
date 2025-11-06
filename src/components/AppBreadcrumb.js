import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { match } from 'path-to-regexp'
import adminRoutes from '../AdminRoute'
import serviceRoutes from '../ChefRoute'
import directriceRoutes from '../DirectriceRoute'
import securiteRoutes from '../SecuriteRoute'

// etc...


const routeFiles = {
  '/admin': adminRoutes,
  '/chef-service': serviceRoutes,
  '/directrice': directriceRoutes,
  '/securite': securiteRoutes,
  // etc
}

const AppBreadcrumb = () => {
  const location = useLocation()
  const pathname = location.pathname

  // Trouver les routes selon le préfixe de chemin
  const routePrefix = Object.keys(routeFiles).find(prefix =>
    pathname.startsWith(prefix)
  ) || ''

  const routes = routeFiles[routePrefix] || []

  // Fonction pour trouver le nom de route avec params
  const findRouteName = (path) => {
    for (const route of routes) {
      try {
        const matcher = match(route.path, { decode: decodeURIComponent })
        if (matcher(path)) return route.name
      } catch {
        // ignore erreur
      }
    }
    return null
  }

  // Construire la breadcrumb
  const parts = pathname.split('/').filter(Boolean)
  let cumulative = ''
  const breadcrumbs = parts.map((part, idx) => {
    cumulative += '/' + part
    let name = findRouteName(cumulative)
    if (!name) {
      // Si pas trouvé dans routes, capitaliser le segment
      name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
    }
    return {
      path: cumulative,
      name,
      active: idx === parts.length -1,
    }
  })

  return (
    <CBreadcrumb className="my-0  ">
      <CBreadcrumbItem><Link to={routePrefix ? `${routePrefix}/dashboard` : '/'}>Home</Link></CBreadcrumbItem>
      {breadcrumbs.map(({ path, name, active }, i) =>
        active ? (
          <CBreadcrumbItem active key={i}>{name}</CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem key={i}><Link to={path}>{name}</Link></CBreadcrumbItem>
        )
      )}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
