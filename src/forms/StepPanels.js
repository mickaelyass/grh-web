import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  StepPanels — resout LA perte de donnees d'un formulaire a etapes.
//
//  Le probleme : `<div>{step === 1 && <Form1 />}</div>` DEMONTE Form1 des qu'on
//  change d'etape. React detruit alors tout l'etat du formulaire (react-hook-form
//  compris) : les valeurs saisies disparaissent. Et au retour, les `initial`
//  d'origine etaient reinjectes, donc on revoyait l'ancienne valeur.
//
//  La solution : les panneaux restent MONTES en permanence. On masque ceux qui
//  ne sont pas actifs avec l'attribut `hidden`, qui :
//    - retire le panneau du flux visuel ET de l'accessibilite (display:none) ;
//    - conserve le sous-arbre React vivant -> l'etat des champs survit.
//
//  Tous les panneaux etant montes, `display:none` evite en plus que la
//  validation d'une etape cachee bloque la navigation.
// ---------------------------------------------------------------------------

const StepPanels = ({ children, active, onStepChange }) => {
  const panneaux = useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children],
  )

  // Signale l'etape active au parent (utile pour numeroter, charger a la volee…).
  useEffect(() => {
    onStepChange?.(active)
  }, [active, onStepChange])

  return (
    <>
      {panneaux.map((panneau, index) => (
        // `hidden` masque sans demonter : c'est tout l'enjeu de ce composant.
        <div key={panneau.key ?? index} hidden={index !== active}>
          {panneau}
        </div>
      ))}
    </>
  )
}

StepPanels.propTypes = {
  children: PropTypes.node,
  active: PropTypes.number,
  onStepChange: PropTypes.func,
}

/**
 * useSteps — la navigation entre etapes, sans jamais detruire les formulaires.
 *
 * Contrairement a l'ancien code, `next()` n'exige pas que l'etape soit validee :
 * on laisse l'utilisateur aller ou il veut (il peut remplir la section 4 avant
 * la 2), et c'est la validation finale a l'enregistrement qui tranche. Un
 * bouton « Suivant » mort sans explication est precisement ce qu'on veut eviter.
 */
export const useSteps = (total) => {
  const [step, setStep] = useState(1)
  const [visited, setVisited] = useState(() => ({ 1: true }))

  const goTo = useCallback(
    (cible) => {
      if (cible < 1 || cible > total) return
      setStep(cible)
      setVisited((prev) => ({ ...prev, [cible]: true }))
    },
    [total],
  )

  const next = useCallback(() => setStep((s) => Math.min(s + 1, total)), [total])
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])
  const reset = useCallback(() => {
    setStep(1)
    setVisited({ 1: true })
  }, [])

  return { step, visited, goTo, next, prev, reset, total }
}

export default StepPanels
