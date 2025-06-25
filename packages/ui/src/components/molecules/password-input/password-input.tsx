import React from 'react'
import clsx from 'clsx'

import { Input, type InputProps } from '../../atoms/input'
import styles from './password-input.module.css'

export interface PasswordInputProps extends InputProps {}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  className,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const classNames = clsx(styles.inputWrapper, className)

  const handleToggleVisibility = () => {
    setIsVisible((prev) => !prev)
    inputRef.current?.focus()
  }

  return (
    <div className={classNames}>
      <Input
        id={id}
        type={isVisible ? 'text' : 'password'}
        ref={inputRef}
        {...props}
      />
      <button
        type="button"
        className={styles.toggleButton}
        aria-pressed={isVisible}
        aria-controls={id}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        onClick={handleToggleVisibility}
      >
        {isVisible ? '🔒' : '👁️'}
      </button>
    </div>
  )
}
