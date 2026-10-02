import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Spinner & Progress
// ---------------------------------------------------------------------------

/** Bootstrap-free loading indicator (border spinner or pulsing dots). */
const Spinner = ({
  className = '',
  color,
  variant = 'border',
  size,
  label = 'Chargement…',
  ...rest
}) => (
  <span
    className={[
      variant === 'grow' ? 'spinner-grow' : 'spinner-border',
      size === 'sm' ? `${variant === 'grow' ? 'spinner-grow' : 'spinner-border'}-sm` : null,
      color ? `text-${color}` : null,
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    role="status"
    aria-label={label}
    {...rest}
  >
    <span className="visually-hidden">{label}</span>
  </span>
)

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOf(['border', 'grow']),
  size: PropTypes.oneOf(['sm']),
  label: PropTypes.string,
}

export default React.memo(Spinner)
