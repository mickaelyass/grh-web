import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
//  Button — the single action component of the application.
//
//    <Button color="primary">Enregistrer</Button>
//    <Button color="danger" variant="outline" size="sm">Supprimer</Button>
//    <Button to="/admin/create-dossier" icon={Plus}>Nouveau dossier</Button>
//
//  `variant` : solid (default) · outline · ghost · link
//  `color`   : primary · secondary · success · warning · danger · info · light · dark
// ---------------------------------------------------------------------------
const VARIANTS = ['solid', 'outline', 'ghost', 'link']
const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark']

const Button = ({
  children,
  className = '',
  color = 'primary',
  variant = 'solid',
  size,
  as,
  to,
  href,
  type = 'button',
  active = false,
  disabled = false,
  iconOnly = false,
  block = false,
  shape,
  icon,
  ...rest
}) => {
  const classes = [
    'btn',
    variant === 'solid' ? `btn-${color}` : `btn-${variant}-${color}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : null,
    iconOnly ? 'btn-icon' : null,
    block ? 'w-100' : null,
    shape === 'pill' ? 'rounded-pill' : null,
    active ? 'active' : null,
    disabled ? 'disabled' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon}
      {children}
    </>
  )

  const Component = as || (to ? Link : href ? 'a' : 'button')

  const componentProps = {
    className: classes,
    ...(Component === 'button'
      ? { type, disabled }
      : { role: 'button', 'aria-disabled': disabled || undefined }),
    ...(to ? { to } : {}),
    ...(href ? { href } : {}),
    ...rest,
  }

  return <Component {...componentProps}>{content}</Component>
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(COLORS),
  variant: PropTypes.oneOf(VARIANTS),
  size: PropTypes.oneOf(['sm', 'lg']),
  as: PropTypes.elementType,
  to: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  iconOnly: PropTypes.bool,
  block: PropTypes.bool,
  shape: PropTypes.oneOf(['pill']),
  icon: PropTypes.node,
}

export default React.memo(Button)
