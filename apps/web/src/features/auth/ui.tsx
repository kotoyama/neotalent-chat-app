import React from 'react'
import { useForm } from 'effector-forms'
import { modelView } from 'effector-factorio'
import { useUnit } from 'effector-react'
import { FormInput, Button, Card, Alert } from '@repo/ui/components'

import { appName } from '~/shared/settings'

import { authModel } from './model'
import styles from './form.module.css'

export const AuthForm = modelView(authModel, () => {
  const model = authModel.useModel()

  const authForm = useForm(model.authForm)
  const [isPending, error] = useUnit([
    model.authMutation.$pending,
    model.$error,
  ])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    authForm.submit()
  }

  return (
    <Card className={styles.container}>
      <h1>{appName}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          id="auth-email"
          name="email"
          type="email"
          label="Email"
          value={authForm.fields.email.value}
          onChange={(e) => authForm.fields.email.onChange(e.target.value)}
          autoComplete="email"
          aria-required="true"
          errorText={authForm.fields.email.errorText()}
        />
        <FormInput
          id="auth-password"
          name="password"
          type="password"
          label="Password"
          value={authForm.fields.password.value}
          onChange={(e) => authForm.fields.password.onChange(e.target.value)}
          autoComplete="current-password"
          aria-required="true"
          errorText={authForm.fields.password.errorText()}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Loading...' : 'Authenticate'}
        </Button>
      </form>
      {error && (
        <Alert type="error" className={styles.error}>
          {error}
        </Alert>
      )}
    </Card>
  )
})
