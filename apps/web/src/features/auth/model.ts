import {
  createJsonMutation,
  declareParams,
  type HttpError,
  isHttpErrorCode,
} from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { modelFactory } from 'effector-factorio'
import { type AddErrorPayload, createForm } from 'effector-forms'
import { createStore, type EventCallable, sample } from 'effector'
import { not } from 'patronum'
import { z } from 'zod'
import { RequestError, ValidationError } from '@repo/shared-types/types'
import { postAuthBody } from '@repo/shared-types/contracts'

import { getSessionQuery } from '~/entities/session'
import { api } from '~/shared/config/api'
import {
  createRule,
  isErrorWithDescription,
  mapValidationError,
} from '~/shared/lib/forms'

export const authModel = modelFactory(() => {
  const $error = createStore<string | null>(null)

  const authForm = createForm({
    filter: not($error),
    fields: {
      email: {
        init: '',
        rules: [
          createRule<string>({
            name: 'email',
            schema: z
              .string()
              .nonempty('Field is required')
              .email('Incorrect email'),
          }),
        ],
      },
      password: {
        init: '',
        rules: [
          createRule<string>({
            name: 'password',
            schema: z
              .string()
              .nonempty('Field is required')
              .min(8, 'The password must consist of at least 8 characters'),
          }),
        ],
      },
    },
  })

  const authMutation = createJsonMutation({
    params: declareParams<z.infer<typeof postAuthBody>>(),
    request: {
      method: 'POST',
      url: api.auth.post,
      credentials: 'include',
      body: (payload) => payload,
    },
    response: {
      contract: zodContract(z.null()),
      status: {
        expected: 201,
      },
    },
  })

  sample({
    clock: [authForm.fields.email.changed, authForm.fields.password.changed],
    target: $error.reinit,
  })

  sample({
    clock: authForm.formValidated,
    target: authMutation.start,
  })

  sample({
    clock: authMutation.finished.success,
    target: getSessionQuery.start,
  })

  const authBadRequest = sample({
    clock: authMutation.finished.failure,
    filter: isHttpErrorCode(400),
    fn: (error) =>
      (error.error as unknown as HttpError<400>).response as RequestError,
  })

  const authValidationErr = sample({
    clock: authMutation.finished.failure,
    filter: isHttpErrorCode(422),
    fn: (error) =>
      (error.error as unknown as HttpError<422>).response as ValidationError,
  })

  sample({
    clock: authBadRequest,
    filter: isErrorWithDescription,
    fn: (error) => error.description,
    target: $error,
  })

  sample({
    clock: authValidationErr,
    fn: mapValidationError,
    target: authForm.addErrors as EventCallable<AddErrorPayload[]>,
  })

  return {
    $error,
    authForm,
    authMutation,
  }
})
