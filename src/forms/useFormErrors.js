import { useCallback, useState } from 'react'

// ---------------------------------------------------------------------------
//  useFormErrors — un retour utilisateur SYSTEMATIQUE, quel que soit l'echec.
//
//  Avant, un formulaire pouvait echouer en silence (console.error, rien a
//  l'ecran) ou afficher une alerte genrique. Desormais 4 cas sont couverts :
//    - succes            -> toast vert
//    - validation Yup    -> rouge sous chaque champ (via <Field>)
//    - erreur serveur    -> message exact renvoye par l'API ({ error } / { message })
//    - reseau coupe      -> message explicite au lieu d'une page muette
//
//  Retour :
//    submitError   le message a afficher dans une <Alert> au-dessus du form
//    toasts       les notifications de succes
//    handleSubmit  a passer a react-hook-form (gere try/catch)
//    success(msg)  pour notifier apres une action reussie
// ---------------------------------------------------------------------------

/** Extrait le message le plus utile d'une erreur axios/HTTP, tous cas confondus. */
export function extractErrorMessage(error, fallback = "L'opération a échoué.") {
  if (!error) return fallback

  // Erreur applicative du backend : { error: '...' } ou { message: '...' }
  const data = error.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.error && typeof data.error === 'string' && data.error.trim()) return data.error
  if (data?.message && typeof data.message === 'string' && data.message.trim()) return data.message

  // Erreurs de validation renvoyees champ par champ (express-validator, Joi…)
  if (Array.isArray(data?.errors) && data.errors.length) {
    const premier = data.errors[0]
    return typeof premier === 'string' ? premier : premier?.message || premier?.msg || fallback
  }

  // Pas de reponse du tout : serveur eteint, DNS, CORS, timeout
  if (error.request && !error.response) {
    return 'Serveur injoignable. Vérifiez votre connexion, puis réessayez.'
  }

  if (typeof error.message === 'string' && error.message.trim()) return error.message
  return fallback
}

export function useFormErrors() {
  const [submitError, setSubmitError] = useState(null)
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((list) => [...list, { id, message, tone }])
    // Auto-fermeture : 5s pour un succes, 8s pour une erreur (temps de lire).
    setTimeout(() => {
      setToasts((list) => list.filter((toast) => toast.id !== id))
    }, tone === 'success' ? 5000 : 8000)
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message = 'Enregistré.') => pushToast(message, 'success'),
    [pushToast],
  )

  const clearError = useCallback(() => setSubmitError(null), [])

  /**
   * Enveloppe ton handler. Toute exception devient un message lisible :
   * plus jamais une page blanche ni un formulaire qui "ne fait rien".
   */
  const handleSubmit = useCallback(
    async (onValid, options = {}) => {
      const { successMessage, onFinally } = options
      setSubmitError(null)
      try {
        const result = await onValid?.()
        if (successMessage) success(successMessage)
        return result
      } catch (error) {
        // Volontairement on ne masque rien : le message de l'API est le plus utile.
        const message = extractErrorMessage(error)
        setSubmitError(message)
        pushToast(message, 'danger')
        return undefined
      } finally {
        onFinally?.()
      }
    },
    [pushToast, success],
  )

  return {
    submitError,
    toasts,
    handleSubmit,
    success,
    pushToast,
    dismissToast,
    clearError,
  }
}

export default useFormErrors
