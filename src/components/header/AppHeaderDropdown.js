import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from '../../ui/Dropdown'
import Icon from '../../ui/Icon'
import { Bell, Logout, User } from '../../ui/icons'
import Avatar from '../ui/Avatar'
import { getRoleConfig } from '../../config/roles'
import { getDisplayName, getStoredUser, logout } from '../../utils/auth'

// ---------------------------------------------------------------------------
//  AppHeaderDropdown — identity card + shortcuts + sign out.
//  Previously a dropdown with an empty toggle and every item commented out,
//  so the user had no idea an account menu existed.
// ---------------------------------------------------------------------------
const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const user = getStoredUser() || {}
  const roleConfig = getRoleConfig(user.role)
  const userName = getDisplayName(user)

  return (
    <Dropdown placement="bottom-end">
      <DropdownToggle caret={false} className="gp-user-btn" aria-label="Menu du compte">
        <Avatar name={userName} size="sm" />
        <span className="gp-user-btn__meta d-none d-md-flex">
          <span className="gp-user-btn__name">{userName}</span>
          <span className="gp-user-btn__role">{roleConfig.shortLabel}</span>
        </span>
      </DropdownToggle>

      <DropdownMenu className="gp-user-menu">
        <div className="gp-user-menu__header">
          <Avatar name={userName} size="lg" />
          <div className="gp-min-w-0">
            <div className="gp-user-menu__name">{userName}</div>
            <div className="gp-user-menu__role">{roleConfig.label}</div>
            {user.matricule ? (
              <div className="gp-user-menu__matricule">Matricule {user.matricule}</div>
            ) : null}
          </div>
        </div>

        <DropdownItem onClick={() => navigate(roleConfig.profilePath)}>
          <Icon icon={User} />
          Mon profil
        </DropdownItem>

        <DropdownItem onClick={() => navigate(roleConfig.notificationsPath)}>
          <Icon icon={Bell} />
          Notifications
        </DropdownItem>

        <DropdownDivider />

        <DropdownItem onClick={() => logout(navigate)}>
          <Icon icon={Logout} />
          Se déconnecter
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default AppHeaderDropdown
