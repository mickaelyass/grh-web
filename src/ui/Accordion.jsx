import React, { useId, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import { ChevronDown } from './icons'

// ---------------------------------------------------------------------------
//  Accordion — collapsible sections (agent dossier forms, evaluation sheets).
//    <Accordion>
//      <AccordionItem title="Identité" defaultOpen>…</AccordionItem>
//    </Accordion>
//
//  Uncontrolled by default: each item keeps its own open state, which is what
//  the multi-section forms of the product need.
// ---------------------------------------------------------------------------
export const Accordion = ({ children, className = '', alwaysOpen = false, ...rest }) => (
  <div className={['accordion', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

Accordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  alwaysOpen: PropTypes.bool,
}

export const AccordionItem = ({ title, subtitle, icon, children, defaultOpen = false, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const buttonId = `${panelId}-button`

  return (
    <div className={['accordion-item', className].filter(Boolean).join(' ')}>
      <h3 className="accordion-header mb-0">
        <button
          type="button"
          id={buttonId}
          className="accordion-button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {icon ? (
            <span className="nav-icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className="gp-min-w-0">
            <span className="d-block">{title}</span>
            {subtitle ? <span className="gp-muted-note d-block">{subtitle}</span> : null}
          </span>
          <span className="nav-group-toggle__chevron" aria-hidden="true">
            <Icon icon={ChevronDown} />
          </span>
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} className="accordion-body" hidden={!open}>
        {children}
      </div>
    </div>
  )
}

AccordionItem.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
  children: PropTypes.node,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
}

export default Accordion