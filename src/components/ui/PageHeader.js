import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  PageHeader — the single header used by every screen.
//  Guarantees the same rhythm (icon, title, subtitle, actions) everywhere.
// ---------------------------------------------------------------------------
const PageHeader = ({ icon, title, subtitle, badge, actions, className = '' }) => (
  <header className={`gp-page-header ${className}`.trim()}>
    <div className="gp-page-header__main">
      {icon ? (
        <span className="gp-page-header__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="gp-min-w-0">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <h1 className="gp-page-title">{title}</h1>
          {badge}
        </div>
        {subtitle ? <p className="gp-page-subtitle">{subtitle}</p> : null}
      </div>
    </div>
    {actions ? <div className="gp-page-actions">{actions}</div> : null}
  </header>
)

PageHeader.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  badge: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
}

export default PageHeader
