import { createRouteView } from 'atomic-router-react'

import { authorizedRoute, currentRoute } from './model'
import { ChatPage } from './ui'

export const ChatRoute = {
  view: createRouteView({ route: authorizedRoute, view: ChatPage }),
  route: currentRoute,
}
