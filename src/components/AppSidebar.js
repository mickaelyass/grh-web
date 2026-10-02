import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Sidebar, SidebarBrand, SidebarFooter, SidebarHeader, SidebarNav, SidebarToggler } from '../ui'
import Icon from '../ui/Icon'
import CloseButton from '../ui/CloseButton'
import { Logout, PanelLeftClose, PanelLeftOpen } from '../ui/icons'
import { AppSidebarNav } from './AppSidebarNav'
import Avatar from './ui/Avatar'
import logob from '../assets/images/logod.svg'
import { getRoleConfig } from '../config/roles'
import { navForRole } from '../config/navigation'
import { getDisplayName, getStoredUser, logout } from '../utils/auth'

// ---------------------------------------------------------------------------
//  AppSidebar — one navigation rail for the whole application.
//  It used to exist in five copies (AppSidebar / U / C / D / G) that differed
//  only by the imported menu; it now picks the menu from the signed-in role.
// ---------------------------------------------------------------------------
const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const collapsed = useSelector((state) => state.sidebarUnfoldable)
  const drawerOpen = useSelector((state) => state.sidebarShow)

  const user = getStoredUser()
  const role = user?.role
  const roleConfig = getRoleConfig(role)
  const navigation = useMemo(() => navForRole(role), [role])
  const userName = getDisplayName(user)

  return (
    <Sidebar
      unfoldable={collapsed}
      visible={drawerOpen}
      onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
    >
      <SidebarHeader>
        <SidebarBrand to={roleConfig.homePath}>
          <img src={logob} height={30} alt="" aria-hidden="true" />
          <span className="gp-sidebar__brand-text">
            <strong>GestiPerso</strong>
            <span>{roleConfig.shortLabel}</span>
          </span>
        </SidebarBrand>

        <CloseButton
          className="d-lg-none"
          aria-label="Fermer le menu"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </SidebarHeader>

      <SidebarNav>
        <AppSidebarNav items={navigation} />
      </SidebarNav>

      <div className="gp-sidebar-user">
        <Avatar name={userName} size="sm" />
        <div className="gp-sidebar-user__meta">
          <div className="gp-sidebar-user__name">{userName}</div>
          <div className="gp-sidebar-user__role">{roleConfig.label}</div>
        </div>
        <button
          type="button"
          className="gp-sidebar-user__logout"
          title="Se déconnecter"
          aria-label="Se déconnecter"
          onClick={() => logout(navigate)}
        >
          <Icon icon={Logout} />
        </button>
      </div>

      <SidebarFooter>
        <SidebarToggler
          aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !collapsed })}
        >
          <Icon icon={collapsed ? PanelLeftOpen : PanelLeftClose} />
        </SidebarToggler>
      </SidebarFooter>
    </Sidebar>
  )
}

export default React.memo(AppSidebar)
