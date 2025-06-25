import React from 'react'
import clsx from 'clsx'

import styles from './layout.module.css'

type Props = {
  children: React.ReactNode
  className?: string
}

export const BaseLayout: React.FC<Props> = ({ children, className }) => {
  const classNames = clsx(styles.container, className)
  return <main className={classNames}>{children}</main>
}
