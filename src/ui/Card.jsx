import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Card — the surface every screen is built on.
//    <Card><CardHeader>…</CardHeader><CardBody>…</CardBody></Card>
// ---------------------------------------------------------------------------
export const Card = ({ children, className = '', as: Component = 'div', color, textColor, ...rest }) => (
  <Component
    className={[
      'card',
      color ? `bg-${color}` : null,
      textColor ? `text-${textColor}` : null,
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Component>
)

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
  color: PropTypes.string,
  textColor: PropTypes.string,
}

export const CardHeader = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['card-header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardHeader.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardBody = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['card-body', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardBody.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardFooter = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['card-footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardFooter.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardGroup = ({ children, className = '', as: Component = 'div', ...rest }) => (
  <Component className={['card-group', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardGroup.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...rest }) => (
  <Component className={['card-title', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardTitle.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardSubtitle = ({ children, className = '', as: Component = 'p', ...rest }) => (
  <Component className={['card-subtitle', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardSubtitle.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const CardText = ({ children, className = '', as: Component = 'p', ...rest }) => (
  <Component className={['card-text', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Component>
)

CardText.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export default Card
