import { createRouteView } from 'atomic-router-react'

import { BaseLayout } from '~/app/layouts'

import { anonymousRoute, currentRoute } from './model'
import { AuthPage } from './ui'

export const AuthRoute = {
  view: createRouteView({ route: anonymousRoute, view: AuthPage }),
  layout: BaseLayout,
  route: currentRoute,
}
