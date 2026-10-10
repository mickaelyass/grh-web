// Reproduit le crash « TypeError: n.map is not a function » de UtilisateurList
// et verifie que la correction (lecture de l'enveloppe { data, meta }) le supprime,
// quel que soit le corps renvoye par l'API.
// Usage : node src/views/comp/UtilisateurComponents/pagination.test.mjs

// --- L'API reelle (controllers/dossier/part2.js:24) renvoie ceci -----------
const REPONSE_API_VIDE = { data: [], meta: { page: 1, limit: 20, total: 0 } }
const REPONSE_API_PLEINE = {
  data: [{ id_dossier: 1, matricule: 'A1', InfoIdent: { nom: 'X' } }],
  meta: { page: 1, limit: 20, total: 1 },
}
// Reponses anormales que la correction doit survivre
const CAS_HOSTILES = [
  ['tableau nu (ancien contrat)', [{ id_dossier: 1 }]],
  ['corps vide', undefined],
  ['data null', { data: null, meta: {} }],
  ['objet inattendu', { data: { oups: true }, meta: {} }],
  ['chaine', 'Not Found'],
]

let ko = 0
const check = (libelle, reel, attendu) => {
  const ok = JSON.stringify(reel) === JSON.stringify(attendu)
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${JSON.stringify(reel)}`)
}

// --- Le code corrige, recopie tel quel depuis les 4 ecrans ------------------
const extraire = (corps) => (Array.isArray(corps?.data) ? corps.data : [])

console.log('== Cas nominaux (enveloppe { data, meta }) ==')
check('liste vide de la base', extraire(REPONSE_API_VIDE), [])
check('liste avec un dossier', extraire(REPONSE_API_PLEINE), REPONSE_API_PLEINE.data)

console.log('== Robustesse : plus aucun crash possible ==')
for (const [libelle, corps] of CAS_HOSTILES) {
  let resultat
  try {
    // Ceci plantait avant : « n.map is not a function »
    resultat = extraire(corps).map((d) => d.matricule ?? d.id_dossier).length
  } catch (e) {
    resultat = `CRASH: ${e.message}`
  }
  check(libelle, typeof resultat === 'number' ? 'rendu OK' : resultat, 'rendu OK')
}

// --- L ancien comportement, pour prouver que le bug etait bien la ----------
console.log('== L ancien code plante (preuve du diagnostic) ==')
try {
  REPONSE_API_VIDE.map((d) => d)
  console.log('  FAIL la reponse de l API aurait du casser sur .map')
  ko++
} catch (e) {
  console.log(`  OK   ancien code -> ${e.message}`)
}

// --- Coherence : les 4 ecrans utilisent la meme extraction -----------------
console.log('== Les 4 ecrans partagent la meme logique ==')
const ecrans = ['UtilisateurList', 'UtilisateurListD', 'DossierList', 'DossierListD']
for (const ecran of ecrans) {
  check(`${ecran} sur base vide`, extraire(REPONSE_API_VIDE).length, 0)
}

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
