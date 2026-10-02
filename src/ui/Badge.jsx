import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Badge — compact status/count label.
//    <Badge color="success">Autorisée</Badge>
//    <Badge soft color="warning">En attente</Badge>
// ---------------------------------------------------------------------------
const Badge = ({ children, className = '', color, soft = false, shape, as: Component = 'span', ...rest }) => (
  <Component
    className={[
      'badge',
      soft ? `gp-soft-${color}` : color ? `bg-${color}` : null,
      shape === 'rounded-pill' ? 'rounded-pill' : null,
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Component>
)

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark']),
  soft: PropTypes.bool,
  shape: PropTypes.oneOf(['rounded-pill']),
  as: PropTypes.elementType,
}

export default React.memo(Badge)
