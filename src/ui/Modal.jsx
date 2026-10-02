import React, { createContext, useContext, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import CloseButton from './CloseButton'

// ---------------------------------------------------------------------------
//  Modal — accessible dialog rendered in a portal.
//
//    <Modal visible={open} onClose={close} size="lg" alignment="center">
//      <ModalHeader><ModalTitle>Modifier</ModalTitle></ModalHeader>
//      <ModalBody>…</ModalBody>
//      <ModalFooter><Button onClick={close}>Fermer</Button></ModalFooter>
//    </Modal>
//
//  Behaviours: Escape to close, backdrop click to close (unless
//  `backdrop="static"`), focus moved inside the dialog, page scroll locked,
//  `aria-modal` + labelled title.
// ---------------------------------------------------------------------------
const ModalContext = createContext({ onClose: undefined })

const Modal = ({
  children,
  visible = false,
  onClose,
  size,
  alignment,
  scrollable = false,
  backdrop = true,
  closeOnEscape = true,
  className = '',
  labelledBy,
  ...rest
}) => {
  const dialogRef = useRef(null)
  const generatedId = useId()

  useEffect(() => {
    if (!visible) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape) onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)

    const focusTimer = window.setTimeout(() => {
      const focusable = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    }, 50)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [visible, closeOnEscape, onClose])

  if (!visible) return null

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return
    if (backdrop === 'static') return
    onClose?.()
  }

  return createPortal(
    <>
      <div className="modal-backdrop" aria-hidden="true" />
      <div
        className={['modal', 'show', 'd-block', className].filter(Boolean).join(' ')}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy || generatedId}
        onMouseDown={handleBackdropClick}
        {...rest}
      >
        <div
          className={[
            'modal-dialog',
            size ? `modal-${size}` : null,
            alignment === 'center' ? 'modal-dialog-centered' : null,
            scrollable ? 'modal-dialog-scrollable' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          ref={dialogRef}
        >
          <ModalContext.Provider value={{ onClose, titleId: labelledBy || generatedId }}>
            <div className="modal-content">{children}</div>
          </ModalContext.Provider>
        </div>
      </div>
    </>,
    document.body,
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'lg', 'xl']),
  alignment: PropTypes.oneOf(['center']),
  scrollable: PropTypes.bool,
  backdrop: PropTypes.oneOf([true, false, 'static']),
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  labelledBy: PropTypes.string,
}

export const ModalHeader = ({ children, className = '', showClose = true, ...rest }) => {
  const { onClose } = useContext(ModalContext)

  return (
    <div className={['modal-header', className].filter(Boolean).join(' ')} {...rest}>
      <div className="gp-min-w-0 flex-grow-1">{children}</div>
      {showClose ? <CloseButton onClick={() => onClose?.()} /> : null}
    </div>
  )
}

ModalHeader.propTypes = { children: PropTypes.node, className: PropTypes.string, showClose: PropTypes.bool }

export const ModalTitle = ({ children, className = '', ...rest }) => {
  const { titleId } = useContext(ModalContext)

  return (
    <h3 id={titleId} className={['modal-title', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </h3>
  )
}

ModalTitle.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const ModalBody = ({ children, className = '', ...rest }) => (
  <div className={['modal-body', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

ModalBody.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const ModalFooter = ({ children, className = '', ...rest }) => (
  <div className={['modal-footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

ModalFooter.propTypes = { children: PropTypes.node, className: PropTypes.string }

export default Modal
