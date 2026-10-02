import React from 'react'
import PropTypes from 'prop-types'
import { Landmark } from '../../../ui/icons'import { Avatar, SectionCard } from '../../../components/ui'
import { formatDate, fullName, valueOr } from '../../../utils/format'

// ---------------------------------------------------------------------------
//  RetraitesPanel — agents whose retirement falls in the current year.
// ---------------------------------------------------------------------------
const RetraitesPanel = ({ employees = [], loading = false }) => (
  <SectionCard
    title="Départs à la retraite"
    icon={<Icon icon={Landmark} />}
    subtitle={`Agents concernés en ${new Date().getFullYear()}`}
    className="h-100"
  >
    {loading ? (
      <span className="gp-skeleton gp-skeleton--row" aria-hidden="true" />
    ) : employees.length === 0 ? (
      <p className="gp-panel-empty mb-0">Aucun départ à la retraite cette année.</p>
    ) : (
      <ul className="gp-list mb-0">
        {employees.map((employee) => (
          <li className="gp-list__item" key={employee.id_dossier || employee.matricule}>
            <Avatar name={fullName(employee.InfoIdent)} size="sm" tone="muted" />
            <div className="gp-min-w-0">
              <div className="gp-list__title">{fullName(employee.InfoIdent)}</div>
              <div className="gp-list__meta">
                {valueOr(employee.InfoPro?.poste_actuel_service)} · départ prévu le{' '}
                {formatDate(employee.InfoPro?.dat_de_depart_retraite)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
)

RetraitesPanel.propTypes = {
  employees: PropTypes.array,
  loading: PropTypes.bool,
}

export default RetraitesPanel
