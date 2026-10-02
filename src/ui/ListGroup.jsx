import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  ListGroup — stacked list of items (menus, summaries, mobile card lists).
// ---------------------------------------------------------------------------
export const ListGroup = ({ children, className = '', as: Component = 'ul', flush = false, ...rest }) => (
  <Component
    className={['list-group', flush ? 'list-group-flush' : null, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </Component>
)

ListGroup.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType, flush: PropTypes.bool }

export const ListGroupItem = ({
  children,
  className = '',
  as,
  active = false,
  disabled = false,
  color,
  action = false,
  onClick,
  ...rest
}) => {
  const Component = as || (onClick ? 'button' : 'li')

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className={[
        'list-group-item',
        action || Component === 'button' ? 'list-group-item-action' : null,
        active ? 'active' : null,
        disabled ? 'disabled' : null,
        color ? `list-group-item-${color}` : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-current={active ? 'true' : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  )
}

ListGroupItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  action: PropTypes.bool,
  onClick: PropTypes.func,
}

export default ListGroup
