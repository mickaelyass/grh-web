import React from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { ArrowLeft, ArrowRight, CheckCircle } from '../ui/icons'
// ---------------------------------------------------------------------------
//  StepNav — la navigation entre les etapes d'un dossier.
//
//  Remplace deux fleches sans texte : on sait desormais ou on va, ce qui a
//  deja ete rempli, et l'etape courante reste visible meme en defilant.
// ---------------------------------------------------------------------------

export const StepTabs = ({ steps = [], active, goTo, completed = {} }) => (
  <nav className="gp-stepnav" aria-label="Sections du dossier">
    <ol className="gp-stepnav__list">
      {steps.map((label, index) => {
        const numero = index + 1
        const estActif = numero === active
        const estFait = Boolean(completed[numero]) && !estActif

        return (
          <li key={label} className="gp-stepnav__item">
            <button
              type="button"
              onClick={() => goTo(numero)}
              aria-current={estActif ? 'step' : undefined}
              className={[
                'gp-stepnav__btn',
                estActif ? 'is-active' : null,
                estFait ? 'is-done' : null,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="gp-stepnav__num" aria-hidden="true">
                {estFait ? <Icon icon={CheckCircle} /> : numero}
              </span>
              <span className="gp-stepnav__label">{label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  </nav>
)

StepTabs.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.number,
  goTo: PropTypes.func,
  completed: PropTypes.object,
}

const StepNav = ({
  step,
  total,
  onPrev,
  onNext,
  onSave,
  saving = false,
  saveLabel = 'Enregistrer le dossier',
  prevLabel = 'Précédent',
  nextLabel = 'Suivant',
  hint,
}) => {
  const estDerniere = step >= total

  return (
    <div className="gp-stepnav-actions">
      <div className="gp-stepnav-actions__hint">
        {hint ? <span className="form-text mb-0">{hint}</span> : null}
      </div>

      <div className="d-flex gap-2">
        <Button color="secondary" onClick={onPrev} disabled={step <= 1}>
          <Icon icon={ArrowLeft} className="me-2" />
          {prevLabel}
        </Button>

        {estDerniere ? (
          <Button color="success" onClick={onSave} disabled={saving}>
            {saving ? 'Enregistrement…' : saveLabel}
          </Button>
        ) : (
          <Button color="primary" onClick={onNext}>
            {nextLabel}
            <Icon icon={ArrowRight} className="ms-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

StepNav.propTypes = {
  step: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  saveLabel: PropTypes.string,
  prevLabel: PropTypes.string,
  nextLabel: PropTypes.string,
  hint: PropTypes.node,
}

export default StepNav
