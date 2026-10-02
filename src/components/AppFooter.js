import React from 'react'
import { Footer } from '../ui/Header'

const AppFooter = () => (
  <Footer>
    <div>
      <strong>GestiPerso</strong>
      <span className="ms-2">Gestion du personnel</span>
    </div>
    <div className="ms-auto">
      <span>Direction des Ressources Humaines &copy; {new Date().getFullYear()}</span>
    </div>
  </Footer>
)

export default React.memo(AppFooter)
