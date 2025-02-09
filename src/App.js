import React, { Suspense, useEffect } from 'react'
//import { Router, Route, Routes } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import ProtectedRoute from './views/comp/ProtectRoutes'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const DefaultLayoutU = React.lazy(() => import('./layout/DefaultLayoutU'))
const DefaultLayoutC = React.lazy(() => import('./layout/DefaultLayoutC'))
const DirectriceLayout = React.lazy(() => import('./layout/DirectriceLayout'))
const GardientLayout = React.lazy(() => import('./layout/GardienLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const RegisterA = React.lazy(() => import('./views/pages/register/RegisterA'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Forget_password= React.lazy(() => import('./views/pages/password/ForgetPassword'))
const ResetPassword= React.lazy(() => import('./views/pages/password/ResetPassword'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route path="/register" name="Register Page" element={<Register />} />
          <Route path="/register-admin" name="Register_admin Page" element={<RegisterA />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/forget_password" name="Mot de passe oublié" element={<Forget_password />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/admin/*" name="Admin" element={<ProtectedRoute roleRequired="admin"><DefaultLayout /></ProtectedRoute>} />
      <Route path="/user/*" name="User" element={<ProtectedRoute roleRequired="user"><DefaultLayoutU /></ProtectedRoute>} />
      <Route path="/securite/*" name="Securite" element={<ProtectedRoute roleRequired="securite"><GardientLayout /></ProtectedRoute>} />
      <Route path="/chef-service/*" name="User" element={<ProtectedRoute roleRequired="chef_service"><DefaultLayoutC /></ProtectedRoute>} />
      <Route path="/directrice/*" name="Directrice" element={<ProtectedRoute roleRequired="directrice"><DirectriceLayout /></ProtectedRoute>} />
          <Route path="/" name="Login Page" element={<Login />} />

        {/*les dashbords*/}

        {/*les menus*/}

        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
