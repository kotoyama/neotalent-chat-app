import { chainAnonymous } from '~/entities/session'
import { routes } from '~/shared/config/routes'

export const currentRoute = routes.auth
export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise: routes.chat.open,
})
