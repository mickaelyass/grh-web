import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Pagination — presentational pager.
//    <Pagination align="end">
//      <PaginationItem disabled>‹</PaginationItem>
//      <PaginationItem active>1</PaginationItem>
//    </Pagination>
// ---------------------------------------------------------------------------
export const Pagination = ({ children, className = '', align, size, 'aria-label': ariaLabel, ...rest }) => (
  <ul
    className={[
      'pagination',
      align ? `justify-content-${align}` : null,
      size ? `pagination-${size}` : null,
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    aria-label={ariaLabel}
    {...rest}
  >
    {children}
  </ul>
)

Pagination.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  size: PropTypes.oneOf(['sm', 'lg']),
}

export const PaginationItem = ({
  children,
  className = '',
  active = false,
  disabled = false,
  as: Component = 'button',
  ellipsis = false,
  ...rest
}) => (
  <li
    className={['page-item', active ? 'active' : null, disabled ? 'disabled' : null, ellipsis ? 'page-item--ellipsis' : null, className]
      .filter(Boolean)
      .join(' ')}
  >
    <Component
      className="page-link"
      type={Component === 'button' ? 'button' : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {children}
    </Component>
  </li>
)

PaginationItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  as: PropTypes.elementType,
  ellipsis: PropTypes.bool,
}

export default Pagination
