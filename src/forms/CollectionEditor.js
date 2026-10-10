import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Plus, Trash } from '../ui/icons'
import { EmptyState } from '../components/ui'

// ---------------------------------------------------------------------------
//  CollectionEditor — liste modifiable de diplomes, postes, distinctions…
//
//  Remplace le mecanisme d'origine : chaque « Ajouter » ouvrait un formulaire
//  qui enregistrait UN element dans un etat, ecrasant le precedent. Impossible
//  de voir ce qui avait deja ete saisi, ni d'en corriger un.
//
//  Desormais la collection est une liste visible : on voit tout, on ajoute,
//  on supprime. L'etat est un tableau, tenu par le parent.
//
//  Usage :
//    <CollectionEditor
//      title="Diplômes"
//      items={diplomes}
//      onChange={setDiplomes}
//      columns={[
//        { name: 'nom_diplome', label: 'Diplôme', required: true },
//        { name: 'institution', label: 'Institution', required: true },
//        { name: 'date_obtention', label: 'Obtenu le', type: 'date' },
//      ]}
//    />
// ---------------------------------------------------------------------------

/** Valeur d'un champ, prete pour un <input> (jamais null/undefined). */
const champValue = (item, name) => {
  const v = item?.[name]
  if (v === null || v === undefined) return ''
  return String(v)
}

/** Convertit une date ISO en aaaa-mm-jj pour <input type="date">. */
const toInputDate = (v) => {
  if (!v) return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

const videPour = () => ({})

const CollectionEditor = ({ title, description, items = [], onChange, columns = [], addLabel }) => {
  const [brouillon, setBrouillon] = useState(null)
  const [erreurs, setErreurs] = useState({})

  const liste = Array.isArray(items) ? items : []
  const enAjout = brouillon !== null

  const ouvrirAjout = () => {
    setErreurs({})
    setBrouillon(videPour())
  }

  const annuler = () => {
    setBrouillon(null)
    setErreurs({})
  }

  const setChamp = (name, value) => {
    setBrouillon((prev) => ({ ...(prev || {}), [name]: value }))
    // L'erreur d'un champ disparait des qu'on le corrige.
    setErreurs((prev) => {
      if (!prev[name]) return prev
      const suivant = { ...prev }
      delete suivant[name]
      return suivant
    })
  }

  /** Validation minimale, coherente avec les schemas Yup du projet. */
  const valider = (valeurs) => {
    const errs = {}
    for (const col of columns) {
      const v = valeurs?.[col.name]
      if (col.required && (v === '' || v === null || v === undefined)) {
        errs[col.name] = `${col.label} est requis`
        continue
      }
      if (col.type === 'number' && v !== '' && v !== null && Number.isNaN(Number(v))) {
        errs[col.name] = `${col.label} doit être un nombre`
      }
    }
    return errs
  }

  const confirmer = () => {
    const errs = valider(brouillon)
    setErreurs(errs)
    if (Object.keys(errs).length > 0) return

    // Normalisation : champs vides -> null, nombres convertis.
    const nettoye = { ...brouillon }
    for (const col of columns) {
      if (nettoye[col.name] === '') nettoye[col.name] = null
      if (col.type === 'number' && nettoye[col.name] !== null) {
        nettoye[col.name] = Number(nettoye[col.name])
      }
    }
    onChange([...liste, nettoye])
    setBrouillon(null)
    setErreurs({})
  }

  const supprimer = (index) => onChange(liste.filter((_, i) => i !== index))

  return (
    <Card className="gp-collection mb-4">
      <CardHeader className="d-flex align-items-center justify-content-between">
        <div>
          <strong>{title}</strong>
          {description ? <div className="form-text">{description}</div> : null}
        </div>
        <span className="badge bg-secondary">{liste.length}</span>
      </CardHeader>

      <CardBody>
        {liste.length > 0 ? (
          <div className="table-responsive mb-3">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.name} scope="col">
                      {col.label}
                      {col.required ? <span className="text-danger"> *</span> : null}
                    </th>
                  ))}
                  <th scope="col" className="text-end" style={{ width: '5rem' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {liste.map((item, index) => (
                  <tr key={item.id ?? `${index}-${JSON.stringify(item)}`}>
                    {columns.map((col) => (
                      <td key={col.name}>
                        {champValue(item, col.name) || <span className="text-muted">—</span>}
                      </td>
                    ))}
                    <td className="text-end">
                      <Button
                        color="link"
                        size="sm"
                        className="p-0 text-danger"
                        onClick={() => supprimer(index)}
                        aria-label={`Supprimer l'élément ${index + 1} de ${title}`}
                      >
                        <Icon icon={Trash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={`Aucun élément dans « ${title} »`}
            text="Cette section est facultative : le dossier peut être enregistré sans."
            className="mb-3"
          />
        )}

        {enAjout ? (
          <div className="gp-collection__form border rounded p-3">
            <div className="row g-3">
              {columns.map((col) => (
                <div className="col-12 col-md-6" key={col.name}>
                  <label className="form-label" htmlFor={`${title}-${col.name}`}>
                    {col.label}
                    {col.required ? <span className="text-danger"> *</span> : ' (facultatif)'}
                  </label>
                  <input
                    id={`${title}-${col.name}`}
                    name={col.name}
                    type={col.type || 'text'}
                    className={`form-control ${erreurs[col.name] ? 'is-invalid' : ''}`}
                    value={
                      col.type === 'date'
                        ? toInputDate(brouillon[col.name])
                        : champValue(brouillon, col.name)
                    }
                    onChange={(e) => setChamp(col.name, e.target.value)}
                    aria-invalid={erreurs[col.name] ? true : undefined}
                  />
                  {erreurs[col.name] ? (
                    <div className="invalid-feedback d-block">{erreurs[col.name]}</div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button color="success" onClick={confirmer}>
                <Icon icon={Plus} className="me-2" />
                Ajouter à la liste
              </Button>
              <Button color="secondary" onClick={annuler}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button color="outline-primary" onClick={ouvrirAjout}>
            <Icon icon={Plus} className="me-2" />
            {addLabel || 'Ajouter'}
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

CollectionEditor.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  items: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
    }),
  ),
  addLabel: PropTypes.string,
}

export default CollectionEditor

