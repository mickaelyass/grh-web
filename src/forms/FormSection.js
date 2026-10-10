import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../ui/Icon'

// ---------------------------------------------------------------------------
//  FormSection — regroupe des champs par theme, pour qu'un long dossier se
//  lise en blocs au lieu d'une colonne infinie. Utilise les Card deja en place.
// ---------------------------------------------------------------------------

const FormSection = ({ title, description, icon, columns = 2, children, className = '' }) => (
  <section className={['gp-form-section', className].filter(Boolean).join(' ')}>
    {title ? (
      <header className="gp-form-section__head">
        {icon ? (
          <span className="gp-tint-primary gp-form-section__icon" aria-hidden="true">
            <Icon icon={icon} />
          </span>
        ) : null}
        <div>
          <h3 className="gp-form-section__title mb-0">{title}</h3>
          {description ? <p className="gp-form-section__desc mb-0">{description}</p> : null}
        </div>
      </header>
    ) : null}

    <div
      className="gp-form-section__grid"
      style={{ '--gp-cols': columns }}
    >
      {children}
    </div>
  </section>
)

FormSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  icon: PropTypes.elementType,
  columns: PropTypes.oneOf([1, 2, 3]),
  children: PropTypes.node,
  className: PropTypes.string,
}

export default FormSection
