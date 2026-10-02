import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header, HeaderActions, HeaderBar, HeaderToggler } from '../ui/Header'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../ui/Dropdown'
import Icon from '../ui/Icon'
import { Contrast, Menu, Moon, Sun } from '../ui/icons'
import { useTheme } from '../theme/ThemeContext'
import { THEME_LABELS, THEMES } from '../config/theme'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header'
import NotificationBell from './NotificationBell'
import ToastStack from './ui/ToastStack'

const THEME_ICONS = { light: Sun, dark: Moon, auto: Contrast }

// ---------------------------------------------------------------------------
//  AppHeader — sticky top bar: menu toggler, breadcrumb, notifications,
//  appearance switch and the user menu. All entry points live on one line.
//
//  The appearance switch writes to `ThemeContext`, which repaints the whole
//  application by flipping `data-theme` on <html> — no component re-renders
//  with hard-coded colours, so light and dark can never drift apart.
// ---------------------------------------------------------------------------
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { theme, resolvedTheme, setTheme } = useTheme()

  const current = THEMES.includes(theme) ? theme : 'light'
  const CurrentIcon = THEME_ICONS[resolvedTheme] || Sun

  return (
    <Header>
      <HeaderBar>
        <HeaderToggler
          aria-label={sidebarShow ? 'Masquer le menu' : 'Afficher le menu'}
          aria-expanded={sidebarShow}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <Icon icon={Menu} size="lg" />
        </HeaderToggler>

        <div className="gp-header-brand d-lg-none">
          Gesti<span>Perso</span>
        </div>

        <div className="gp-header-breadcrumb">
          <AppBreadcrumb />
        </div>

        <HeaderActions>
          <NotificationBell />

          <Dropdown placement="bottom-end">
            <DropdownToggle
              caret={false}
              className="gp-icon-btn"
              aria-label={`Apparence : ${THEME_LABELS[current]}`}
              title={`Apparence : ${THEME_LABELS[current]}`}
            >
              <Icon icon={CurrentIcon} size="lg" />
            </DropdownToggle>

            <DropdownMenu className="gp-theme-menu">
              {THEMES.map((mode) => {
                const ModeIcon = THEME_ICONS[mode]
                return (
                  <DropdownItem
                    key={mode}
                    active={mode === current}
                    onClick={() => setTheme(mode)}
                  >
                    <Icon icon={ModeIcon} />
                    {THEME_LABELS[mode]}
                    {mode === 'auto' ? (
                      <span className="gp-muted-note ms-auto">{THEME_LABELS[resolvedTheme]}</span>
                    ) : null}
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>

          <AppHeaderDropdown />
        </HeaderActions>
      </HeaderBar>

      <ToastStack />
    </Header>
  )
}

export default AppHeader
