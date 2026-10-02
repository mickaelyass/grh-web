import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '../../../ui/Button'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import { Alarm, ArrowRight } from '../../../ui/icons'import { EmptyState, StatusBadge, TableCard } from '../../../components/ui'
import { formatDate, valueOr } from '../../../utils/format'

// ---------------------------------------------------------------------------
//  CongesEnAttentePanel — first pending leave requests, with the direct link to
//  the decision screen of the signed-in role.
// ---------------------------------------------------------------------------
const DECISION_PATH = {
  chef_service: '/chef-service/chef-demande',
  directrice: '/directrice/directrice-demande',
}

const CongesEnAttentePanel = ({ conges = [], loading = false, basePath, role }) => {
  const pending = conges.filter((conge) => conge.status === 'En attente').slice(0, 6)
  const decisionBase = DECISION_PATH[role]

  return (
    <TableCard
      title="Demandes de congés en attente"
      icon={<Icon icon={Alarm} />}
      count={pending.length}
      subtitle="Les demandes les plus récentes à traiter"
      actions={
        role === 'admin' ? (
          <Button as={Link} to={`${basePath}/conge-liste`} size="sm" color="primary" variant="outline">
            Tout voir
          </Button>
        ) : null
      }
    >
      <Table hover responsive className="mb-0">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Matricule</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Période</TableHeaderCell>
            <TableHeaderCell>Année</TableHeaderCell>
            <TableHeaderCell>Statut</TableHeaderCell>
            {decisionBase ? <TableHeaderCell className="text-end">Action</TableHeaderCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableDataCell colSpan={6}>
                <span className="gp-skeleton gp-skeleton--row" aria-hidden="true" />
              </TableDataCell>
            </TableRow>
          ) : pending.length === 0 ? (
            <TableRow>
              <TableDataCell colSpan={6}>
                <EmptyState
                  icon={<Icon icon={Alarm} />}
                  title="Aucune demande en attente"
                  text="Toutes les demandes de congés ont été traitées."
                />
              </TableDataCell>
            </TableRow>
          ) : (
            pending.map((conge) => (
              <TableRow key={conge.id_cong}>
                <TableDataCell className="fw-semibold">{valueOr(conge.matricule)}</TableDataCell>
                <TableDataCell>{valueOr(conge.type_de_conge, 'Congé annuel')}</TableDataCell>
                <TableDataCell>
                  {formatDate(conge.date_debut)} → {formatDate(conge.date_de_fin)}
                </TableDataCell>
                <TableDataCell>{valueOr(conge.annee_jouissance)}</TableDataCell>
                <TableDataCell>
                  <StatusBadge status={conge.status} kind="conge" />
                </TableDataCell>
                {decisionBase ? (
                  <TableDataCell className="text-end">
                    <Button
                      as={Link}
                      to={`${decisionBase}/${conge.id_cong}`}
                      size="sm"
                      color="primary"
                      variant="outline"
                    >
                      Traiter
                      <Icon icon={ArrowRight} className="ms-1" />
                    </Button>
                  </TableDataCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}

CongesEnAttentePanel.propTypes = {
  conges: PropTypes.array,
  loading: PropTypes.bool,
  basePath: PropTypes.string,
  role: PropTypes.string,
}

export default CongesEnAttentePanel
