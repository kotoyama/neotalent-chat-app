import { sample } from 'effector'
import { createHistoryRouter, createRoute } from 'atomic-router'
import { createBrowserHistory } from 'history'

import { appStarted } from '../entry-point'

export const routes = {
  auth: createRoute(),
  chat: createRoute(),
}

export const router = createHistoryRouter({
  routes: [
    { path: '/', route: routes.chat },
    { path: '/auth', route: routes.auth },
  ],
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})
