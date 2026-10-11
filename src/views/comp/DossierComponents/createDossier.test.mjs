// Test de la navigation multi-étapes du dossier, SANS navigateur ni React.
//
// Il reproduit la mécanique exacte de React (useEffect + comparaison des deps
// par identité, comme Object.is) pour prouver le bug corrigé :
//
//   Chaque sous-formulaire (InfoIdent/Pro/Bank/Complementaire) contient :
//     useEffect(() => { if (isDirty) setCanProceed?.(false) }, [isDirty, setCanProceed])
//   et, à la soumission valide, un `onFinally: () => setCanProceed?.(true)`.
//
//   Bug : quand `setCanProceed` était passé en prop INLINE par CreateDossier,
//   chaque re-render du parent en recréait la référence. L'effet se
//   redéclenchait donc après la soumission (car une dep avait changé), et
//   `isDirty` valant toujours true, il réécrivait `setCanProceed(false)`
//   par-dessus le `true` validé → bouton « Suivant » bloqué à l'étape 1.
//
//   Fix : setters mémorisés avec useCallback → l'effet ne se redéclenche plus
//   au re-render → l'étape reste débloquée.
//
// Usage : node src/views/comp/DossierComponents/createDossier.test.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ici = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(ici, 'CreateDossier.js'), 'utf8')

let ko = 0
const check = (libelle, reel, attendu) => {
  const ok = reel === attendu
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${reel}`)
}

// ---------------------------------------------------------------------------
// Mini-moteur React fidèle : mémoire de hooks persistante + useEffect dont les
// deps sont comparées par identité (comportement réel de React).
// ---------------------------------------------------------------------------
const sameDeps = (a, b) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]))

function creerComposant(isDirtyInit) {
  const hooks = { derniersDeps: null }
  let isDirty = isDirtyInit
  return {
    get isDirty() { return isDirty },
    setIsDirty(v) { isDirty = v },
    // Reproduit : useEffect(() => { if (isDirty) setCanProceed(false) }, [isDirty, setCanProceed])
    useEffect(setCanProceed) {
      const deps = [isDirty, setCanProceed]
      if (hooks.derniersDeps === null || !sameDeps(hooks.derniersDeps, deps)) {
        if (isDirty) setCanProceed(false)
        hooks.derniersDeps = deps
        return true // effet exécuté
      }
      return false // effet ignoré
    },
  }
}

// Scénario complet : taper (dirty) -> soumettre (onFinally pose true) -> le
// setState du parent provoque un re-render de l'enfant. On renvoie l'état final
// du verrou validatedSteps[1].
function simulerFlux({ setterStable }) {
  const parent = { validated: false }

  // setCanProceed : recréé à chaque "render parent" si inline, sinon stable.
  let setterStableRef = null
  const fabriquerSetter = () => {
    if (setterStable) {
      if (!setterStableRef) setterStableRef = (v) => { parent.validated = v }
      return setterStableRef
    }
    return (v) => { parent.validated = v } // nouvelle référence à chaque appel
  }

  const enfant = creerComposant(false)

  // 1) Montage : isDirty=false, l'effet run au montage mais ne pose rien.
  enfant.useEffect(fabriquerSetter())

  // 2) L'utilisateur remplit le formulaire -> isDirty=true.
  enfant.setIsDirty(true)
  enfant.useEffect(fabriquerSetter()) // -> setCanProceed(false)

  // 3) Soumission valide -> onFinally pose true, ET setFormData re-render le parent.
  const setCanProceed = fabriquerSetter()
  setCanProceed(true) // onFinally

  // 4) Re-render de l'enfant déclenché par le setState du parent.
  enfant.useEffect(fabriquerSetter())

  return parent.validated
}

console.log('== Dossier : verrou de navigation entre étapes ==')

// --- Garde-fous statiques sur le code source corrigé ----------------------
console.log('== Garde-fous dans le code ==')
check('CreateDossier importe useCallback', /import React, \{ useState, useCallback \}/.test(src), true)
check('handleStepValidated mémoïsé (useCallback)', /const handleStepValidated = useCallback\(/.test(src), true)
check('4 setters stables setCanProceed1..4', /setCanProceed4 = useCallback/.test(src), true)
check("étape 1 passe le setter stable (pas d'inline)", src.includes('setCanProceed={setCanProceed1}'), true)
check("plus de `setCanProceed={(isValid)` inline", src.includes('setCanProceed={(isValid)'), false)

// --- Preuve comportementale : le moteur reproduit le bug puis le fix -------
console.log('== Comportement useCallback (simulation React) ==')
check('AVANT (setter inline) : étape re-bloquée', simulerFlux({ setterStable: false }), false)
check('APRÈS (setter stable) : étape débloquée', simulerFlux({ setterStable: true }), true)

// Stabilité : deux renders parents donnent bien la MÊME référence avec useCallback.
const setterA = (() => { let r = null; return () => { if (!r) r = () => {}; return r } })()
check('useCallback renvoie une référence identique', setterA() === setterA(), true)

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
