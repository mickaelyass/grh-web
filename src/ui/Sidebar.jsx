import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
//  Sidebar — the fixed navigation rail of the application shell.
//
//  It owns the responsive behaviour the CoreUI `<CSidebar>` used to provide:
//    - `visible` false  → the rail becomes an off-canvas drawer (mobile)
//    - `unfoldable`     → collapsed to icons only (desktop)
//    - `onVisibleChange`/scrim → the drawer can be dismissed by tapping outside
//
//  The visual layer lives in `_layout.scss` (`.gp-shell*`) so the rail follows
//  the light/dark tokens automatically.
// ---------------------------------------------------------------------------
const Sidebar = ({
  children,
  className = '',
  unfoldable = false,
  visible = false,
  onVisibleChange,
  ...rest
}) => (
  <>
    <aside
      className={['gp-shell__sidebar', className].filter(Boolean).join(' ')}
      aria-label="Navigation principale"
      {...rest}
    >
      {children}
    </aside>

    {/* Tap-outside scrim, only meaningful while the drawer is open. */}
    {visible ? (
      <button
        type="button"
        className="gp-shell__scrim"
        aria-label="Fermer le menu"
        onClick={() => onVisibleChange?.(false)}
      />
    ) : null}
  </>
)

Sidebar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  unfoldable: PropTypes.bool,
  visible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
}

export const SidebarHeader = ({ children, className = '', ...rest }) => (
  <div className={['gp-sidebar__header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

SidebarHeader.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const SidebarBrand = ({ children, className = '', to, href, ...rest }) => {
  if (to) {
    return (
      <Link to={to} className={['gp-sidebar__brand', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={['gp-sidebar__brand', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <div className={['gp-sidebar__brand', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}

SidebarBrand.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
}

export const SidebarNav = ({ children, className = '', ...rest }) => (
  <nav className={['gp-sidebar__nav', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </nav>
)

SidebarNav.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const SidebarFooter = ({ children, className = '', ...rest }) => (
  <div className={['gp-sidebar__footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

SidebarFooter.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const SidebarToggler = ({ children, className = '', label = 'Replier le menu', ...rest }) => (
  <button
    type="button"
    className={['gp-sidebar__collapse', className].filter(Boolean).join(' ')}
    title={label}
    {...rest}
  >
    {children}
    <span className="gp-sidebar__collapse-label">{label}</span>
  </button>
)

SidebarToggler.propTypes = { children: PropTypes.node, className: PropTypes.string, label: PropTypes.string }

export default Sidebar