import React from 'react'
import PropTypes from 'prop-types'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

// ---------------------------------------------------------------------------
//  FormAlert / FormToasts — le retour visible d'un formulaire.
//
//  FormAlert : l'erreur de soumission (API, reseau, droits) au-dessus du form.
//  FormToasts : confirmations de succes, non bloquantes.
// ---------------------------------------------------------------------------

export const FormAlert = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <Alert color="danger" className="gp-form-alert" role="alert">
      <div className="d-flex align-items-start gap-2">
        <div className="flex-grow-1">
          <strong className="d-block mb-1">Enregistrement impossible</strong>
          <span>{error}</span>
        </div>
        {onDismiss ? (
          <Button color="link" size="sm" className="p-0 text-danger" onClick={onDismiss}>
            Fermer
          </Button>
        ) : null}
      </div>
    </Alert>
  )
}

FormAlert.propTypes = { error: PropTypes.string, onDismiss: PropTypes.func }

const TONE = { success: 'success', danger: 'danger', warning: 'warning', info: 'info' }

export const FormToasts = ({ toasts = [], onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="gp-toast-stack gp-toast-stack--form" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert alert-${TONE[toast.tone] || 'success'} gp-toast d-flex align-items-center gap-2`}
        >
          <span className="flex-grow-1">{toast.message}</span>
          {onDismiss ? (
            <Button color="link" size="sm" className="p-0" onClick={() => onDismiss(toast.id)}>
              Fermer
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

FormToasts.propTypes = { toasts: PropTypes.array, onDismiss: PropTypes.func }

export default FormAlert
