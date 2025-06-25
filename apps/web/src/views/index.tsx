import { createRoutesView } from 'atomic-router-react'

import { AuthRoute } from './auth'
import { ChatRoute } from './chat'
import { NotFoundPage } from './not-found'

export const Pages = createRoutesView({
  routes: [AuthRoute, ChatRoute],
  otherwise: NotFoundPage,
})
