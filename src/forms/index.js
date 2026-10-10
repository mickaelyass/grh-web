// ---------------------------------------------------------------------------
//  Socle formulaires — tout passe par ici.
//
//  `Field`      un champ, branche sur react-hook-form, style `ui/Form` inchange
//  `FormSection`  regroupement thematique (dossiers longs)
//  `useFormErrors`  succes / validation / erreur serveur / reseau : jamais muet
//  `FormAlert` / `FormToasts`  l'affichage de ces retours
// ---------------------------------------------------------------------------

export { default as Field, messageFor } from './Field'
export { default as FormSection } from './FormSection'
export { default as FormAlert, FormToasts } from './FormAlert'
export { default as useFormErrors, extractErrorMessage } from './useFormErrors'
