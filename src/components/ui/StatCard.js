import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card } from '../../ui/Card'

// ---------------------------------------------------------------------------
//  StatCard — KPI tile used on the dashboards.
//  Renders as a link when `to` is provided, as a button when `onClick` is.
// ---------------------------------------------------------------------------
const StatCard = ({ label, value, hint, icon, tone = 'primary', to, onClick, loading = false }) => {
  const body = (
    <>
      {icon ? (
        <span className={`gp-stat__icon gp-tint-${tone}`} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="gp-min-w-0">
        <p className="gp-stat__label">{label}</p>
        {loading ? (
          <span className="gp-skeleton gp-skeleton--value" aria-hidden="true" />
        ) : (
          <p className="gp-stat__value">{value}</p>
        )}
        {hint ? <p className="gp-stat__hint">{hint}</p> : null}
      </div>
    </>
  )

  if (to) {
    return (
      <Card className="gp-stat gp-card-hover h-100 text-decoration-none">
        <Link to={to} className="gp-stat__link">
          {body}
        </Link>
      </Card>
    )
  }

  if (onClick) {
    return (
      <Card as="button" type="button" className="gp-stat gp-card-hover h-100 gp-stat--button" onClick={onClick}>
        {body}
      </Card>
    )
  }

  return <Card className="gp-stat h-100">{body}</Card>
}

StatCard.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
  hint: PropTypes.node,
  icon: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger', 'secondary']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
}

export default React.memo(StatCard)
