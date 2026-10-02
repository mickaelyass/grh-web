import React from 'react'
import PropTypes from 'prop-types'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import { Fingerprint } from '../../../ui/icons'import { EmptyState, StatusBadge, TableCard } from '../../../components/ui'
import { formatDate, valueOr } from '../../../utils/format'

// ---------------------------------------------------------------------------
//  PresencesDuJourPanel — today's roll call, used by admin, DG and sécurité.
// ---------------------------------------------------------------------------
const PresencesDuJourPanel = ({ presences = [], loading = false }) => (
  <TableCard
    title="Présences du jour"
    icon={<Icon icon={Fingerprint} />}
    count={presences.length}
    subtitle={new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}
  >
    <Table hover responsive className="mb-0">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Matricule</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Arrivée</TableHeaderCell>
          <TableHeaderCell>Départ</TableHeaderCell>
          <TableHeaderCell>Statut</TableHeaderCell>
          <TableHeaderCell>Observations</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableDataCell colSpan={6}>
              <span className="gp-skeleton gp-skeleton--row" aria-hidden="true" />
            </TableDataCell>
          </TableRow>
        ) : presences.length === 0 ? (
          <TableRow>
            <TableDataCell colSpan={6}>
              <EmptyState
                icon={<Icon icon={Fingerprint} />}
                title="Aucun pointage enregistré aujourd’hui"
                text="Les présences saisies par le service sécurité apparaîtront ici."
              />
            </TableDataCell>
          </TableRow>
        ) : (
          presences.map((presence) => (
            <TableRow key={presence.id || `${presence.matricule}-${presence.date_presence}`}>
              <TableDataCell className="fw-semibold">{valueOr(presence.matricule)}</TableDataCell>
              <TableDataCell>{formatDate(presence.date_presence)}</TableDataCell>
              <TableDataCell>{valueOr(presence.heure_arrivee, '—')}</TableDataCell>
              <TableDataCell>{valueOr(presence.heure_depart, '—')}</TableDataCell>
              <TableDataCell>
                <StatusBadge status={presence.statut} kind="presence" />
              </TableDataCell>
              <TableDataCell className="text-body-secondary">
                {valueOr(presence.observations, '—')}
              </TableDataCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableCard>
)

PresencesDuJourPanel.propTypes = {
  presences: PropTypes.array,
  loading: PropTypes.bool,
}

export default PresencesDuJourPanel
