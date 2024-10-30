import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import AdminRoute from '../AdminRoute'
import UserRoute from '../UserRoute'
import DirectriceRoute from '../DirectriceRoute'
import ChefRoute from '../ChefRoute'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* Routes pour Admin */}
          {AdminRoute.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact} // Note: `exact` est optionnel dans React Router v6
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

          {/* Routes pour User */}
          {UserRoute.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact} // Note: `exact` est optionnel dans React Router v6
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

            {/* Routes pour Chef */}
            {ChefRoute.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact} // Note: `exact` est optionnel dans React Router v6
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

           {/* Routes pour Directrice */}
           {DirectriceRoute.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact} // Note: `exact` est optionnel dans React Router v6
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

          {/* Redirection par défaut */}

         {/* Redirection par défaut */}
       {/*  <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />  */}

        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)