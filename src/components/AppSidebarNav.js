import React from 'react'
import PropTypes from 'prop-types'
import { Nav, NavGroup, NavItem, NavTitle } from '../ui/Nav'

// ---------------------------------------------------------------------------
//  AppSidebarNav — renders the role menu described in `config/navigation.js`.
//
//  The menu is plain data (`{ type, name, to, icon, badge, items }`), so adding
//  a screen is a one-line change in the navigation file and this component
//  needs no update. Active state comes from the router, not from the store.
// ---------------------------------------------------------------------------
const AppSidebarNav = ({ items }) => {
  if (!items?.length) return null

  return (
    <Nav>
      {items.map((item, index) => {
        const key = item.to || item.name || index

        if (item.type === 'title') {
          return <NavTitle key={key}>{item.name}</NavTitle>
        }

        if (item.type === 'group') {
          return (
            <NavGroup
              key={key}
              name={item.name}
              icon={item.icon}
              defaultOpen={item.defaultOpen}
              items={item.items || []}
            />
          )
        }

        return (
          <NavItem key={key} to={item.to} icon={item.icon} badge={item.badge}>
            {item.name}
          </NavItem>
        )
      })}
    </Nav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['item', 'title', 'group']),
      name: PropTypes.node,
      to: PropTypes.string,
      icon: PropTypes.node,
      badge: PropTypes.object,
      items: PropTypes.array,
    }),
  ).isRequired,
}

export default React.memo(AppSidebarNav)
