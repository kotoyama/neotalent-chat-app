import { env } from '../env'

const withApiUrl = (path: string) => `${env().apiUrl}/api${path}`

export const api = {
  auth: {
    post: withApiUrl('/auth'),
  },
  session: {
    get: withApiUrl('/session'),
    delete: withApiUrl('/session'),
  },
  chat: {
    get: withApiUrl('/chat/messages'),
    post: withApiUrl('/chat/messages'),
  },
}
