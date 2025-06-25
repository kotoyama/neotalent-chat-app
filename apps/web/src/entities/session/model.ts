import {
  createEvent,
  type Effect,
  type Event,
  EventCallable,
  sample,
} from 'effector'
import { createJsonMutation, createJsonQuery } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import {
  chainRoute,
  type RouteInstance,
  type RouteParams,
  type RouteParamsAndQuery,
} from 'atomic-router'
import { z } from 'zod'
import { getAuthSessionResponse } from '@repo/shared-types/contracts'

import { appStarted } from '~/shared/entry-point'
import { api } from '~/shared/config/api'

export const signOutClicked = createEvent()

export const getSessionQuery = createJsonQuery({
  request: {
    method: 'GET',
    url: api.session.get,
    credentials: 'include',
  },
  response: {
    contract: zodContract(getAuthSessionResponse),
  },
})

export const signOutMutation = createJsonMutation({
  request: {
    method: 'DELETE',
    url: api.session.delete,
    credentials: 'include',
  },
  response: {
    contract: zodContract(z.null()),
  },
})

sample({
  clock: appStarted,
  target: getSessionQuery.start,
})

sample({
  clock: signOutClicked,
  target: signOutMutation.start,
})

sample({
  clock: signOutMutation.$succeeded,
  target: getSessionQuery.reset,
})

interface ChainParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherwise?: Event<void> | Effect<void, any, any>
}

export const chainAuthorized = <Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams = {}
) => {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const sessionReceivedAnonymous = createEvent<RouteParamsAndQuery<Params>>()

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'done',
  })

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'fail',
  })

  sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'initial',
    target: getSessionQuery.start,
  })

  sample({
    clock: [alreadyAnonymous, getSessionQuery.$failed],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  })

  if (otherwise) {
    sample({
      clock: sessionReceivedAnonymous,
      target: otherwise as EventCallable<void>,
    })
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAuthenticated, getSessionQuery.$succeeded],
    cancelOn: sessionReceivedAnonymous,
  })
}

export function chainAnonymous<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams = {}
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const sessionReceivedAuthenticated =
    createEvent<RouteParamsAndQuery<Params>>()

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'done',
  })

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'fail',
  })

  sample({
    clock: sessionCheckStarted,
    source: getSessionQuery.$status,
    filter: (status) => status === 'initial',
    target: getSessionQuery.start,
  })

  sample({
    clock: [alreadyAuthenticated, getSessionQuery.$succeeded],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAuthenticated,
  })

  if (otherwise) {
    sample({
      clock: sessionReceivedAuthenticated,
      target: otherwise as EventCallable<void>,
    })
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAnonymous, getSessionQuery.$failed],
    cancelOn: sessionReceivedAuthenticated,
  })
}
