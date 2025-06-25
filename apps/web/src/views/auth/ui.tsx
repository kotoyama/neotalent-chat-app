import { Auth } from '~/features/auth'

const authModel = Auth.factory.createModel()

export const AuthPage = () => {
  return <Auth.View model={authModel} />
}
