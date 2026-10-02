import React from 'react'
import PropTypes from 'prop-types'
import { valueOr } from '../../utils/format'

// ---------------------------------------------------------------------------
//  StatusBadge — one visual language for every workflow state of the app.
//  The maps are keyed by the raw backend value (case/space insensitive) so a
//  screen never has to translate a status again.
// ---------------------------------------------------------------------------

const CONGE_STATUS = {
  'en attente': { tone: 'warning', label: 'En attente' },
  'en cours': { tone: 'info', label: 'En cours' },
  autorisee: { tone: 'success', label: 'Autorisée' },
  approuvee: { tone: 'success', label: 'Approuvée' },
  rejetee: { tone: 'danger', label: 'Rejetée' },
  refusee: { tone: 'danger', label: 'Refusée' },
  annulee: { tone: 'secondary', label: 'Annulée' },
}

const DOSSIER_ETAT = {
  actif: { tone: 'success', label: 'Actif' },
  retraite: { tone: 'info', label: 'Retraité' },
  decede: { tone: 'secondary', label: 'Décédé' },
  mutate: { tone: 'primary', label: 'Muté' },
  mutation: { tone: 'primary', label: 'Mutation' },
  detachement: { tone: 'warning', label: 'Détachement' },
  detache: { tone: 'warning', label: 'Détaché' },
  disponibilite: { tone: 'warning', label: 'Disponibilité' },
  'mise a disposition': { tone: 'info', label: 'Mise à disposition' },
  sanction: { tone: 'danger', label: 'Sanction' },
  suspendu: { tone: 'danger', label: 'Suspendu' },
}

const ROLE_TONES = {
  admin: { tone: 'primary', label: 'Administrateur' },
  directrice: { tone: 'info', label: 'Directrice générale' },
  chef_service: { tone: 'success', label: 'Chef de service' },
  securite: { tone: 'warning', label: 'Agent de sécurité' },
  user: { tone: 'secondary', label: 'Agent' },
}

const DECISION_STATES = {
  'en attente': { tone: 'warning', label: 'En attente' },
  autorisee: { tone: 'success', label: 'Autorisée' },
  rejetee: { tone: 'danger', label: 'Rejetée' },
  valide: { tone: 'success', label: 'Validé' },
  invalide: { tone: 'danger', label: 'Invalidé' },
}

const PRESENCE_STATES = {
  present: { tone: 'success', label: 'Présent' },
  absente: { tone: 'danger', label: 'Absent' },
  absent: { tone: 'danger', label: 'Absent' },
  retard: { tone: 'warning', label: 'Retard' },
  permission: { tone: 'info', label: 'Permission' },
  conge: { tone: 'primary', label: 'Congé' },
  maladie: { tone: 'secondary', label: 'Maladie' },
}

const EVALUATION_STATES = {
  'en attente': { tone: 'warning', label: 'En attente' },
  'en cours': { tone: 'info', label: 'En cours' },
  evaluee: { tone: 'success', label: 'Évaluée' },
  appreciee: { tone: 'success', label: 'Appréciée' },
  'non evaluee': { tone: 'secondary', label: 'Non évaluée' },
  rejetee: { tone: 'danger', label: 'Rejetée' },
}

const MAPS = {
  conge: CONGE_STATUS,
  decision: DECISION_STATES,
  dossier: DOSSIER_ETAT,
  role: ROLE_TONES,
  presence: PRESENCE_STATES,
  evaluation: EVALUATION_STATES,
}

const normalize = (value) => (value === null || value === undefined ? '' : String(value).trim().toLowerCase())

/**
 * @param {{ status: any, kind?: 'conge'|'dossier'|'role'|'presence'|'evaluation', label?: string }} props
 */
const StatusBadge = ({ status, kind = 'conge', label, className = '' }) => {
  const entry = MAPS[kind]?.[normalize(status)]
  const tone = entry?.tone || 'secondary'
  const text = label || entry?.label || valueOr(status, '—')

  return (
    <span className={`gp-badge gp-soft-${tone} ${className}`.trim()} title={String(text)}>
      {text}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.any,
  kind: PropTypes.oneOf(Object.keys(MAPS)),
  label: PropTypes.node,
  className: PropTypes.string,
}

export default React.memo(StatusBadge)

export const toneForStatus = (status, kind = 'conge') =>
  MAPS[kind]?.[normalize(status)]?.tone || 'secondary'

export const labelForStatus = (status, kind = 'conge') =>
  MAPS[kind]?.[normalize(status)]?.label || valueOr(status, '—')
