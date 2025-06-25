import { z } from 'zod'

export const postAuthBody = z.object({
  email: z.string().email(),
  password: z.string().regex(new RegExp('^w{4,20}$')),
})

export const getAuthSessionResponse = z.object({
  email: z.string().email(),
})

export const chatMessage = z.object({
  id: z.number().int(),
  sender: z.enum(['user', 'assistant']),
  content: z.string(),
  metadata: z.record(z.unknown()),
  status: z.enum(['processing', 'processed', 'error']).nullable().optional(),
  reply_to_id: z.number().int().nullable().optional(),
  inserted_at: z.string(),
})

export const getChatMessagesQuery = z.object({
  after: z.number().int().optional(),
})

export const getChatMessagesResponse = chatMessage.array()

export const postMessageBody = z.object({
  content: z.string().min(1).max(255),
})

export const postChatMessageResponse = z.object({
  messageId: z.number().int(),
  status: z.literal('processing'),
})
