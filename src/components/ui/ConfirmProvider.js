import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../../ui/Button'
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../ui/Modal'
import Icon from '../../ui/Icon'
import { Warning } from '../../ui/icons'

// ---------------------------------------------------------------------------
//  ConfirmProvider — replaces `window.confirm()` with a real, accessible modal
//  that matches the product (no more browser-native popups).
//
//  Usage:
//    const confirm = useConfirm()
//    const ok = await confirm({ title: 'Supprimer le dossier ?', tone: 'danger' })
// ---------------------------------------------------------------------------

const ConfirmContext = createContext(null)

const DEFAULTS = {
  title: 'Confirmer cette action',
  message: '',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  tone: 'primary',
}

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ ...DEFAULTS, open: false })
  const resolver = useRef(null)

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        resolver.current = resolve
        setState({ ...DEFAULTS, ...options, open: true })
      }),
    [],
  )

  const settle = useCallback((result) => {
    setState((current) => ({ ...current, open: false }))
    if (resolver.current) {
      resolver.current(result)
      resolver.current = null
    }
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Modal
        visible={state.open}
        onClose={() => settle(false)}
        alignment="center"
        backdrop="static"
        aria-labelledby="gp-confirm-title"
      >
        <ModalHeader>
          <ModalTitle id="gp-confirm-title" className="d-flex align-items-center gap-2">
            {state.tone === 'danger' ? (
              <span className="gp-tint-danger gp-confirm__icon" aria-hidden="true">
                <Icon icon={Warning} />
              </span>
            ) : null}
            {state.title}
          </ModalTitle>
        </ModalHeader>
        {state.message ? <ModalBody>{state.message}</ModalBody> : null}
        <ModalFooter>
          <Button color="light" onClick={() => settle(false)}>
            {state.cancelLabel}
          </Button>
          <Button color={state.tone} autoFocus onClick={() => settle(true)}>
            {state.confirmLabel}
          </Button>
        </ModalFooter>
      </Modal>
    </ConfirmContext.Provider>
  )
}

ConfirmProvider.propTypes = { children: PropTypes.node }

/**
 * @returns {{ confirm: (options?: object) => Promise<boolean> }}
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (context) return context
  // Graceful degradation outside of the provider (e.g. unit tests).
  return {
    confirm: async (options = {}) => window.confirm(options.message || options.title || 'Confirmer ?'),
  }
}

export default ConfirmProvider
