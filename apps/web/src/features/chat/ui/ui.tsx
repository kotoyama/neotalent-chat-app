import React from 'react'
import { modelView } from 'effector-factorio'
import { useUnit } from 'effector-react'
import { Button, Input } from '@repo/ui/components'

import { appName } from '~/shared/settings'
import { signOutClicked } from '~/entities/session'

import { chatModel } from '../model'
import { CalorieCard } from './calorie-card'
import styles from './chat.module.css'

export const ChatConversation = modelView(chatModel, () => {
  const model = chatModel.useModel()

  const [messages, draft, isSending] = useUnit([
    model.$messages,
    model.$draft,
    model.postMessageMutation.$pending,
  ])

  const bottomRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    model.chatInitialized()
  }, [])

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    model.sendMessage(draft)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>{appName}</span>
        <Button variant="outlined" onClick={() => signOutClicked()}>
          Sign Out
        </Button>
      </header>
      <main className={styles.history}>
        <section>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.msg}>
              {msg.sender === 'assistant' ? (
                <CalorieCard message={msg} />
              ) : (
                <div className={styles.bubbleContainer} data-sender="user">
                  <div
                    className={styles.bubble}
                    data-processing={msg.status === 'processing'}
                  >
                    {msg.status === 'processing' && (
                      <span className={styles.loader} />
                    )}
                    {msg.content}
                  </div>
                  {msg.status === 'error' && (
                    <span className={styles.error}>An error occurred</span>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </section>
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <Input
            value={draft}
            placeholder="Type your meal or ingredients..."
            disabled={isSending}
            onChange={(e) => model.inputChanged(e.target.value)}
          />
          <Button type="submit" disabled={isSending || !draft.trim()}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </main>
    </div>
  )
})
