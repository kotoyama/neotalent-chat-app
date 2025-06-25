import {
  createJsonQuery,
  declareParams,
  createJsonMutation,
} from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { modelFactory } from 'effector-factorio'
import { createStore, createEvent, sample } from 'effector'
import { interval } from 'patronum/interval'
import { z } from 'zod'
import {
  getChatMessagesQuery,
  getChatMessagesResponse,
  postMessageBody,
  postChatMessageResponse,
} from '@repo/shared-types/contracts'
import type { Message } from '@repo/shared-types/types'

import { api } from '~/shared/config/api'

import { qs } from './lib'

const fetchMessagesQuery = createJsonQuery({
  params: declareParams<z.infer<typeof getChatMessagesQuery>>(),
  request: {
    method: 'GET',
    url: (params) => `${api.chat.get}${qs(params)}`,
    credentials: 'include',
  },
  response: {
    contract: zodContract(getChatMessagesResponse),
  },
})

const postMessageMutation = createJsonMutation<
  z.infer<typeof postMessageBody>,
  z.infer<typeof postChatMessageResponse>
>({
  params: declareParams<z.infer<typeof postMessageBody>>(),
  request: {
    method: 'POST',
    url: api.chat.post,
    credentials: 'include',
    body: (p) => p,
  },
  response: {
    contract: zodContract(postChatMessageResponse),
  },
})

export const chatModel = modelFactory(() => {
  const $draft = createStore('')
  const $messages = createStore<Message[]>([])
  const $processing = createStore(false)
  const $lastSentId = createStore<number | null>(null)

  const processingStarted = createEvent<number>()
  const processingEnded = createEvent<number>()

  const chatInitialized = createEvent()
  const inputChanged = createEvent<string>()
  const sendMessage = createEvent<string>()

  const markAsProcessed = createEvent<number>()

  $draft
    .on(inputChanged, (_, v) => v)
    .reset(postMessageMutation.finished.success)
  $processing.on(processingStarted, () => true).reset(processingEnded)
  $lastSentId.on(processingStarted, (_, id) => id).reset(processingEnded)

  $messages
    .on(fetchMessagesQuery.finished.success, (messages, { params, result }) => {
      if (params.after) {
        return [...messages, ...result]
      }
      return [...result]
    })
    .on(
      postMessageMutation.finished.success,
      (messages, { params, result }) => [
        ...messages,
        // optimistic update
        {
          id: result.messageId,
          sender: 'user',
          content: params.content,
          metadata: {},
          status: 'processing',
          inserted_at: new Date().toISOString(),
        },
      ]
    )
    .on(markAsProcessed, (messages, targetId) => {
      return messages.map((msg) => msg.id === targetId ? {
        ...msg,
        status: 'processed',
      } : msg)
    })

  sample({
    clock: chatInitialized,
    fn: () => ({}),
    target: fetchMessagesQuery.start,
  })

  sample({
    clock: sendMessage,
    filter: (text) => text.trim().length > 0,
    fn: (text) => ({ content: text.trim() }),
    target: postMessageMutation.start,
  })

  sample({
    clock: postMessageMutation.finished.success,
    fn: ({ result }) => result.messageId,
    target: processingStarted,
  })

  const { tick } = interval({
    timeout: 2000,
    start: processingStarted,
    stop: processingEnded,
    leading: false,
  })

  sample({
    clock: tick,
    source: $lastSentId,
    filter: Boolean,
    fn: (afterId) => ({ after: afterId }),
    target: fetchMessagesQuery.start,
  })

  sample({
    clock: fetchMessagesQuery.finished.success,
    source: $lastSentId,
    filter: (lastId, { result }) =>
      !!lastId && result.some((m) => m.reply_to_id === lastId),
    fn: (lastId) => lastId as number,
    target: processingEnded,
  })

  sample({
    clock: processingEnded,
    target: markAsProcessed,
  })

  return {
    $messages,
    $draft,
    chatInitialized,
    inputChanged,
    sendMessage,
    postMessageMutation,
  }
})
