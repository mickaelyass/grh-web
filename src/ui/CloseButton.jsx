import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  CloseButton — the round × used by alerts, modals and toasts.
//  The glyph itself is drawn with a CSS mask (see `_components.scss`).
// ---------------------------------------------------------------------------
const CloseButton = ({ className = '', dark = false, white = false, disabled = false, onClick, ...rest }) => (
  <button
    type="button"
    className={['btn-close', white ? 'btn-close-white' : null, dark ? 'btn-close-dark' : null, className]
      .filter(Boolean)
      .join(' ')}
    disabled={disabled}
    aria-label={rest['aria-label'] || 'Fermer'}
    onClick={onClick}
    {...rest}
  />
)

CloseButton.propTypes = {
  className: PropTypes.string,
  dark: PropTypes.bool,
  white: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default React.memo(CloseButton)
