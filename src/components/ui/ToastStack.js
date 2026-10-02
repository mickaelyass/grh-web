import React, { useCallback, useEffect, useState } from 'react'
import Icon from '../../ui/Icon'
import CloseButton from '../../ui/CloseButton'
import { Bell } from '../../ui/icons'
import socket from '../../services/socketService'

// ---------------------------------------------------------------------------
//  ToastStack — live notifications pushed by Socket.io.
//  Replaces the old inline `Notification` component which rendered a <li>
//  inside the header and used a hard-coded `alert-warning`.
// ---------------------------------------------------------------------------
const ToastStack = () => {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    const handleNotification = (notification) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((list) => [{ id, ...notification }, ...list].slice(0, 4))
      setTimeout(() => dismiss(id), 6000)
    }

    socket.on('receiveNotification', handleNotification)
    return () => socket.off('receiveNotification', handleNotification)
  }, [dismiss])

  if (toasts.length === 0) return null

  return (
    <div className="gp-toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="alert gp-toast">
          <span className="gp-tint-primary gp-toast__icon" aria-hidden="true">
            <Icon icon={Bell} />
          </span>
          <div className="gp-min-w-0 flex-grow-1">
            <p className="gp-toast__title">{toast.titre || toast.title || 'Nouvelle notification'}</p>
            <p className="gp-toast__text mb-0">{toast.message}</p>
          </div>
          <CloseButton onClick={() => dismiss(toast.id)} aria-label="Fermer la notification" />
        </div>
      ))}
    </div>
  )
}

export default ToastStack
