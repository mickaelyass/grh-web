import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../../ui/Button'
import Icon from '../../../ui/Icon'
import { ArrowLeft, User } from '../../../ui/icons'
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../../components/ui'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { getDossier } from '../../../services/api'
import { fullName } from '../../../utils/format'
import ProfileView from './ProfileView'

// ---------------------------------------------------------------------------
//  Profile — dossier of an agent, opened by the staff (directrice, chef…).
//  Same presentation as "Mon profil" through `ProfileView`; only the endpoint
//  (`GET /api/dossiers/:id`) and the header actions differ.
// ---------------------------------------------------------------------------
const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error, reload } = useAsyncData(() => getDossier(id), [id])
  const dossier = data?.data || null

  const header = (
    <PageHeader
      icon={<Icon icon={User} />}
      title={dossier ? `Profil de ${fullName(dossier.InfoIdent, 'Agent')}` : 'Détail de l’agent'}
      subtitle={
        dossier?.Utilisateur?.matricule
          ? `Dossier administratif — matricule ${dossier.Utilisateur.matricule}`
          : 'Dossier administratif de l’agent'
      }
      actions={
        <Button color="light" variant="outline" onClick={() => navigate(-1)}>
          <Icon icon={ArrowLeft} className="me-2" />
          Retour
        </Button>
      }
    />
  )

  if (loading) {
    return (
      <div className="gp-page">
        {header}
        <LoadingState label="Chargement du dossier…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="gp-page">
        {header}
        <ErrorState title="Impossible de charger ce dossier" error={error} onRetry={reload} />
      </div>
    )
  }

  if (!dossier) {
    return (
      <div className="gp-page">
        {header}
        <EmptyState
          icon={<Icon icon={User} />}
          title="Aucun dossier trouvé"
          text="Ce dossier n’existe pas ou a été supprimé."
        />
      </div>
    )
  }

  return (
    <div className="gp-page">
      {header}
      <ProfileView dossier={dossier} />
    </div>
  )
}

export default Profile
