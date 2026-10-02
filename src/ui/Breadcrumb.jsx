import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Breadcrumb — "Accueil / Dossiers / Détail".
//    <Breadcrumb>
//      <BreadcrumbItem><Link to="/admin">Accueil</Link></BreadcrumbItem>
//      <BreadcrumbItem active>Dossiers</BreadcrumbItem>
//    </Breadcrumb>
// ---------------------------------------------------------------------------
export const Breadcrumb = ({ children, className = '', label = "Fil d'Ariane", ...rest }) => (
  <nav aria-label={label} className={className} {...rest}>
    <ol className="breadcrumb">{children}</ol>
  </nav>
)

Breadcrumb.propTypes = { children: PropTypes.node, className: PropTypes.string, label: PropTypes.string }

export const BreadcrumbItem = ({ children, className = '', active = false, ...rest }) => (
  <li
    className={['breadcrumb-item', active ? 'active' : null, className].filter(Boolean).join(' ')}
    aria-current={active ? 'page' : undefined}
    {...rest}
  >
    {children}
  </li>
)

BreadcrumbItem.propTypes = { children: PropTypes.node, className: PropTypes.string, active: PropTypes.bool }

export default Breadcrumb