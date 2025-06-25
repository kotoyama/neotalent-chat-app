import React from 'react'
import clsx from 'clsx'

import styles from './input.module.css'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', className, ...props }, ref) => {
    const classNames = clsx(styles.input, className)
    return <input className={classNames} type={type} ref={ref} {...props} />
  }
)
