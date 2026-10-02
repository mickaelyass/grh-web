import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../ui/Button'
import Icon from '../../ui/Icon'
import { FormInput, InputGroup, InputGroupText } from '../../ui/Form'
import { Close, Search } from '../../ui/icons'

// ---------------------------------------------------------------------------
//  Toolbar & SearchInput — the standard filter bar of the list screens.
// ---------------------------------------------------------------------------

export const Toolbar = ({ children, className = '' }) => (
  <div className={`gp-toolbar ${className}`.trim()}>{children}</div>
)

Toolbar.propTypes = { children: PropTypes.node, className: PropTypes.string }

export const SearchInput = ({ value, onChange, placeholder = 'Rechercher…', onClear, grow = true }) => {
  const hasValue = Boolean(value)

  return (
    <InputGroup className={grow ? 'gp-toolbar__grow' : ''}>
      <InputGroupText className="bg-transparent">
        <Icon icon={Search} />
      </InputGroupText>
      <FormInput
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {hasValue ? (
        <Button
          type="button"
          color="light"
          variant="ghost"
          className="border"
          aria-label="Effacer la recherche"
          onClick={() => {
            onChange?.('')
            onClear?.()
          }}
        >
          <Icon icon={Close} />
        </Button>
      ) : null}
    </InputGroup>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  grow: PropTypes.bool,
}
