import { useState } from 'react'

// Floating-label input field with smooth focus transitions.
export default function AnimatedField({
  id, label, type = 'text', value, onChange,
  placeholder, disabled = false, autoFocus = false, autoComplete,
}) {
  const [focused, setFocused] = useState(false)
  const filled = value != null && value !== ''

  const shellClass = [
    'field-shell',
    focused  && 'is-focused',
    filled   && 'is-filled',
    disabled && 'is-disabled',
  ].filter(Boolean).join(' ')

  return (
    <div className="field">
      <div className={shellClass}>
        <label htmlFor={id} className="field-float-label">{label}</label>
        <input
          id={id}
          type={type}
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  )
}
