import React from 'react'
import clsx from 'clsx'

import { Input, type InputProps } from '../../atoms/input'
import { PasswordInput } from '../password-input'
import styles from './form-input.module.css'

export interface FormInputProps extends InputProps {
  id: string
  label: string
  errorText?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  type = 'text',
  className,
  label,
  errorText,
  ...props
}) => {
  const errorId = `${id}-error`
  const classNames = clsx(styles.formInputGroup, className)

  return (
    <div className={classNames}>
      <label htmlFor={id}>{label}</label>
      {type === 'password' ? (
        <PasswordInput id={id} aria-invalid={!!errorText} {...props} />
      ) : (
        <Input id={id} type={type} aria-invalid={!!errorText} {...props} />
      )}
      {errorText && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className={styles.errorMessage}
        >
          {errorText}
        </div>
      )}
    </div>
  )
}
