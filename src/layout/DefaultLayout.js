import React from 'react'
import { useSelector } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

// ---------------------------------------------------------------------------
//  DefaultLayout — the application shell shared by every role workspace.
//
//  The `gp-shell` grid is what positions the rail and the main column. The two
//  state modifiers read from the same redux slice `AppSidebar` writes to, so the
//  responsive behaviour lives in exactly one place:
//    · `--drawer-open` → the rail slides in (mobile)
//    · `--collapsed`   → the rail shrinks to icons only (desktop)
// ---------------------------------------------------------------------------
const DefaultLayout = () => {
  const drawerOpen = useSelector((state) => state.sidebarShow)
  const collapsed = useSelector((state) => state.sidebarUnfoldable)

  return (
    <div
      className={[
        'gp-shell',
        collapsed ? 'gp-shell--collapsed' : null,
        drawerOpen ? 'gp-shell--drawer-open' : null,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AppSidebar />

      <div className="gp-shell__main">
        <AppHeader />

        <main className="gp-shell__content">
          <AppContent />
        </main>

        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
