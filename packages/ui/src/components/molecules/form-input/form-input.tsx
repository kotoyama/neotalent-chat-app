import React from 'react'
import clsx from 'clsx'

import { Input } from '../../atoms/input'
import styles from './form-input.module.css'

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
      <Input id={id} type={type} aria-invalid={!!errorText} {...props} />
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
