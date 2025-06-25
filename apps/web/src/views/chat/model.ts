import { chainAuthorized } from '~/entities/session'
import { routes } from '~/shared/config/routes'

export const currentRoute = routes.chat
export const authorizedRoute = chainAuthorized(currentRoute, {
  otherwise: routes.auth.open,
})
