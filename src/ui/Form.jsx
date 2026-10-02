import React from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
//  Forms — Form / FormLabel / FormInput / FormSelect / FormTextarea /
//  FormFeedback / FormCheck / InputGroup / InputGroupText.
//
//  All controls spread their extra props onto the native element, so anything
//  the platform supports (min, max, step, accept, autoComplete, aria-*, …)
//  keeps working without a wrapper API in the way.
// ---------------------------------------------------------------------------

const controlClasses = (control, size, invalid, valid, className) =>
  [control, size ? `${control}-${size}` : null, invalid ? 'is-invalid' : null, valid ? 'is-valid' : null, className]
    .filter(Boolean)
    .join(' ')

export const Form = ({ children, className = '', as: Component = 'form', ...rest }) => (
  <Component className={className} {...rest}>
    {children}
  </Component>
)

Form.propTypes = { children: PropTypes.node, className: PropTypes.string, as: PropTypes.elementType }

export const FormLabel = ({ children, className = '', htmlFor, required = false, hint, ...rest }) => (
  <label className={['form-label', className].filter(Boolean).join(' ')} htmlFor={htmlFor} {...rest}>
    {children}
    {required ? (
      <span className="text-danger" aria-hidden="true">
        {' *'}
      </span>
    ) : null}
    {hint ? <span className="form-text">{hint}</span> : null}
  </label>
)

FormLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  hint: PropTypes.node,
}

export const FormInput = ({
  className = '',
  size,
  invalid = false,
  valid = false,
  feedback,
  feedbackInvalid,
  feedbackValid,
  type = 'text',
  ...rest
}) => {
  const message = feedbackInvalid || feedback

  return (
    <>
      <input
        type={type}
        className={controlClasses('form-control', size, Boolean(invalid || message), valid, className)}
        {...rest}
      />
      {typeof message === 'string' ? <div className="invalid-feedback">{message}</div> : null}
      {typeof feedbackValid === 'string' ? <div className="valid-feedback">{feedbackValid}</div> : null}
    </>
  )
}

FormInput.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  invalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  valid: PropTypes.bool,
  feedback: PropTypes.node,
  feedbackInvalid: PropTypes.node,
  feedbackValid: PropTypes.node,
  type: PropTypes.string,
}

export const FormTextarea = ({ className = '', size, invalid = false, feedback, rows = 4, ...rest }) => (
  <>
    <textarea
      rows={rows}
      className={controlClasses('form-control', size, Boolean(invalid || feedback), false, className)}
      {...rest}
    />
    {typeof feedback === 'string' ? <div className="invalid-feedback">{feedback}</div> : null}
  </>
)

FormTextarea.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  invalid: PropTypes.bool,
  feedback: PropTypes.node,
  rows: PropTypes.number,
}

export const FormSelect = ({
  children,
  className = '',
  size,
  invalid = false,
  options,
  placeholder,
  ...rest
}) => (
  <select
    className={['form-select', size ? `form-select-${size}` : null, invalid ? 'is-invalid' : null, className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {placeholder ? <option value="">{placeholder}</option> : null}
    {options
      ? options.map((option) =>
          typeof option === 'string' || typeof option === 'number' ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label ?? option.value}
            </option>
          ),
        )
      : children}
  </select>
)

FormSelect.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  invalid: PropTypes.bool,
  options: PropTypes.array,
  placeholder: PropTypes.string,
}

export const FormFeedback = ({ children, className = '', invalid = false, valid = false, ...rest }) => (
  <div
    className={[invalid ? 'invalid-feedback' : 'valid-feedback', valid ? 'valid' : null, className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </div>
)

FormFeedback.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  valid: PropTypes.bool,
}

export const FormCheck = ({
  className = '',
  type = 'checkbox',
  label,
  id,
  inline = false,
  switch: isSwitch = false,
  ...rest
}) => (
  <div className={['form-check', inline ? 'form-check-inline' : null, className].filter(Boolean).join(' ')}>
    <input
      id={id}
      type={isSwitch ? 'checkbox' : type}
      role={isSwitch ? 'switch' : undefined}
      className="form-check-input"
      {...rest}
    />
    {label ? (
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    ) : null}
  </div>
)

FormCheck.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['checkbox', 'radio']),
  switch: PropTypes.bool,
  label: PropTypes.node,
  id: PropTypes.string,
  inline: PropTypes.bool,
}

export const InputGroup = ({ children, className = '', size, ...rest }) => (
  <div className={['input-group', size ? `input-group-${size}` : null, className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
)

InputGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
}

export const InputGroupText = ({ children, className = '', ...rest }) => (
  <span className={['input-group-text', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </span>
)

InputGroupText.propTypes = { children: PropTypes.node, className: PropTypes.string }

export default Form
