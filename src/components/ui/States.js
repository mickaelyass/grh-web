import React from 'react'
import PropTypes from 'prop-types'
import Alert from '../../ui/Alert'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import Icon from '../../ui/Icon'
import { Inbox, Reload, Warning } from '../../ui/icons'

// ---------------------------------------------------------------------------
//  States — the three answers every data screen must give:
//  "we are loading", "it failed", "there is nothing (yet)".
//  They share the same layout so pages never look broken.
// ---------------------------------------------------------------------------

export const LoadingState = ({ label = 'Chargement des données…', rows = 0 }) => (
  <div className="gp-loading" role="status" aria-live="polite">
    {rows > 0 ? (
      <div className="w-100">
        {Array.from({ length: rows }).map((_, index) => (
          <span key={index} className="gp-skeleton gp-skeleton--row" aria-hidden="true" />
        ))}
      </div>
    ) : (
      <>
        <Spinner color="primary" />
        <span>{label}</span>
      </>
    )}
  </div>
)

LoadingState.propTypes = {
  label: PropTypes.string,
  rows: PropTypes.number,
}

export const ErrorState = ({ title = 'Impossible de charger les données', error, onRetry }) => (
  <div className="gp-empty" role="alert">
    <span className="gp-empty__icon gp-tint-danger" aria-hidden="true">
      <Icon icon={Warning} />
    </span>
    <p className="gp-empty__title">{title}</p>
    <p className="gp-empty__text">
      {error?.response?.data?.error ||
        error?.message ||
        'Une erreur est survenue. Vérifiez votre connexion puis réessayez.'}
    </p>
    {onRetry ? (
      <Button color="primary" variant="outline" size="sm" className="mt-2" onClick={onRetry}>
        <Icon icon={Reload} className="me-2" />
        Réessayer
      </Button>
    ) : null}
  </div>
)

ErrorState.propTypes = {
  title: PropTypes.string,
  error: PropTypes.any,
  onRetry: PropTypes.func,
}

export const EmptyState = ({ icon, title = 'Aucun résultat', text, action, className = '' }) => (
  <div className={`gp-empty ${className}`.trim()}>
    <span className="gp-empty__icon" aria-hidden="true">
      {icon || <Icon icon={Inbox} />}
    </span>
    <p className="gp-empty__title">{title}</p>
    {text ? <p className="gp-empty__text">{text}</p> : null}
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
)

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
  text: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
}

/**
 * AsyncState — renders loading / error / empty / content without repeating the
 * same conditionals in every screen.
 */
export const AsyncState = ({
  loading,
  error,
  isEmpty = false,
  onRetry,
  loadingRows = 0,
  loadingLabel,
  emptyProps = {},
  children,
}) => {
  if (loading) return <LoadingState rows={loadingRows} label={loadingLabel} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return <EmptyState {...emptyProps} />
  return children
}

AsyncState.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  isEmpty: PropTypes.bool,
  onRetry: PropTypes.func,
  loadingRows: PropTypes.number,
  loadingLabel: PropTypes.string,
  emptyProps: PropTypes.object,
  children: PropTypes.node,
}

export const InlineAlert = ({ color = 'danger', title, children, className = '' }) =>
  children ? (
    <Alert color={color} className={`gp-alert ${className}`.trim()}>
      {title ? <strong className="d-block mb-1">{title}</strong> : null}
      {children}
    </Alert>
  ) : null

InlineAlert.propTypes = {
  color: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
}
