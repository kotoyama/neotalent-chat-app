import React from 'react'
import clsx from 'clsx'

import styles from './button.module.css'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined'
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const classNames = clsx(styles.btn, className)
  return (
    <button
      type={type}
      className={classNames}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  )
}
