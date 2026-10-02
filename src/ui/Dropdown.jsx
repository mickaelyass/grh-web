import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Dropdown — accessible popover menu (no Popper, no Bootstrap JS).
//
//    <Dropdown placement="bottom-end">
//      <DropdownToggle className="gp-icon-btn" aria-label="Notifications">
//        <Bell />
//      </DropdownToggle>
//      <DropdownMenu>
//        <DropdownHeader>Notifications</DropdownHeader>
//        <DropdownItem onClick={…}>Marquer comme lu</DropdownItem>
//        <DropdownDivider />
//      </DropdownMenu>
//    </Dropdown>
//
//  Behaviours: click / Enter / Space toggles, Escape and an outside click
//  close it, focus returns to the toggle on close, `aria-expanded` is kept in
//  sync and the menu is unmounted from the a11y tree when hidden.
// ---------------------------------------------------------------------------
const DropdownContext = createContext({ open: false, toggleId: '', menuId: '', close: () => {} })

const Dropdown = ({ children, className = '', placement = 'bottom-start', direction = 'down' }) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const toggleId = useId()
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])

  // Close on an outside click and on Escape (the menu is not a modal).
  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const value = useMemo(() => ({ open, toggleId, menuId, close, toggle }), [open, toggleId, menuId, close, toggle])

  return (
    <DropdownContext.Provider value={value}>
      <div
        ref={rootRef}
        className={['dropdown', className].filter(Boolean).join(' ')}
        data-placement={direction === 'up' ? 'up' : 'down'}
        data-align={placement.endsWith('end') ? 'end' : 'start'}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  placement: PropTypes.oneOf(['bottom-start', 'bottom-end', 'top-start', 'top-end']),
  direction: PropTypes.oneOf(['up', 'down']),
}

export const DropdownToggle = ({ children, className = '', caret = true, ...rest }) => {
  const { open, toggleId, menuId, toggle } = useContext(DropdownContext)

  return (
    <button
      type="button"
      id={toggleId}
      className={['dropdown-toggle', caret ? null : 'dropdown-toggle--no-caret', className]
        .filter(Boolean)
        .join(' ')}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      onClick={toggle}
      {...rest}
    >
      {children}
    </button>
  )
}

DropdownToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  caret: PropTypes.bool,
}

export const DropdownMenu = ({ children, className = '', ...rest }) => {
  const { open, menuId } = useContext(DropdownContext)

  return (
    <div
      id={menuId}
      role="menu"
      className={['dropdown-menu', open ? 'show' : null, className].filter(Boolean).join(' ')}
      hidden={!open}
      {...rest}
    >
      {children}
    </div>
  )
}

DropdownMenu.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const DropdownItem = ({
  children,
  className = '',
  active = false,
  disabled = false,
  as,
  onClick,
  ...rest
}) => {
  const { close } = useContext(DropdownContext)
  const Component = as || 'button'

  const handleClick = (event) => {
    if (disabled) return
    onClick?.(event)
    close()
  }

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      role="menuitem"
      className={['dropdown-item', active ? 'active' : null, disabled ? 'disabled' : null, className]
        .filter(Boolean)
        .join(' ')}
      aria-current={active ? 'true' : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Component>
  )
}

DropdownItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  as: PropTypes.elementType,
  onClick: PropTypes.func,
}

export const DropdownHeader = ({ children, className = '', tag: Tag = 'div', ...rest }) => (
  <Tag className={['dropdown-header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Tag>
)

DropdownHeader.propTypes = { children: PropTypes.node, className: PropTypes.string, tag: PropTypes.elementType }

export const DropdownDivider = ({ className = '', ...rest }) => (
  <hr className={['dropdown-divider', className].filter(Boolean).join(' ')} {...rest} />
)

DropdownDivider.propTypes = { className: PropTypes.string }

export const DropdownFooter = ({ children, className = '', ...rest }) => (
  <div className={['dropdown-footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

DropdownFooter.propTypes = { children: PropTypes.node, className: PropTypes.string }

export default Dropdown