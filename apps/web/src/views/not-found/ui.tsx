import { Button } from '@repo/ui/components'

import { BaseLayout } from '~/app/layouts'

import { goHomeClicked } from './model'
import styles from './page.module.css'

export const NotFoundPage = () => {
  return (
    <BaseLayout className={styles.container}>
      <h1>Page not found</h1>
      <Button onClick={() => goHomeClicked()}>Go home</Button>
    </BaseLayout>
  )
}
