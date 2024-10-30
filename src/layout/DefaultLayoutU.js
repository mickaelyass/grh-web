import React from 'react'
import { AppContent, AppSidebarU, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebarU />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
