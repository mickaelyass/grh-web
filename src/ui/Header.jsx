import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Header — the sticky top bar of the application shell.
//    <Header>
//      <HeaderBar>
//        <HeaderToggler onClick={…} aria-label="Menu" />
//        <HeaderActions>…</HeaderActions>
//      </HeaderBar>
//    </Header>
//
//  A plain element wrapper: the sticky positioning, the frosted background and
//  the height all come from `.gp-header` in `_app.scss`, so the bar follows the
//  active theme without any inline styling.
// ---------------------------------------------------------------------------
export const Header = ({ children, className = '', ...rest }) => (
  <header className={['gp-header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </header>
)

Header.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const HeaderBar = ({ children, className = '', ...rest }) => (
  <div className={['gp-header__bar', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

HeaderBar.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const HeaderToggler = ({ children, className = '', ...rest }) => (
  <button
    type="button"
    className={['gp-header__toggler', className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </button>
)

HeaderToggler.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const HeaderActions = ({ children, className = '', ...rest }) => (
  <div className={['gp-header__actions', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

HeaderActions.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const Footer = ({ children, className = '', ...rest }) => (
  <footer className={['gp-footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </footer>
)

Footer.propTypes = { children: PropTypes.node, className: PropTypes.string }

export default Header