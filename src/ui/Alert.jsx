import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import { AlertCircle, CheckCircle, Info, Warning } from './icons'

// ---------------------------------------------------------------------------
//  Alert — inline feedback (info / success / warning / danger).
//  `dismissible` renders a close button; `visible` allows controlled use.
// ---------------------------------------------------------------------------
const TONE_ICONS = {
  primary: Info,
  info: Info,
  success: CheckCircle,
  warning: Warning,
  danger: AlertCircle,
}

const Alert = ({
  children,
  className = '',
  color = 'danger',
  dismissible = false,
  visible: visibleProp,
  onClose,
  icon,
  showIcon = false,
  ...rest
}) => {
  const [visibleState, setVisibleState] = useState(true)
  const visible = visibleProp === undefined ? visibleState : visibleProp

  if (!visible) return null

  const ToneIcon = icon === undefined && showIcon ? TONE_ICONS[color] : icon

  const handleClose = () => {
    setVisibleState(false)
    onClose?.()
  }

  return (
    <div
      className={['alert', `alert-${color}`, dismissible ? 'alert-dismissible' : null, className]
        .filter(Boolean)
        .join(' ')}
      role={color === 'danger' || color === 'warning' ? 'alert' : 'status'}
      {...rest}
    >
      {ToneIcon ? <Icon icon={ToneIcon} /> : null}
      <div className="gp-min-w-0 flex-grow-1">{children}</div>
      {dismissible ? (
        <button type="button" className="btn-close" aria-label="Fermer" onClick={handleClose} />
      ) : null}
    </div>
  )
}

Alert.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark']),
  dismissible: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  icon: PropTypes.elementType,
  showIcon: PropTypes.bool,
}

export default React.memo(Alert)
