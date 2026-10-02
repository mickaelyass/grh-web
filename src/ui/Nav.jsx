import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import Icon from './Icon'
import { ChevronDown } from './icons'

// ---------------------------------------------------------------------------
//  Nav — the sidebar menu vocabulary.
//    <Nav>
//      <NavTitle>Personnel</NavTitle>
//      <NavItem to="/admin/dossier-list" icon={Folder}>Dossiers</NavItem>
//      <NavGroup name="Validation" icon={Clipboard} items={[…]} />
//    </Nav>
//
//  `NavItem` is a router link (it marks itself active from the URL), which is
//  why the menu no longer needs to track the location by hand.
// ---------------------------------------------------------------------------
export const Nav = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['nav', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

Nav.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

/** Uppercase section label ("Personnel", "Administration"…). */
export const NavTitle = ({ children, className = '', ...rest }) => (
  <div className={['nav-title', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

NavTitle.propTypes = { children: PropTypes.node, className: PropTypes.string }

/** Single menu entry. `badge` renders a counter on the trailing edge. */
export const NavItem = ({
  children,
  className = '',
  icon,
  badge,
  active: activeProp,
  disabled = false,
  to,
  href,
  as,
  ...rest
}) => {
  const classes = ['nav-link', 'gp-nav-link', disabled ? 'disabled' : null, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon ? <span className="nav-icon">{icon}</span> : null}
      <span className="gp-nav-link__label">{children}</span>
      {badge ? (
        <span className={`gp-nav-link__badge gp-soft-${badge.color || 'primary'}`}>{badge.text}</span>
      ) : null}
    </>
  )

  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) => [classes, isActive || activeProp ? 'active' : null].filter(Boolean).join(' ')}
        aria-current={activeProp ? 'page' : undefined}
        {...rest}
      >
        {content}
      </NavLink>
    )
  }

  if (href || as) {
    const Component = as || 'a'
    return (
      <Component
        href={href}
        className={[classes, activeProp ? 'active' : null].filter(Boolean).join(' ')}
        aria-current={activeProp ? 'page' : undefined}
        {...rest}
      >
        {content}
      </Component>
    )
  }

  return (
    <button
      type="button"
      className={[classes, activeProp ? 'active' : null].filter(Boolean).join(' ')}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  )
}

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  badge: PropTypes.shape({ text: PropTypes.node, color: PropTypes.string }),
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  to: PropTypes.string,
  href: PropTypes.string,
  as: PropTypes.elementType,
}

/** Collapsible group of `NavItem`s. */
export const NavGroup = ({ name, icon, items = [], defaultOpen = false, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen)
  const toggleId = `nav-group-${name}`.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className={className}>
      <button
        type="button"
        id={toggleId}
        className="nav-link nav-group-toggle"
        aria-expanded={open}
        aria-controls={`${toggleId}-items`}
        onClick={() => setOpen((value) => !value)}
      >
        {icon ? <span className="nav-icon">{icon}</span> : null}
        <span className="gp-nav-link__label">{name}</span>
        <span className="nav-group-toggle__chevron" aria-hidden="true">
          <Icon icon={ChevronDown} />
        </span>
      </button>

      <div id={`${toggleId}-items`} className="nav-group-items" hidden={!open}>
        {items.map((item) => (
          <NavItem
            key={item.to || item.name}
            to={item.to}
            icon={item.icon ? <span className="nav-icon-bullet" /> : null}
          >
            {item.name}
          </NavItem>
        ))}
      </div>
    </div>
  )
}

NavGroup.propTypes = {
  name: PropTypes.node.isRequired,
  icon: PropTypes.node,
  items: PropTypes.array,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
}

export { Link }
export default Nav