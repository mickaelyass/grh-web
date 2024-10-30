import React from 'react'
import { AppContent, AppSidebarC, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebarC />
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
