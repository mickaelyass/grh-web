import React from 'react'
import jsPDF from 'jspdf'
import Button from '../../ui/Button'
import Icon from '../../ui/Icon'
import { Download, User } from '../../ui/icons'
import { ErrorState, LoadingState, PageHeader } from '../../components/ui'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getDoc } from '../../services/api'
import ProfileView from './DossierComponents/ProfileView'

// ---------------------------------------------------------------------------
//  Monprofile — the connected agent's own dossier.
//  Presentation is shared with the staff view through `ProfileView`; this file
//  only owns the data fetching and the PDF export.
// ---------------------------------------------------------------------------

const formatLongDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const Monprofile = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const matricule = user ? user.matricule : ''

  const { data, loading, error, reload } = useAsyncData(() => getDoc(matricule), [matricule])
  const dossier = data?.data || null

  const handleDownloadPDF = () => {
    if (!dossier) return

    const ident = dossier.InfoIdent || {}
    const pro = dossier.InfoPro || {}
    const bank = dossier.InfoBank || {}
    const extra = dossier.InfoComplementaire || {}
    const info = dossier.Utilisateur || {}

    const mapLines = (items, format) => (items || []).map(format).join('\n')

    const content = `
      ========== PROFIL DU PERSONNEL ==========

      Nom complet: ${ident.prenom || ''} ${ident.nom || ''}
      Matricule: ${info.matricule || 'N/A'}
      Role: ${info.role || 'N/A'}

      ========= INFORMATIONS IDENTITAIRES =========
      - CNSS: ${ident.cnss || 'N/A'}
      - Sexe: ${ident.sexe || 'N/A'}
      - Date de naissance: ${formatLongDate(ident.dat_nat)}
      - Lieu de naissance: ${ident.lieu_nat || 'N/A'}
      - Situation matrimoniale: ${ident.situat_matri || 'N/A'}
      - Nom du conjoint: ${ident.nom_du_conjoint || 'N/A'}
      - Date de mariage: ${formatLongDate(ident.dat_mariage)}
      - Nombre d'enfants: ${ident.nbre_enfants ?? 'N/A'}
      - Email: ${ident.email || 'N/A'}

      ====== INFORMATIONS PROFESSIONNELLES =====
      - Statut: ${pro.statut || 'N/A'}
      - Corps: ${pro.corps || 'N/A'}
      - Categorie: ${pro.categorie || 'N/A'}
      - Branche du personnel: ${pro.branche_du_personnel || 'N/A'}
      - Poste actuel dans le service: ${pro.poste_actuel_service || 'N/A'}
      - Type de structure: ${pro.type_structure || 'N/A'}
      - Grade paye: ${pro.grade_paye || 'N/A'}
      - Indice paye: ${pro.indice_paye || 'N/A'}
      - Date de premiere prise de service: ${formatLongDate(pro.dat_first_prise_de_service)}
      - Date de depart en retraite: ${formatLongDate(pro.dat_de_depart_retraite)}
      - Responsabilites particulieres: ${pro.responsabilite_partiuliere || 'N/A'}
      - Nomination: ${pro.ref_nomination || 'N/A'}

      Postes anterieurs:
      ${mapLines(pro.PosteAnterieurs, (poste) => `      - ${poste.nom_poste} (Du: ${formatLongDate(poste.date_debut)} Au: ${formatLongDate(poste.date_fin)})\n        Institution: ${poste.institution || 'N/A'}`)}

      Diplomes:
      ${mapLines(pro.Diplomes, (diplome) => `      - ${diplome.nom_diplome} (Date d'obtention: ${formatLongDate(diplome.date_obtention)})\n        Institution: ${diplome.institution || 'N/A'}`)}

      ========= INFORMATIONS BANCAIRES =========
      - RIB: ${bank.rib || 'N/A'}
      - Comptes mobiles:
        - MTN: ${bank.mtn || 'N/A'}
        - Celtis: ${bank.celtics || 'N/A'}
        - Moov: ${bank.moov || 'N/A'}

      ===== INFORMATIONS COMPLEMENTAIRES =====
      - Observations particulieres: ${extra.observation_particuliere || 'N/A'}
      - Situation sanitaire: ${extra.situat_sante || 'N/A'}

      Sanctions:
      ${mapLines(extra.Sanctions, (sanction) => `      - Nature: ${sanction.nature_sanction || 'N/A'}\n        Sanction punitive: ${sanction.sanction_punitive || 'N/A'}`)}

      Distinctions:
      ${mapLines(extra.Distinctions, (distinction) => `      - Reference: ${distinction.ref_distinction || 'N/A'}\n        Details: ${distinction.detail_distinction || 'N/A'}`)}

      Details:
      ${mapLines(pro.Details, (detail) => `      - Matricule: ${detail.matricule || 'N/A'}\n        Etat: ${detail.etat || 'N/A'}\n        Poste actuel: ${detail.poste_actuel || 'N/A'}\n        Nouveau poste: ${detail.nouveau_poste || 'N/A'}\n        Date de prise de fonction: ${formatLongDate(detail.date_prise_fonction)}\n        Date de changement: ${formatLongDate(detail.date_changement)}\n        Motif du changement: ${detail.motif_changement || 'N/A'}`)}

      =========================================
    `

    const doc = new jsPDF()
    let yPosition = 10
    const pageHeight = doc.internal.pageSize.height
    const maxHeightPerPage = pageHeight - 15

    const splitText = doc.splitTextToSize(content, 160)
    splitText.forEach((line) => {
      if (yPosition + 6 > maxHeightPerPage) {
        doc.addPage()
        yPosition = 10
      }
      doc.text(10, yPosition, line)
      yPosition += 6
    })

    doc.save(`Dossier_${ident.prenom || ''}_${ident.nom || ''}.pdf`)
  }

  if (!matricule) {
    return (
      <div className="gp-page">
        <PageHeader
          icon={<Icon icon={User} />}
          title="Mon profil"
          subtitle="Votre dossier personnel"
        />
        <ErrorState
          title="Aucun compte connecté"
          error={{
            message: 'Votre session ne contient aucun matricule. Veuillez vous reconnecter.',
          }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="gp-page">
        <PageHeader
          icon={<Icon icon={User} />}
          title="Mon profil"
          subtitle="Votre dossier personnel"
        />
        <LoadingState label="Chargement de votre dossier…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="gp-page">
        <PageHeader
          icon={<Icon icon={User} />}
          title="Mon profil"
          subtitle="Votre dossier personnel"
        />
        <ErrorState
          title="Aucun dossier n'est associé à ce matricule"
          error={error}
          onRetry={reload}
        />
      </div>
    )
  }

  return (
    <div className="gp-page">
      <PageHeader
        icon={<Icon icon={User} />}
        title="Mon profil"
        subtitle={
          dossier?.Utilisateur?.matricule
            ? `Dossier personnel — matricule ${dossier.Utilisateur.matricule}`
            : 'Votre dossier personnel et votre parcours administratif'
        }
        actions={
          <Button color="primary" onClick={handleDownloadPDF}>
            <Icon icon={Download} className="me-2" />
            Télécharger en PDF
          </Button>
        }
      />

      {dossier ? <ProfileView dossier={dossier} /> : null}
    </div>
  )
}

export default Monprofile
