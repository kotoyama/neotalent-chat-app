import { redirect } from 'atomic-router'
import { createEvent } from 'effector'

import { routes } from '~/shared/config/routes'

export const goHomeClicked = createEvent()

redirect({
  clock: goHomeClicked,
  route: routes.chat,
  replace: true,
})
