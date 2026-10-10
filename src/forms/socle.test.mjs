// Test du socle formulaires, SANS navigateur ni React.
// Il rejoue la logique pure de src/forms/ : extraction des messages d'erreur
// (le point qui manquait le plus : un echec serveur reste invisible aujourd'hui)
// et la normalisation des champs facultatifs.
// Usage : node src/forms/socle.test.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ici = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(ici, 'useFormErrors.js'), 'utf8')

// --- 1. extractErrorMessage : le vrai code, extrait du fichier --------------
// On isole le corps de la fonction en decoupant sur sa signature et sur le
// `export` suivant, puis on le reconstruit en vraie fonction executable.
const debut = src.indexOf('export function extractErrorMessage')
const fin = src.indexOf('\nexport ', debut + 10)
if (debut === -1 || fin === -1) {
  console.error('ECHEC: extractErrorMessage introuvable')
  process.exit(1)
}
const signature = src.slice(debut, fin).replace('export function', 'function')
// eslint-disable-next-line no-new-func
const usine = new Function(`${signature}; return extractErrorMessage;`)
const extractErrorMessage = usine()

let ko = 0
const check = (libelle, reel, attendu) => {
  const ok = reel === attendu
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${JSON.stringify(reel)}`)
}

console.log('== extractErrorMessage : les 4 cas couverts ==')

// a) Message applicatif du backend : { error: '...' }
check("backend { error }", extractErrorMessage({ response: { data: { error: 'Matricule déjà utilisé' } } }), 'Matricule déjà utilisé')

// b) Message applicatif du backend : { message: '...' }
check("backend { message }", extractErrorMessage({ response: { data: { message: 'Session expirée' } } }), 'Session expirée')

// c) Validation champ par champ (express-validator / Joi)
check(
  'validation par champ',
  extractErrorMessage({ response: { data: { errors: [{ msg: 'Le CNSS est requis' }] } } }),
  'Le CNSS est requis',
)
check(
  'validation en texte simple',
  extractErrorMessage({ response: { data: { errors: ['Champ manquant'] } } }),
  'Champ manquant',
)

// d) Serveur injoignable : requete partie, aucune reponse
check(
  'reseau coupe',
  extractErrorMessage({ request: {} }),
  'Serveur injoignable. Vérifiez votre connexion, puis réessayez.',
)

// e) Repli : on ne renvoie JAMAIS vide, sinon l'utilisateur ne voit rien
check('erreur vide -> repli', extractErrorMessage(null), "L'opération a échoué.")
check('objet inconnu -> repli', extractErrorMessage({ bizarre: true }), "L'opération a échoué.")

console.log('== extractErrorMessage : codes HTTP courants ==')
const HTTP = [
  [400, "Données invalides, corrigez les champs signalés."],
  [401, 'Session expirée, reconnectez-vous.'],
  [403, "Vous n'avez pas les droits pour cette action."],
  [404, 'Élément introuvable.'],
  [409, 'Ces informations existent déjà.'],
  [500, 'Erreur du serveur, réessayez plus tard.'],
]
for (const [code, message] of HTTP) {
  check(`HTTP ${code}`, extractErrorMessage({ response: { status: code, data: { error: message } } }), message)
}

// --- 2. Normalisation des champs facultatifs (copiee de InfoIdentForm) ------
console.log('== Champs facultatifs : jamais de chaîne vide vers l API ==')
const orNull = (v) => (v === '' || v === undefined ? null : v)
check('vide -> null', orNull(''), null)
check('undefined -> null', orNull(undefined), null)
check('valeur conservee', orNull('KOUASSI'), 'KOUASSI')
check('nombre 0 conserve', orNull(0), 0)

// --- 3. Dates : format attendu par <input type="date"> ---------------------
console.log('== Dates : format ISO court, pas de NaN ==')
const toDateInput = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
}
check('date valide', toDateInput('1990-05-12'), '1990-05-12')
check('timestamp ISO', toDateInput('1990-05-12T00:00:00.000Z'), '1990-05-12')
check('vide', toDateInput(''), '')
check('nulle', toDateInput(null), '')
check('invalide -> vide (pas de "Invalid Date")', toDateInput('pas-une-date'), '')

// --- 4. Le libelle des champs optionnels est explicite --------------------
console.log('== Libelles : les champs facultatifs sont signales ==')
const labelSuffix = (optional, required) => (optional && !required ? ' (facultatif)' : '')
check('champ optionnel', labelSuffix(true, false), ' (facultatif)')
check('champ requis (jamais facultatif)', labelSuffix(false, true), '')

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
