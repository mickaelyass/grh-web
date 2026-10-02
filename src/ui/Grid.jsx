import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Grid — Container / Row / Col.
//
//    <Container lg><Row className="g-3">
//      <Col xs={12} md={6}>…</Col>
//    </Row></Container>
//
//  `Col` accepts a number (1-12 span), `'auto'` or nothing (equal width) for
//  every breakpoint: xs, sm, md, lg, xl, xxl.
// ---------------------------------------------------------------------------
const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

const spanClass = (breakpoint, value) => {
  if (value === undefined || value === null) return null

  const prefix = breakpoint === 'xs' ? 'col' : `col-${breakpoint}`

  if (value === 'auto') return `${prefix}-auto`
  if (value === true) return prefix

  return `${prefix}-${value}`
}

export const Container = ({ children, className = '', fluid = false, as: Component = 'div', ...rest }) => {
  const sizes = BREAKPOINTS.filter((breakpoint) => rest[breakpoint])
  const variant = fluid ? 'container-fluid' : sizes.length ? `container-${sizes[sizes.length - 1]}` : 'container'

  const componentProps = { ...rest }
  BREAKPOINTS.forEach((breakpoint) => delete componentProps[breakpoint])

  return (
    <Component className={[variant, className].filter(Boolean).join(' ')} {...componentProps}>
      {children}
    </Component>
  )
}

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  as: PropTypes.elementType,
}

export const Row = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['row', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

Row.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const Col = ({ children, className = '', as: Component = 'div', ...rest }) => {
  const classes = BREAKPOINTS.map((breakpoint) => spanClass(breakpoint, rest[breakpoint])).filter(Boolean)

  const componentProps = { ...rest }
  BREAKPOINTS.forEach((breakpoint) => delete componentProps[breakpoint])

  return (
    <Component className={[...(classes.length ? classes : ['col']), className].filter(Boolean).join(' ')} {...componentProps}>
      {children}
    </Component>
  )
}

Col.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
}

BREAKPOINTS.forEach((breakpoint) => {
  Col.propTypes[breakpoint] = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['auto']),
    PropTypes.bool,
  ])
})

export default { Container, Row, Col }
