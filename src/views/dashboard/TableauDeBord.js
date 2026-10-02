import React, { useMemo } from 'react'
import { Col, Row } from '../../ui/Grid'
import { Alarm, CalendarCheck, ChartBar, CheckCircle, Fingerprint, Folder, Gauge, Landmark, Notes, User, Users } from '../../ui/icons'import { getDossiers, getEvaluations } from '../../services/api'
import { fetchDemandeConges } from '../../services/apiConge'
import { getAllPresences } from '../../services/presenceService'
import useAsyncData from '../../hooks/useAsyncData'
import { EmptyState, PageHeader, SectionCard, StatCard, StatusBadge } from '../../components/ui'
import { getRoleConfig } from '../../config/roles'
import { getDisplayName, getStoredUser } from '../../utils/auth'
import { valueOr } from '../../utils/format'
import AnniversairesPanel from './widgets/AnniversairesPanel'
import CongesEnAttentePanel from './widgets/CongesEnAttentePanel'
import MonEspacePanel from './widgets/MonEspacePanel'
import PresencesDuJourPanel from './widgets/PresencesDuJourPanel'
import QuickActions from './widgets/QuickActions'
import RetraitesPanel from './widgets/RetraitesPanel'

// ---------------------------------------------------------------------------
//  TableauDeBord — the landing page of every role.
//  One screen, several layouts: the KPIs, the quick actions and the side panels
//  are picked from the signed-in role, so nobody sees data they are not meant
//  to see (an agent never loads the staff register).
// ---------------------------------------------------------------------------

const todayKey = () => new Date().toISOString().slice(0, 10)

const TableauDeBord = () => {
  const user = getStoredUser()
  const role = user?.role
  const config = getRoleConfig(role)
  const matricule = user?.matricule

  const seesDossiers = ['admin', 'directrice', 'chef_service'].includes(role)
  const seesPresences = ['admin', 'directrice', 'securite'].includes(role)
  const seesEvaluations = ['admin', 'directrice', 'chef_service'].includes(role)

  const { data: dossiersData, loading: dossiersLoading } = useAsyncData(() => getDossiers(), [])
  const { data: congesData, loading: congesLoading } = useAsyncData(() => fetchDemandeConges(), [])
  const { data: presencesData, loading: presencesLoading } = useAsyncData(() => getAllPresences(), [])
  const { data: evaluationsData } = useAsyncData(() => getEvaluations(), [])

  const dossiers = seesDossiers && Array.isArray(dossiersData?.data) ? dossiersData.data : []
  const conges = Array.isArray(congesData) ? congesData : []
  const presences = seesPresences && Array.isArray(presencesData?.data) ? presencesData.data : []
  const evaluations = seesEvaluations && Array.isArray(evaluationsData) ? evaluationsData : []

  const metrics = useMemo(() => {
    const today = todayKey()
    const currentYear = new Date().getFullYear()
    const todayMonth = new Date().getMonth() + 1
    const todayDay = new Date().getDate()

    const presencesToday = presences.filter((presence) => presence.date_presence === today)

    const birthdays = dossiers.filter((dossier) => {
      const birth = dossier?.InfoIdent?.dat_nat
      if (!birth) return false
      const [, month, day] = `${birth}`.split('-')
      return Number(month) === todayMonth && Number(day) === todayDay
    })

    const retirements = dossiers.filter((dossier) => {
      const departure = dossier?.InfoPro?.dat_de_depart_retraite
      return departure ? new Date(departure).getFullYear() === currentYear : false
    })

    const myConges = conges.filter((conge) => conge.matricule === matricule)
    const myEvaluations = evaluations.filter((evaluation) => evaluation?.matricule === matricule)

    return {
      total: dossiers.length,
      active: dossiers.filter((dossier) => dossier?.InfoPro?.Details?.[0]?.etat === 'Actif').length,
      pendingConges: conges.filter((conge) => conge.status === 'En attente').length,
      authorizedConges: conges.filter((conge) => conge.status === 'Autorisée').length,
      myConges: myConges.length,
      myPendingConges: myConges.filter((conge) => conge.status === 'En attente').length,
      presencesToday,
      presents: presencesToday.filter((presence) => presence.statut === 'Présent').length,
      absents: presencesToday.filter((presence) => presence.statut === 'Absent').length,
      retards: presencesToday.filter((presence) => presence.statut === 'Retard').length,
      evaluations: evaluations.length,
      myEvaluations: myEvaluations.length,
      birthdays,
      retirements,
    }
  }, [dossiers, conges, presences, evaluations, matricule])

  /* KPI tiles ------------------------------------------------------------ */
  const kpis = useMemo(() => {
    if (role === 'securite') {
      return [
        {
          key: 'presents',
          label: 'Présents',
          value: metrics.presents,
          icon: <Icon icon={CheckCircle} />,
          tone: 'success',
          to: `${config.basePath}/liste-presence`,
        },
        {
          key: 'absents',
          label: 'Absents',
          value: metrics.absents,
          icon: <Icon icon={User} />,
          tone: 'danger',
          to: `${config.basePath}/liste-presence`,
        },
        {
          key: 'retards',
          label: 'Retards',
          value: metrics.retards,
          icon: <Icon icon={Fingerprint} />,
          tone: 'warning',
          to: `${config.basePath}/liste-presence`,
        },
        {
          key: 'conges',
          label: 'Mes congés',
          value: metrics.myConges,
          hint: `${metrics.myPendingConges} en attente`,
          icon: <Icon icon={Alarm} />,
          tone: 'info',
          to: `${config.basePath}/create-conge`,
        },
      ]
    }

    if (role === 'user') {
      return [
        {
          key: 'conges',
          label: 'Mes demandes de congés',
          value: metrics.myConges,
          hint: `${metrics.myPendingConges} en attente`,
          icon: <Icon icon={Alarm} />,
          tone: 'primary',
          to: `${config.basePath}/create-conge`,
        },
        {
          key: 'evaluations',
          label: 'Mes évaluations',
          value: metrics.myEvaluations,
          hint: 'Fiches me concernant',
          icon: <Icon icon={Notes} />,
          tone: 'info',
          to: `${config.basePath}/evaluation`,
        },
        {
          key: 'profile',
          label: 'Mon dossier',
          value: 'Consulter',
          hint: 'Informations personnelles',
          icon: <Icon icon={Folder} />,
          tone: 'success',
          to: `${config.basePath}/mon-profile`,
        },
        {
          key: 'notifs',
          label: 'Notifications',
          value: 'Consulter',
          hint: 'Alertes me concernant',
          icon: <Icon icon={CalendarCheck} />,
          tone: 'secondary',
          to: `${config.basePath}/notifs`,
        },
      ]
    }

    const dossierPath =
      role === 'directrice'
        ? `${config.basePath}/dossier-list-directrice`
        : `${config.basePath}/dossier-list`
    const congePath =
      role === 'directrice'
        ? `${config.basePath}/gestion-conges/en-attente`
        : role === 'chef_service'
          ? `${config.basePath}/conge-list-chef`
          : `${config.basePath}/conge-liste`
    const evaluationPath =
      role === 'directrice'
        ? `${config.basePath}/liste-evaluationd/en-attente`
        : role === 'chef_service'
          ? `${config.basePath}/liste-evaluations`
          : `${config.basePath}/liste-evaluation`

    return [
      {
        key: 'active',
        label: 'Agents actifs',
        value: metrics.active,
        hint: `${metrics.total} dossier(s) au total`,
        icon: <Icon icon={Users} />,
        tone: 'primary',
        to: dossierPath,
      },
      {
        key: 'pending',
        label: 'Congés en attente',
        value: metrics.pendingConges,
        hint: `${metrics.authorizedConges} autorisé(s)`,
        icon: <Icon icon={Alarm} />,
        tone: 'warning',
        to: congePath,
      },
      {
        key: 'presences',
        label: 'Présents aujourd’hui',
        value: metrics.presents,
        hint: `${metrics.absents} absent(s) · ${metrics.retards} retard(s)`,
        icon: <Icon icon={CalendarCheck} />,
        tone: 'success',
        to: `${config.basePath}/liste-presence`,
      },
      {
        key: 'evaluations',
        label: 'Fiches d’évaluation',
        value: metrics.evaluations,
        icon: <Icon icon={ChartBar} />,
        tone: 'info',
        to: evaluationPath,
      },
    ]
  }, [config.basePath, metrics, role])

  const loadingKpis = dossiersLoading || congesLoading

  return (
    <div className="gp-page">
      <PageHeader
        icon={<Icon icon={Gauge} />}
        title={`Bonjour ${getDisplayName(user)}`}
        subtitle={config.description}
      />

      <Row className="g-3 mb-4">
        {kpis.map((kpi) => (
          <Col key={kpi.key} xs={12} sm={6} xl={3}>
            <StatCard
              label={kpi.label}
              value={kpi.value}
              hint={kpi.hint}
              icon={kpi.icon}
              tone={kpi.tone}
              to={kpi.to}
              loading={loadingKpis && kpi.key !== 'presences'}
            />
          </Col>
        ))}
      </Row>

      <QuickActions role={role} />

      <Row className="g-3">
        {seesDossiers ? (
          <>
            <Col xs={12} lg={6}>
              <AnniversairesPanel employees={metrics.birthdays} loading={dossiersLoading} />
            </Col>
            <Col xs={12} lg={6}>
              <RetraitesPanel employees={metrics.retirements} loading={dossiersLoading} />
            </Col>
            <Col xs={12}>
              <CongesEnAttentePanel
                conges={conges}
                loading={congesLoading}
                basePath={config.basePath}
                role={role}
              />
            </Col>
            {seesPresences ? (
              <Col xs={12}>
                <PresencesDuJourPanel presences={metrics.presencesToday} loading={presencesLoading} />
              </Col>
            ) : null}
          </>
        ) : (
          <>
            <Col xs={12} lg={7}>
              <MonEspacePanel user={user} matricule={matricule} role={role} conges={conges} />
            </Col>
            <Col xs={12} lg={5}>
              <SectionCard
                title="Mes dernières demandes"
                icon={<Icon icon={Alarm} />}
                subtitle="Suivi de vos demandes de congés"
                className="h-100"
              >
                {conges.filter((conge) => conge.matricule === matricule).length === 0 ? (
                  <EmptyState
                    icon={<Icon icon={Alarm} />}
                    title="Aucune demande de congés"
                    text="Vos futures demandes apparaîtront ici avec leur statut de validation."
                  />
                ) : (
                  <ul className="gp-list mb-0">
                    {conges
                      .filter((conge) => conge.matricule === matricule)
                      .slice(0, 5)
                      .map((conge) => (
                        <li className="gp-list__item" key={conge.id_cong}>
                          <div className="gp-min-w-0">
                            <div className="gp-list__title">
                              {valueOr(conge.type_de_conge, 'Congé annuel')}
                            </div>
                            <div className="gp-list__meta">
                              {valueOr(conge.date_debut, '—')} → {valueOr(conge.date_de_fin, '—')}
                            </div>
                          </div>
                          <StatusBadge status={conge.status} kind="conge" className="ms-auto" />
                        </li>
                      ))}
                  </ul>
                )}
              </SectionCard>
            </Col>
          </>
        )}
      </Row>

      <p className="gp-muted-note mt-4 mb-0">
        <Icon icon={Landmark} className="me-1" />
        Connecté en tant que <strong>{config.label}</strong>
        {matricule ? ` — matricule ${matricule}` : ''}
      </p>
    </div>
  )
}

export default TableauDeBord
