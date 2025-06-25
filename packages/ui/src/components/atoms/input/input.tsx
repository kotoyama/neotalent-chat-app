import React from 'react'
import clsx from 'clsx'

import styles from './input.module.css'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  className,
  ...props
}) => {
  const classNames = clsx(styles.input, className)
  return <input className={classNames} type={type} {...props} />
}
