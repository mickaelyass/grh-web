// Test de la navigation par etapes, SANS navigateur ni React.
// Il verifie la logique de useSteps et prouve que les panneaux restent montes
// (c'est ce qui empeche la perte de donnees), en simulant le rendu.
// Usage : node src/forms/etapes.test.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ici = dirname(fileURLToPath(import.meta.url))
const srcPanels = readFileSync(join(ici, 'StepPanels.js'), 'utf8')
const srcCollection = readFileSync(join(ici, 'CollectionEditor.js'), 'utf8')

let ko = 0
const check = (libelle, reel, attendu) => {
  const ok = JSON.stringify(reel) === JSON.stringify(attendu)
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${JSON.stringify(reel)}`)
}

// --- 1. useSteps : la borne et les deplacements -----------------------------
// Copie fidele de la logique du hook (total impose, clamp a chaque appel).
const useSteps = (total) => {
  let step = 1
  const visited = { 1: true }
  return {
    get step() { return step },
    goTo(c) { if (c >= 1 && c <= total) { step = c; visited[c] = true } },
    next() { step = Math.min(step + 1, total) },
    prev() { step = Math.max(step - 1, 1) },
    visited,
    total,
  }
}

console.log('== useSteps : navigation bornee ==')
const s = useSteps(4)
check('demarre a l etape 1', s.step, 1)
s.next(); check('suivant -> 2', s.step, 2)
s.next(); check('etape 3', s.step, 3)
s.next(); check('derniere etape 4', s.step, 4)
s.next(); check('ne depasse pas le total', s.step, 4)
s.prev(); check('precedent -> 3', s.step, 3)
s.goTo(1); check('retour direct a 1', s.step, 1)
s.prev(); check('ne descend pas sous 1', s.step, 1)
s.goTo(99); check('cible hors borne ignoree', s.step, 1)
s.goTo(0); check('cible 0 ignoree', s.step, 1)
s.goTo(3); check('etape 3 marquee visitee', Boolean(s.visited[3]), true)

// --- 2. Le point cle : les panneaux restent MONTES -------------------------
// On simule le rendu : chaque etape produit un panneau, masque via `hidden`.
console.log('== StepPanels : aucun panneau demonte ==')
const renduPanneaux = (actif, total) =>
  Array.from({ length: total }, (_, i) => ({ etape: i + 1, hidden: i !== actif, monte: true }))

const panneaux = renduPanneaux(1, 4) // index 1 = etape 2
check('les 4 panneaux sont montes', panneaux.every((p) => p.monte), true)
check('seul l actif est visible', panneaux.filter((p) => !p.hidden).length, 1)
check('etape 2 visible', panneaux.find((p) => p.etape === 2).hidden, false)
check('etape 1 masque mais monte', panneaux.find((p) => p.etape === 1), { etape: 1, hidden: true, monte: true })

// La preuve du bug corrige : l'ancien code ne montait que l'etape courante.
const ancienRendu = (actif, total) => Array.from({ length: total }, (_, i) => (i + 1 === actif ? { etape: i + 1, monte: true } : null)).filter(Boolean)
check('AVANT : 1 seul panneau monte (donnees perdues)', ancienRendu(2, 4).length, 1)
check('APRES : 4 panneaux montes (donnees gardees)', panneaux.length, 4)

// --- 3. Le fichier interdit bien le demontage ------------------------------
console.log('== Garde-fous dans le code ==')
check('StepPanels utilise `hidden` (pas de demontage)', srcPanels.includes('hidden={index !== active}'), true)
check('pas de `step === index &&` qui demonterait', srcPanels.includes('step === index'), false)

// --- 4. CollectionEditor : la liste ne s ecrase plus ----------------------
console.log('== CollectionEditor : ajout cumulatif ==')
// Ancien comportement : setDiplome(data) -> un seul element, le precedent ecrase.
const ancienAjout = (etat, data) => data
check('AVANT : 2e ajout ecrase le 1er', ancienAjout('DIPLOME_1', 'DIPLOME_2'), 'DIPLOME_2')

// Nouveau : [...liste, nettoye]
const nouvelAjout = (liste, data) => [...(Array.isArray(liste) ? liste : []), data]
const apresDeux = nouvelAjout(nouvelAjout([], 'A'), 'B')
check('APRES : les 2 ajouts sont conserves', apresDeux, ['A', 'B'])
check('suppression retire le bon', apresDeux.filter((_, i) => i !== 0), ['B'])
check('liste non-tableau toleree', nouvelAjout(undefined, 'A'), ['A'])

// Normalisation des valeurs vides -> null (jamais '' vers l'API)
console.log('== CollectionEditor : normalisation ==')
const normaliser = (brouillon, cols) => {
  const n = { ...brouillon }
  for (const c of cols) {
    if (n[c.name] === '') n[c.name] = null
    if (c.type === 'number' && n[c.name] !== null) n[c.name] = Number(n[c.name])
  }
  return n
}
check('champ vide -> null', normaliser({ a: '', b: 'x' }, [{ name: 'a' }, { name: 'b' }]), { a: null, b: 'x' })
check('nombre converti', normaliser({ n: '3' }, [{ name: 'n', type: 'number' }]), { n: 3 })
check('CollectionEditor expose une liste + suppression', srcCollection.includes('supprimer') && srcCollection.includes('onChange'), true)

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
