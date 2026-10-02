import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Table — semantic table primitives.
//
//    <Table hover striped responsive>
//      <TableHead><TableRow>
//        <TableHeaderCell width="12rem">Agent</TableHeaderCell>
//      </TableRow></TableHead>
//      <TableBody>…</TableBody>
//    </Table>
// ---------------------------------------------------------------------------
export const Table = ({
  children,
  className = '',
  striped = false,
  hover = false,
  bordered = false,
  borderless = false,
  small = false,
  responsive = false,
  color,
  ...rest
}) => {
  const table = (
    <table
      className={[
        'table',
        striped ? 'table-striped' : null,
        hover ? 'table-hover' : null,
        bordered ? 'table-bordered' : null,
        borderless ? 'table-borderless' : null,
        small ? 'table-sm' : null,
        color ? `table-${color}` : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </table>
  )

  return responsive ? <div className="table-responsive">{table}</div> : table
}

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  small: PropTypes.bool,
  responsive: PropTypes.bool,
  color: PropTypes.string,
}

export const TableHead = ({ children, className = '', color, ...rest }) => (
  <thead className={[color ? `thead-${color}` : null, className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </thead>
)

TableHead.propTypes = { children: PropTypes.node, className: PropTypes.string, color: PropTypes.string }

export const TableBody = ({ children, className = '', ...rest }) => (
  <tbody className={className} {...rest}>
    {children}
  </tbody>
)

TableBody.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const TableRow = ({ children, className = '', color, active = false, ...rest }) => (
  <tr
    className={[color ? `table-${color}` : null, active ? 'table-active' : null, className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </tr>
)

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  active: PropTypes.bool,
}

export const TableHeaderCell = ({ children, className = '', width, align, scope = 'col', ...rest }) => (
  <th
    scope={scope}
    className={[align ? `text-${align}` : null, className].filter(Boolean).join(' ')}
    style={width ? { width, ...rest.style } : rest.style}
    {...rest}
  >
    {children}
  </th>
)

TableHeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  width: PropTypes.string,
  align: PropTypes.string,
  scope: PropTypes.string,
}

export const TableDataCell = ({ children, className = '', align, ...rest }) => (
  <td className={[align ? `text-${align}` : null, className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </td>
)

TableDataCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.string,
}

export default Table
