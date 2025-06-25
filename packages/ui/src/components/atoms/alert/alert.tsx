import React from 'react'
import clsx from 'clsx'

import styles from './alert.module.css'

export interface AlertProps extends React.InputHTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error'
}

export const Alert: React.FC<AlertProps> = ({
  type = 'success',
  className,
  children,
  ...props
}) => {
  const classNames = clsx(styles.alert, className)
  return (
    <div
      className={classNames}
      role={type === 'error' ? 'alert' : 'status'}
      data-type={type}
      {...props}
    >
      {children}
    </div>
  )
}
