import React from 'react'
import PropTypes from 'prop-types'
import Badge from '../../ui/Badge'
import { Card } from '../../ui/Card'

// ---------------------------------------------------------------------------
//  TableCard — the container of every list screen:
//  header (title + counters + actions), optional toolbar, scrollable table and
//  optional footer (pagination / totals). Keeps tables visually identical.
// ---------------------------------------------------------------------------
const TableCard = ({
  title,
  subtitle,
  icon,
  count,
  actions,
  toolbar,
  footer,
  children,
  className = '',
  id,
}) => (
  <Card className={`gp-table-card ${className}`.trim()} id={id}>
    {title ? (
      <div className="gp-table-card__header">
        <div className="gp-min-w-0">
          <h2 className="gp-table-card__title">
            {icon ? <span aria-hidden="true">{icon}</span> : null}
            {title}
            {count !== undefined && count !== null ? (
              <Badge color="light" className="gp-count-badge">
                {count}
              </Badge>
            ) : null}
          </h2>
          {subtitle ? <p className="gp-page-subtitle mb-0">{subtitle}</p> : null}
        </div>
        {actions ? <div className="gp-card__actions ms-auto">{actions}</div> : null}
      </div>
    ) : null}

    {toolbar ? <div className="gp-toolbar">{toolbar}</div> : null}

    <div className="table-responsive">{children}</div>

    {footer ? <div className="gp-table-card__footer">{footer}</div> : null}
  </Card>
)

TableCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
  count: PropTypes.number,
  actions: PropTypes.node,
  toolbar: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
}

export default TableCard
