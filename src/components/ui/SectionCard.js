import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader } from '../../ui/Card'

// ---------------------------------------------------------------------------
//  SectionCard — titled container used for every block of content.
//  `flush` removes the body padding (for tables that manage their own edges).
// ---------------------------------------------------------------------------
const SectionCard = ({
  title,
  subtitle,
  icon,
  actions,
  children,
  footer,
  className = '',
  bodyClassName = '',
  flush = false,
  id,
}) => (
  <Card className={`gp-card ${className}`.trim()} id={id}>
    {title || actions ? (
      <CardHeader className="gp-card__header">
        <div className="gp-min-w-0">
          <h2 className="gp-card-title">
            {icon ? <span aria-hidden="true">{icon}</span> : null}
            {title}
          </h2>
          {subtitle ? <p className="gp-page-subtitle mb-0">{subtitle}</p> : null}
        </div>
        {actions ? <div className="gp-card__actions">{actions}</div> : null}
      </CardHeader>
    ) : null}
    <CardBody className={`${flush ? 'p-0' : ''} ${bodyClassName}`.trim()}>{children}</CardBody>
    {footer ? <div className="gp-card__footer">{footer}</div> : null}
  </Card>
)

SectionCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  flush: PropTypes.bool,
  id: PropTypes.string,
}

export default SectionCard
