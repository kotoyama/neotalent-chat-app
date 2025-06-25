import React from 'react'
import clsx from 'clsx'

import styles from './card.module.css'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  const classNames = clsx(styles.card, className)

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}
