import { useState } from 'react'

// Floating-label text field with smooth focus transitions.
// Thin wrapper around a native <input> — keeps value handling external.
export default function AnimatedField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled = false,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false)
  const filled = value != null && value !== ''

  const shellClass = [
    'field-shell',
    focused && 'is-focused',
    filled && 'is-filled',
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field">
      <div className={shellClass}>
        <label htmlFor={id} className="field-float-label">
          {label}
        </label>
        <input
          id={id}
          type="text"
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
        />
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}
