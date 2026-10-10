import React, { useId } from 'react'
import PropTypes from 'prop-types'
import { Controller, useFormState } from 'react-hook-form'
import { FormInput, FormSelect, FormTextarea, FormLabel, FormFeedback } from '../ui/Form'

// ---------------------------------------------------------------------------
//  Field — un seul point d'entrée pour TOUS les champs du projet.
//
//  Il encapsule react-hook-form (Controller) et rend tes composants `ui/Form`
//  existants, donc le style ne change pas. Trois garanties systématiques :
//    1. l'erreur s'affiche des que le champ est "touche" (pas a la soumission) ;
//    2. les attributs d'accessibilite (aria-invalid, aria-describedby) sont poses ;
//    3. un champ optionnel est declare optionnel, sans avoir a y penser.
//
//  Usage :
//    <Field name="nom" label="Nom" required />
//    <Field name="sexe" label="Sexe" type="select" options={SEXE} />
//    <Field name="dat_mariage" label="Date de mariage" type="date" optional />
// ---------------------------------------------------------------------------

/** Message d'erreur lisible, quel que soit le format renvoye par le resolver. */
export const messageFor = (error) => {
  if (!error) return undefined
  return typeof error.message === 'string' && error.message ? error.message : 'Valeur invalide'
}

/** Valeur de saisie pour un <input> : jamais null/undefined (React avertit). */
const toInputValue = (value, type) => {
  if (value === null || value === undefined || value === '') return ''
  if (type === 'date' || type === 'datetime-local') {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, type === 'date' ? 10 : 16)
  }
  return value
}

/** Transforme la valeur du DOM en ce que le formulaire doit stocker. */
const fromInputValue = (value, type) => {
  if (type === 'number') {
    if (value === '') return null
    const n = Number(value)
    return Number.isNaN(n) ? null : n
  }
  // Une chaine vide signifie "pas de valeur" : on stocke null plutot que ''
  // pour que les champs optionnels partent vraiment vides vers l'API.
  return value === '' ? null : value
}

const Field = ({
  name,
  label,
  type = 'text',
  options,
  placeholder,
  required = false,
  optional = false,
  hint,
  rows,
  className,
  control,
  rules,
  ...rest
}) => {
  const autoId = useId()
  const id = rest.id || `${name}-${autoId}`
  const feedbackId = `${id}-feedback`

  // `errors` et `touchedFields` lus depuis le contexte du formulaire parent :
  // aucun prop-drilling, et l'erreur disparait des que l'utilisateur corrige.
  const { errors, touchedFields } = useFormState({ control, name })
  const error = errors?.[name]
  const isInvalid = Boolean(error) && Boolean(touchedFields?.[name])
  const message = isInvalid ? messageFor(error) : undefined

  const labelSuffix = optional && !required ? ' (facultatif)' : ''

  return (
    <div className={['mb-3', className].filter(Boolean).join(' ')}>
      {label ? (
        <FormLabel htmlFor={id} required={required}>
          {label}
          {labelSuffix}
        </FormLabel>
      ) : null}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const common = {
            ...field,
            id,
            name,
            placeholder,
            invalid: Boolean(message),
            feedbackInvalid: message,
            'aria-invalid': message ? true : undefined,
            'aria-describedby': message ? feedbackId : hint ? `${id}-hint` : undefined,
            ...rest,
          }

          if (type === 'select') {
            return <FormSelect {...common} options={options} />
          }
          if (type === 'textarea') {
            return <FormTextarea {...common} rows={rows} />
          }

          return (
            <FormInput
              {...common}
              type={type}
              value={toInputValue(field.value, type)}
              onChange={(event) => field.onChange(fromInputValue(event.target.value, type))}
            />
          )
        }}
      />

      {message ? (
        <div id={feedbackId} className="d-block">
          <FormFeedback invalid>{message}</FormFeedback>
        </div>
      ) : null}

      {hint && !message ? (
        <div id={`${id}-hint`} className="form-text">
          {hint}
        </div>
      ) : null}
    </div>
  )
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text', 'email', 'password', 'number', 'date', 'datetime-local',
    'tel', 'select', 'textarea', 'checkbox',
  ]),
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  hint: PropTypes.node,
  rows: PropTypes.number,
  className: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
}

export default Field
