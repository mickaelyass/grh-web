import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Alarm, Bell, ChartBar, Folder, Plus, User, Users } from '../../../ui/icons'// ---------------------------------------------------------------------------
//  QuickActions — the "what do I do next?" tiles of the dashboard.
//  Actions are declared per role so the tiles are always relevant.
// ---------------------------------------------------------------------------

const ACTIONS = {
  admin: [
    { to: '/admin/create-dossier', label: 'Nouveau dossier', hint: 'Ouvrir un dossier agent', icon: Plus },
    { to: '/admin/dossier-list', label: 'Consulter les dossiers', hint: 'Rechercher un agent', icon: Folder },
    { to: '/admin/utilisateur-list', label: 'Comptes utilisateurs', hint: 'Rôles et accès', icon: Users },
    { to: '/admin/conge-liste', label: 'Demandes de congés', hint: 'Suivi des validations', icon: Alarm },
  ],
  directrice: [
    { to: '/directrice/gestion-conges/en-attente', label: 'Congés en attente', hint: 'À valider', icon: Alarm },
    { to: '/directrice/liste-evaluationd/en-attente', label: 'Évaluations', hint: 'À apprécier', icon: ChartBar },
    { to: '/directrice/dossier-list-directrice', label: 'Dossiers', hint: 'Consulter un agent', icon: Folder },
    { to: '/directrice/notifs-directrice', label: 'Notifications', hint: 'Dernières alertes', icon: Bell },
  ],
  chef_service: [
    { to: '/chef-service/create-conge-chef', label: 'Soumettre un congé', hint: 'Ma demande', icon: Plus },
    { to: '/chef-service/conge-list-chef', label: 'Demandes du service', hint: 'Valider les congés', icon: Alarm },
    { to: '/chef-service/liste-evaluations', label: 'Évaluations', hint: 'Apprécier mes agents', icon: ChartBar },
    { to: '/chef-service/mon-profile-chef', label: 'Mon profil', hint: 'Mon dossier', icon: User },
  ],
  securite: [
    { to: '/securite/create-presence', label: 'Pointage du jour', hint: 'Enregistrer les présences', icon: User },
    { to: '/securite/liste-presence', label: 'Historique', hint: 'Consulter les présences', icon: Folder },
    { to: '/securite/create-conge', label: 'Soumettre un congé', hint: 'Ma demande', icon: Plus },
    { to: '/securite/notifs', label: 'Notifications', hint: 'Dernières alertes', icon: Bell },
  ],
  user: [
    { to: '/user/mon-profile', label: 'Mon profil', hint: 'Mes informations', icon: User },
    { to: '/user/create-conge', label: 'Soumettre un congé', hint: 'Nouvelle demande', icon: Plus },
    { to: '/user/evaluation', label: 'Mon évaluation', hint: 'Ma fiche', icon: ChartBar },
    { to: '/user/notifs', label: 'Notifications', hint: 'Mes alertes', icon: Bell },
  ],
}

const QuickActions = ({ role }) => {
  const actions = ACTIONS[role] || ACTIONS.user

  return (
    <section className="mb-4">
      <h2 className="gp-section-title">Actions rapides</h2>
      <div className="row g-3">
        {actions.map((action) => (
          <div className="col-12 col-sm-6 col-xl-3" key={action.to}>
            <Link className="gp-quick-action" to={action.to}>
              <span className="gp-stat__icon gp-tint-primary" aria-hidden="true">
                <Icon icon={action.icon} />
              </span>
              <span className="gp-min-w-0">
                <span className="gp-quick-action__label d-block">{action.label}</span>
                <span className="gp-quick-action__hint d-block">{action.hint}</span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

QuickActions.propTypes = {
  role: PropTypes.string,
}

export default React.memo(QuickActions)
