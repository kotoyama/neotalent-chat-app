import { chatModel } from './model'
import { ChatConversation } from './ui'

export const Chat = {
  factory: chatModel,
  View: ChatConversation,
}
