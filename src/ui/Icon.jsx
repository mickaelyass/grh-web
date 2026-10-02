import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Icon — the single icon component of the application.
//
//  It normalises sizing/accessibility so screens never repeat that logic:
//    <Icon icon={Bell} />
//    <Icon icon={Search} size="sm" className="text-muted" />
//    <Icon icon={Warning} tone="danger" title="Attention" />
// ---------------------------------------------------------------------------
const SIZE_TOKENS = {
  xs: '0.875rem',
  sm: '1rem',
  md: '1.125rem',
  lg: '1.375rem',
  xl: '1.75rem',
  '2xl': '2.25rem',
}

const TONE_TOKENS = {
  primary: 'var(--gp-primary)',
  success: 'var(--gp-success)',
  warning: 'var(--gp-warning)',
  danger: 'var(--gp-danger)',
  info: 'var(--gp-info)',
  muted: 'var(--gp-muted)',
  faint: 'var(--gp-faint)',
  ink: 'var(--gp-ink)',
  inherit: 'inherit',
}

const Icon = ({
  icon: Glyph,
  size = 'md',
  tone,
  color,
  className = '',
  customClassName = '',
  title,
  style,
  ...rest
}) => {
  if (!Glyph) return null

  const dimension = typeof size === 'number' ? size : SIZE_TOKENS[size] || SIZE_TOKENS.md
  const resolvedColor = color || (tone ? TONE_TOKENS[tone] || undefined : undefined)

  return (
    <Glyph
      size={dimension}
      color={resolvedColor}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title || undefined}
      focusable="false"
      className={[customClassName, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    />
  )
}

Icon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(SIZE_TOKENS)), PropTypes.number]),
  tone: PropTypes.oneOf(Object.keys(TONE_TOKENS)),
  color: PropTypes.string,
  className: PropTypes.string,
  customClassName: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
}

export default React.memo(Icon)
