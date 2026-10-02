import React from 'react'
import PropTypes from 'prop-types'
import { BirthdayCake } from '../../../ui/icons'import { Avatar, SectionCard } from '../../../components/ui'
import { ageFrom, formatDate, fullName, valueOr } from '../../../utils/format'

// ---------------------------------------------------------------------------
//  AnniversairesPanel — agents celebrating their birthday today.
// ---------------------------------------------------------------------------
const AnniversairesPanel = ({ employees = [], loading = false }) => (
  <SectionCard
    title="Anniversaires du jour"
    icon={<Icon icon={BirthdayCake} />}
    subtitle="Pensez à présenter vos vœux"
    className="h-100"
  >
    {loading ? (
      <span className="gp-skeleton gp-skeleton--row" aria-hidden="true" />
    ) : employees.length === 0 ? (
      <p className="gp-panel-empty mb-0">Aucun anniversaire aujourd’hui.</p>
    ) : (
      <ul className="gp-list mb-0">
        {employees.map((employee) => (
          <li className="gp-list__item" key={employee.id_dossier || employee.matricule}>
            <Avatar name={fullName(employee.InfoIdent)} size="sm" />
            <div className="gp-min-w-0">
              <div className="gp-list__title">{fullName(employee.InfoIdent)}</div>
              <div className="gp-list__meta">
                {valueOr(employee.InfoPro?.poste_actuel_service)} · {ageFrom(employee.InfoIdent?.dat_nat)}{' '}
                ans · né(e) le {formatDate(employee.InfoIdent?.dat_nat)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
)

AnniversairesPanel.propTypes = {
  employees: PropTypes.array,
  loading: PropTypes.bool,
}

export default AnniversairesPanel
