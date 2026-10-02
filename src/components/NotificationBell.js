import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../ui/Dropdown'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { Bell, Inbox } from '../ui/icons'
import { getUserNotif, markNotificationAsRead } from '../services/api'
import { notificationsPathForRole } from '../config/roles'
import { getStoredUser } from '../utils/auth'
import { formatRelative } from '../utils/format'

// ---------------------------------------------------------------------------
//  NotificationBell — unread counter + last notifications preview.
//  The full inbox stays one click away (it is a page of the role workspace).
// ---------------------------------------------------------------------------
const NotificationBell = () => {
  const navigate = useNavigate()
  const user = getStoredUser()
  const matricule = user?.matricule
  const inboxPath = notificationsPathForRole(user?.role)

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!matricule) return
    setLoading(true)
    try {
      const response = await getUserNotif(matricule)
      setNotifications(Array.isArray(response.data) ? response.data : [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [matricule])

  useEffect(() => {
    load()
  }, [load])

  const unread = notifications.filter((notification) => !notification.is_read).length
  const preview = notifications.slice(0, 5)

  const handleOpen = async (notification) => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id_notif)
        setNotifications((list) =>
          list.map((item) =>
            item.id_notif === notification.id_notif ? { ...item, is_read: true } : item,
          ),
        )
      } catch {
        /* the list is refreshed on the next load */
      }
    }
    navigate(inboxPath)
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownToggle
        caret={false}
        className="gp-icon-btn"
        aria-label={unread > 0 ? `Notifications (${unread} non lues)` : 'Notifications'}
      >
        <Icon icon={Bell} size="lg" />
        {unread > 0 ? (
          <Badge color="danger" shape="rounded-pill" className="gp-icon-btn__badge">
            {unread > 9 ? '9+' : unread}
          </Badge>
        ) : null}
      </DropdownToggle>

      <DropdownMenu className="gp-notif-menu">
        <div className="gp-notif-menu__header">
          <span>Notifications</span>
          {unread > 0 ? <Badge color="primary" soft>{unread} non lue(s)</Badge> : null}
        </div>

        {loading ? (
          <DropdownItem disabled>Chargement…</DropdownItem>
        ) : preview.length === 0 ? (
          <DropdownItem disabled>
            <Icon icon={Inbox} />
            Aucune notification
          </DropdownItem>
        ) : (
          preview.map((notification) => (
            <DropdownItem
              key={notification.id_notif}
              className={`gp-notif-item ${notification.is_read ? '' : 'gp-notif-item--unread'}`}
              onClick={() => handleOpen(notification)}
            >
              <span className="gp-notif-item__text">{notification.message}</span>
              <span className="gp-notif-item__date">{formatRelative(notification.create_dat)}</span>
            </DropdownItem>
          ))
        )}

        <DropdownDivider />

        <div className="dropdown-footer">
          <Button
            color="primary"
            variant="outline"
            size="sm"
            block
            onClick={() => navigate(inboxPath)}
          >
            Voir toutes les notifications
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}

export default React.memo(NotificationBell)
