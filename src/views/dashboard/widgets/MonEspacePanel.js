import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '../../../ui/Button'
import { Col, Row } from '../../../ui/Grid'
import { Alarm, ArrowRight, CheckCircle, User } from '../../../ui/icons'import { Avatar, SectionCard } from '../../../components/ui'
import { getRoleConfig } from '../../../config/roles'
import { getDisplayName } from '../../../utils/auth'

// ---------------------------------------------------------------------------
//  MonEspacePanel — personal summary of an agent / security officer.
// ---------------------------------------------------------------------------
const MonEspacePanel = ({ user, matricule, role, conges = [] }) => {
  const config = getRoleConfig(role)
  const mine = conges.filter((conge) => conge.matricule === matricule)
  const pending = mine.filter((conge) => conge.status === 'En attente').length
  const authorized = mine.filter((conge) => conge.status === 'Autorisée').length

  return (
    <SectionCard title="Mon espace" icon={<Icon icon={User} />} subtitle={config.description} className="h-100">
      <div className="d-flex align-items-center gap-3 mb-3">
        <Avatar name={getDisplayName(user)} size="xl" />
        <div className="gp-min-w-0">
          <p className="gp-section-name mb-0">{getDisplayName(user)}</p>
          <p className="gp-page-subtitle mb-1">{config.label}</p>
          {matricule ? <span className="gp-badge gp-soft-primary">Matricule {matricule}</span> : null}
        </div>
      </div>

      <Row className="g-3">
        <Col xs={6}>
          <div className="gp-mini-stat">
            <span className="gp-stat__label">Mes demandes</span>
            <span className="gp-mini-stat__value">{mine.length}</span>
          </div>
        </Col>
        <Col xs={6}>
          <div className="gp-mini-stat">
            <span className="gp-stat__label">En attente</span>
            <span className="gp-mini-stat__value">{pending}</span>
          </div>
        </Col>
      </Row>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button as={Link} to={`${config.basePath}/create-conge`} color="primary" size="sm">
          <Icon icon={Alarm} className="me-2" />
          Demander un congé
        </Button>
        <Button as={Link} to={config.profilePath} color="light" size="sm" className="border">
          <Icon icon={ArrowRight} className="me-2" />
          Mon dossier
        </Button>
      </div>

      {authorized > 0 ? (
        <p className="gp-muted-note mb-0 mt-3">
          <Icon icon={CheckCircle} className="me-1 text-success" />
          {authorized} congé(s) autorisé(s) enregistré(s) sur votre dossier.
        </p>
      ) : null}
    </SectionCard>
  )
}

MonEspacePanel.propTypes = {
  user: PropTypes.object,
  matricule: PropTypes.string,
  role: PropTypes.string,
  conges: PropTypes.array,
}

export default MonEspacePanel
