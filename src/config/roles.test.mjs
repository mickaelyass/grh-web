// Test de la logique des rôles, SANS navigateur ni React.
// Il rejoue les règles réellement écrites dans les fichiers corrigés
// (config/roles.js, RequireRole, Login, TableauDeBord, routesForRole).
// Usage : node src/config/roles.test.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ici = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(ici, 'roles.js'), 'utf8')

// --- 1. normalizeRole : extrait et exécute le vrai code du fichier ----------
const m = src.match(
  /const ROLE_ALIASES = (\{[^}]*\})[\s\S]*?export const normalizeRole = \(role\) => ([^\n]+)/
)
if (!m) {
  console.error('ECHEC: normalizeRole introuvable dans roles.js')
  process.exit(1)
}
const DEFAULT_ROLE = 'user'
const ROLE_ALIASES = eval('(' + m[1] + ')')
const normalizeRole = eval(`(role) => (${m[2]})`)

let ko = 0
const check = (libelle, reel, attendu) => {
  const ok = reel === attendu
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${JSON.stringify(reel)} (attendu ${JSON.stringify(attendu)})`)
}

console.log('== normalizeRole ==')
check('employe (rôle API)', normalizeRole('employe'), 'user')
check('admin inchange', normalizeRole('admin'), 'admin')
check('chef_service inchange', normalizeRole('chef_service'), 'chef_service')
check('directrice inchange', normalizeRole('directrice'), 'directrice')
check('securite inchange', normalizeRole('securite'), 'securite')
check('role inconnu', normalizeRole('gardien'), 'gardien')
check('role absent -> defaut', normalizeRole(undefined), 'user')
check('chaine vide -> defaut', normalizeRole(''), 'user')

// --- 2. RequireRole : la boucle infinie est-elle cassee ? -------------------
// Le workspace /user/* est monte avec role='user' (voir App.js).
console.log('== RequireRole (garde /user/*) ==')
const homePathFor = (r) => (normalizeRole(r) === 'admin' ? '/admin/dashboard' : '/user/dashboard')
const guard = (storedRole, routeRole) =>
  storedRole && routeRole && normalizeRole(storedRole) !== routeRole
    ? homePathFor(storedRole)
    : 'RENDU'
check('employe sur /user/* -> rendu (plus de boucle)', guard('employe', 'user'), 'RENDU')
check('admin sur /user/* -> redirige /admin', guard('admin', 'user'), '/admin/dashboard')
check('user sur /user/* -> rendu', guard('user', 'user'), 'RENDU')

// --- 3. Login : destination apres connexion (switch de Login.js) -----------
console.log('== Login (destination) ==')
const dest = (apiRole) => {
  const role = normalizeRole(apiRole)
  switch (role) {
    case 'admin': return '/admin/dashboard'
    case 'chef_service': return '/chef-service/dashboard'
    case 'directrice': return '/directrice/dashboard'
    case 'securite': return '/securite/dashboard'
    case 'user':
    default: return '/user/dashboard'
  }
}
check('connexion compte employe', dest('employe'), '/user/dashboard')
check('connexion admin', dest('admin'), '/admin/dashboard')
check('connexion directrice', dest('directrice'), '/directrice/dashboard')

// --- 4. TableauDeBord : KPI de l'espace agent ------------------------------
console.log('== TableauDeBord (KPIs agent) ==')
const kpiAgent = (apiRole) => (normalizeRole(apiRole) === 'user' ? 'KPIS_AGENT' : 'KPIS_ADMIN')
check('compte employe voit son espace', kpiAgent('employe'), 'KPIS_AGENT')
check('compte admin voit le pilotage', kpiAgent('admin'), 'KPIS_ADMIN')

// --- 5. routesForRole : sidebar via getCurrentRole -------------------------
console.log('== Sidebar (routesForRole) ==')
const ROUTE_TABLES = {
  admin: 'ADMIN_ROUTES', directrice: 'D', chef_service: 'C', securite: 'S', user: 'USER_ROUTES',
}
const routesForRole = (role) => ROUTE_TABLES[normalizeRole(role)] || 'USER_ROUTES'
check('sidebar du nouvel agent', routesForRole('employe'), 'USER_ROUTES')
check('sidebar admin', routesForRole('admin'), 'ADMIN_ROUTES')

// --- 6. NotificationBell : inbox de l'agent --------------------------------
console.log('== Notifications (inbox) ==')
const notificationsPathFor = (r) =>
  normalizeRole(r) === 'user' ? '/user/notifs' : '/admin/notifs-admin'
check('inbox du nouvel agent', notificationsPathFor('employe'), '/user/notifs')

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
