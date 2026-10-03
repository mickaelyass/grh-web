import React, { Suspense } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Spinner from './ui/Spinner'
import './scss/style.scss'
import ConfirmProvider from './components/ui/ConfirmProvider'
import RequireRole from './components/RequireRole'
import { ROLE_IDS, basePathForRole, homePathForRole } from './config/roles'
import { getStoredUser } from './utils/auth'

// Layout (shared by every role workspace)
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Public pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const RegisterA = React.lazy(() => import('./views/pages/register/RegisterA'))
const ForgetPassword = React.lazy(() => import('./views/pages/password/ForgetPassword'))
const ResetPassword = React.lazy(() => import('./views/pages/password/ResetPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// ---------------------------------------------------------------------------
//  App — routing tree
//  ---------------------------------------------------------------------------
//  Public pages first, then one workspace per role. Each workspace is mounted
//  behind <RequireRole>, so a URL can only ever open the screens its role owns.
//  Screens themselves live in `src/config/routes.js`.
// ---------------------------------------------------------------------------
const App = () => {
  const user = getStoredUser()

  return (
    <Router>
      <ConfirmProvider>
        <Suspense
          fallback={
            <div className="gp-loading" role="status" aria-live="polite">
              <Spinner variant="grow" />
              <span>Chargement…</span>
            </div>
          }
        >
          <Routes>
            <Route path="/login" name="Connexion" element={<Login />} />
            <Route path="/register" name="Inscription" element={<Register />} />
            <Route path="/register-admin" name="Inscription administrateur" element={<RegisterA />} />
            <Route path="/forget_password" name="Mot de passe oublie" element={<ForgetPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />

            {ROLE_IDS.map((role) => (
              <Route
                key={role}
                path={`${basePathForRole(role)}/*`}
                element={
                  <RequireRole role={role}>
                    <DefaultLayout />
                  </RequireRole>
                }
              />
            ))}

            <Route
              path="/"
              element={<Navigate to={user ? homePathForRole(user.role) : '/login'} replace />}
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </ConfirmProvider>
    </Router>
  )
}

export default App
