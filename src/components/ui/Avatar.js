import React from 'react'
import PropTypes from 'prop-types'
import { initials as toInitials } from '../../utils/format'

// ---------------------------------------------------------------------------
//  Avatar — deterministic initials badge (no broken <img> on missing photos).
// ---------------------------------------------------------------------------
const SIZES = ['sm', 'md', 'lg', 'xl']

const Avatar = ({ name, src, size = 'md', tone, className = '', title }) => {
  const sizeClass = size === 'md' ? '' : `gp-avatar--${SIZES.includes(size) ? size : 'md'}`
  const classes = ['gp-avatar', sizeClass, tone ? `gp-avatar--${tone}` : '', className]
    .filter(Boolean)
    .join(' ')

  if (src) {
    return <img className={classes} src={src} alt={name || 'Avatar'} title={title || name} />
  }

  return (
    <span className={classes} title={title || name || undefined} aria-hidden={!name}>
      {toInitials(name)}
    </span>
  )
}

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(SIZES),
  tone: PropTypes.oneOf(['muted']),
  className: PropTypes.string,
  title: PropTypes.string,
}

export default React.memo(Avatar)
