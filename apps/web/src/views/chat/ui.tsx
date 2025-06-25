import { Chat } from '~/features/chat'

const chatModel = Chat.factory.createModel()

export const ChatPage = () => {
  return <Chat.View model={chatModel} />
}
