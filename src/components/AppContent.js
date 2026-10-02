import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from '../ui/Grid'
import Spinner from '../ui/Spinner'
import { routesForRole } from '../config/routes'
import { getCurrentRole } from '../utils/auth'
import Page404 from '../views/pages/page404/Page404'

// ---------------------------------------------------------------------------
//  AppContent — renders the screens of the signed-in role.
//
//  Before: five arrays were concatenated in a single <Routes>, so every role
//  declared `/dashboard` and the first match (admin) won for everyone.
//  Now only the routes of the current role workspace are mounted.
// ---------------------------------------------------------------------------
const AppContent = () => {
  const routes = routesForRole(getCurrentRole())

  return (
    <Container className="gp-page">
      <Suspense
        fallback={
          <div className="gp-loading" role="status" aria-live="polite">
            <Spinner color="primary" />
            <span>Chargement de la page…</span>
          </div>
        }
      >
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Container>
  )
}

export default React.memo(AppContent)
