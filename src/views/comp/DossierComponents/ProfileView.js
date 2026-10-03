import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from '../../../ui/Grid'
import Icon from '../../../ui/Icon'
import {
  Award,
  Briefcase,
  Calendar,
  CalendarCheck,
  Fingerprint,
  GraduationCap,
  Landmark,
  ListIcon,
  Stethoscope,
  User,
  Warning,
} from '../../../ui/icons'
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../../ui/Table'
import {
  Avatar,
  EmptyState,
  SectionCard,
  StatCard,
  StatusBadge,
  TableCard,
} from '../../../components/ui'
import {
  ageFrom,
  definitionList,
  formatDate,
  fullName,
  hasValue,
  valueOr,
} from '../../../utils/format'

// ============================================================================
//  ProfileView — the shared, professional rendering of a `dossier`.
//  Used by "Mon profil" (self) and "Détail de l'agent" (staff): same rhythm,
//  same components, same label/value language for every profile screen.
// ============================================================================

const EMPTY = '—'
const SEXE_LABELS = { M: 'Homme', F: 'Femme' }

/** Keeps only present values so the `.gp-dl` grid never shows useless rows. */
const or = (value) => (hasValue(value) ? value : '')
const dateOr = (value) => formatDate(value, '')

const DefinitionList = ({ rows }) => {
  const entries = definitionList(rows)

  if (!entries.length) {
    return <p className="gp-muted-note mb-0">Aucune information renseignée pour le moment.</p>
  }

  return (
    <dl className="gp-dl mb-0">
      {entries.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

DefinitionList.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any }))
    .isRequired,
}

/** Small table used by the record lists of a profile (diplomas, history…). */
const RecordsTable = ({ title, icon, columns, records, emptyTitle, emptyText }) => (
  <TableCard title={title} icon={icon} count={records.length} className="h-100">
    {records.length === 0 ? (
      <EmptyState icon={icon} title={emptyTitle} text={emptyText} />
    ) : (
      <Table hover>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.key}>
              {record.cells.map((cell, index) => (
                <TableDataCell key={index}>{cell}</TableDataCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </TableCard>
)

RecordsTable.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  records: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
  ).isRequired,
  emptyTitle: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
}

// ---------------------------------------------------------------------------
//  Label/value rows (empty values are dropped by `definitionList`)
// ---------------------------------------------------------------------------
const identityRows = (ident) => [
  { label: 'CNSS', value: ident.cnss },
  {
    label: 'Sexe',
    value:
      SEXE_LABELS[
        String(ident.sexe || '')
          .trim()
          .toUpperCase()
      ] || or(ident.sexe),
  },
  { label: 'Date de naissance', value: dateOr(ident.dat_nat) },
  { label: 'Lieu de naissance', value: ident.lieu_nat },
  { label: 'Situation matrimoniale', value: ident.situat_matri },
  { label: 'Email', value: ident.email },
  { label: 'Nom du conjoint', value: ident.nom_du_conjoint },
  { label: 'Date de mariage', value: dateOr(ident.dat_mariage) },
  { label: "Nombre d'enfants", value: or(ident.nbre_enfants) },
]

const professionalRows = (pro) => [
  { label: 'Statut', value: pro.statut },
  { label: 'Corps', value: pro.corps },
  { label: 'Catégorie', value: pro.categorie },
  { label: 'Branche du personnel', value: pro.branche_du_personnel },
  { label: 'Fonctions', value: pro.fonctions },
  { label: 'Poste / service actuel', value: pro.poste_actuel_service },
  { label: 'Poste spécifique', value: pro.poste_specifique },
  { label: 'Type de structure', value: pro.type_structure },
  { label: 'Grade payé', value: pro.grade_paye },
  { label: 'Indice payé', value: pro.indice_paye },
  { label: 'Zone sanitaire', value: pro.zone_sanitaire },
  { label: 'Responsabilités particulières', value: pro.responsabilite_partiuliere },
]

const careerRows = (pro) => [
  { label: 'Date de prise de fonction', value: dateOr(pro.dat_prise_fonction) },
  { label: 'Première prise de service', value: dateOr(pro.dat_first_prise_de_service) },
  {
    label: 'Prise de service dans le département',
    value: dateOr(pro.dat_de_prise_service_dans_departement),
  },
  { label: 'Départ à la retraite', value: dateOr(pro.dat_de_depart_retraite) },
  { label: 'Référence de nomination', value: pro.ref_nomination },
  { label: 'Jours de congé disponibles', value: or(pro.nombre_jour_conges_disponible) },
]

const bankRows = (bank) => [
  { label: 'RIB', value: bank.rib },
  { label: 'MTN', value: bank.mtn },
  { label: 'Celtics', value: bank.celtics },
  { label: 'Moov', value: bank.moov },
  { label: 'Libercom', value: bank.libercom },
]

const healthRows = (extra) => [
  { label: 'Situation sanitaire', value: extra.situat_sante },
  { label: 'Observation particulière', value: extra.observation_particuliere },
]

// ---------------------------------------------------------------------------
//  Record tables
// ---------------------------------------------------------------------------
const buildRecords = (items, prefix, buildCells) =>
  (items || []).map((item, index) => ({
    key: item?.id ?? `${prefix}-${index}`,
    cells: buildCells(item || {}),
  }))

const twoLinesCell = (main, meta) => (
  <div className="gp-min-w-0">
    <div>{valueOr(main)}</div>
    <div className="gp-list__meta">{valueOr(meta)}</div>
  </div>
)

const ProfileView = ({ dossier }) => {
  const ident = dossier?.InfoIdent || {}
  const pro = dossier?.InfoPro || {}
  const bank = dossier?.InfoBank || {}
  const extra = dossier?.InfoComplementaire || {}
  const utilisateur = dossier?.Utilisateur || {}

  const diplomes = pro.Diplomes || []
  const postes = pro.PosteAnterieurs || []
  const parcours = pro.Details || []
  const distinctions = extra.Distinctions || []
  const sanctions = extra.Sanctions || []

  const name = fullName(ident, 'Agent')
  const age = ageFrom(ident.dat_nat)
  const birthDate = dateOr(ident.dat_nat)
  const etat = parcours[0]?.etat
  const conges = pro.nombre_jour_conges_disponible

  return (
    <>
      {/* Identity hero */}
      <Row className="g-3 mb-3">
        <Col xs={12}>
          <SectionCard className="h-100">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Avatar name={name} size="xl" />
              <div className="gp-grow">
                <p className="gp-section-name mb-0">{name}</p>
                <p className="gp-page-subtitle mb-1">
                  {valueOr(pro.poste_actuel_service, 'Poste non renseigné')}
                  {pro.fonctions ? ` · ${pro.fonctions}` : ''}
                </p>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  {utilisateur.matricule ? (
                    <span className="gp-badge gp-soft-primary">
                      <Icon icon={Fingerprint} size="xs" />
                      Matricule {utilisateur.matricule}
                    </span>
                  ) : null}
                  <StatusBadge status={utilisateur.role} kind="role" />
                  {etat ? <StatusBadge status={etat} kind="dossier" /> : null}
                </div>
              </div>
            </div>
          </SectionCard>
        </Col>
      </Row>

      {/* Key figures */}
      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} xl={3}>
          <StatCard
            label="Âge"
            value={age !== null ? `${age} ans` : EMPTY}
            hint={birthDate || undefined}
            icon={<Icon icon={User} />}
            tone="info"
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCard
            label="Congés disponibles"
            value={hasValue(conges) ? `${conges} jours` : EMPTY}
            hint="solde actuel"
            icon={<Icon icon={CalendarCheck} />}
            tone="success"
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCard
            label="Diplômes"
            value={diplomes.length}
            hint="au dossier"
            icon={<Icon icon={GraduationCap} />}
            tone="primary"
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCard
            label="Postes antérieurs"
            value={postes.length}
            hint={parcours.length ? `${parcours.length} changement(s)` : undefined}
            icon={<Icon icon={Briefcase} />}
            tone="secondary"
          />
        </Col>
      </Row>

      {/* Identity & career */}
      <Row className="g-3 mb-3">
        <Col xs={12} lg={6}>
          <SectionCard
            title="Informations identitaires"
            icon={<Icon icon={User} />}
            className="h-100"
          >
            <DefinitionList rows={identityRows(ident)} />
          </SectionCard>
        </Col>
        <Col xs={12} lg={6}>
          <SectionCard
            title="Situation professionnelle"
            icon={<Icon icon={Briefcase} />}
            className="h-100"
          >
            <DefinitionList rows={professionalRows(pro)} />
          </SectionCard>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col xs={12} lg={6}>
          <SectionCard title="Dates de carrière" icon={<Icon icon={Calendar} />} className="h-100">
            <DefinitionList rows={careerRows(pro)} />
          </SectionCard>
        </Col>
        <Col xs={12} lg={6}>
          <SectionCard
            title="Coordonnées bancaires"
            icon={<Icon icon={Landmark} />}
            className="h-100"
          >
            <DefinitionList rows={bankRows(bank)} />
          </SectionCard>
        </Col>
      </Row>

      {/* Health, distinctions, sanctions */}
      <Row className="g-3 mb-3">
        <Col xs={12} lg={4}>
          <SectionCard
            title="Santé & observations"
            icon={<Icon icon={Stethoscope} />}
            className="h-100"
          >
            <DefinitionList rows={healthRows(extra)} />
          </SectionCard>
        </Col>
        <Col xs={12} lg={4}>
          <RecordsTable
            title="Distinctions"
            icon={<Icon icon={Award} />}
            columns={['Référence', 'Détail']}
            records={buildRecords(distinctions, 'distinction', (item) => [
              valueOr(item.ref_distinction),
              valueOr(item.detail_distinction),
            ])}
            emptyTitle="Aucune distinction"
            emptyText="Les décorations et félicitations apparaîtront ici."
          />
        </Col>
        <Col xs={12} lg={4}>
          <RecordsTable
            title="Sanctions"
            icon={<Icon icon={Warning} />}
            columns={['Nature', 'Sanction']}
            records={buildRecords(sanctions, 'sanction', (item) => [
              valueOr(item.nature_sanction),
              valueOr(item.sanction_punitive),
            ])}
            emptyTitle="Aucune sanction"
            emptyText="Aucune sanction disciplinaire n'est enregistrée."
          />
        </Col>
      </Row>

      {/* Training & previous positions */}
      <Row className="g-3 mb-3">
        <Col xs={12} lg={6}>
          <RecordsTable
            title="Diplômes"
            icon={<Icon icon={GraduationCap} />}
            columns={['Diplôme', 'Institution', "Date d'obtention"]}
            records={buildRecords(diplomes, 'diplome', (item) => [
              valueOr(item.nom_diplome),
              valueOr(item.institution),
              formatDate(item.date_obtention),
            ])}
            emptyTitle="Aucun diplôme"
            emptyText="Les qualifications de l'agent apparaîtront ici."
          />
        </Col>
        <Col xs={12} lg={6}>
          <RecordsTable
            title="Postes antérieurs"
            icon={<Icon icon={Briefcase} />}
            columns={['Poste', 'Institution', 'Du', 'Au']}
            records={buildRecords(postes, 'poste', (item) => [
              valueOr(item.nom_poste),
              valueOr(item.institution),
              formatDate(item.date_debut),
              formatDate(item.date_fin),
            ])}
            emptyTitle="Aucun poste antérieur"
            emptyText="Les affectations précédentes apparaîtront ici."
          />
        </Col>
      </Row>

      {/* Career history */}
      <Row className="g-3">
        <Col xs={12}>
          <RecordsTable
            title="Parcours professionnel"
            icon={<Icon icon={ListIcon} />}
            columns={[
              'État',
              'Date de changement',
              'Type',
              'Poste / service',
              'Nouveau poste / service',
              'Motif',
            ]}
            records={buildRecords(parcours, 'detail', (item) => [
              <StatusBadge key="etat" status={item.etat} kind="dossier" />,
              formatDate(item.date_changement),
              valueOr(item.type_changement),
              twoLinesCell(item.poste_actuel, item.service_actuel),
              twoLinesCell(item.nouveau_poste, item.nouveau_service),
              valueOr(item.motif_changement),
            ])}
            emptyTitle="Aucun changement enregistré"
            emptyText="L'historique des mutations, détachements et mises en disponibilité apparaîtra ici."
          />
        </Col>
      </Row>
    </>
  )
}

ProfileView.propTypes = {
  dossier: PropTypes.object.isRequired,
}

export default ProfileView
