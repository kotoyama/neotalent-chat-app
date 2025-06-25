import React from 'react'
import { type Metadata } from '@repo/shared-types/types'
import { type Message } from '@repo/shared-types/types'

type Props = {
  message: Message
}

import styles from './chat.module.css'
import cardStyles from './calorie-card.module.css'

export const CalorieCard: React.FC<Props> = ({ message }) => {
  if (!message.metadata || !Object.keys(message.metadata).length) {
    return (
      <code className={styles.bubbleContainer} data-sender="ai">
        <pre className={styles.bubble}>
          <p>{message.content}</p>
        </pre>
      </code>
    )
  }

  const {
    meal = '—',
    serving_size = '—',
    totals = {} as Metadata['totals'],
    per_ingredient = [],
    notes,
    disclaimer,
  } = message.metadata as Metadata

  const calories = totals?.calories_kcal ?? '?'
  const protein = totals?.protein_g ?? '?'
  const carbs = totals?.carbs_g ?? '?'
  const fat = totals?.fat_g ?? '?'

  return (
    <div className={styles.bubbleContainer} data-sender="ai">
      <div className={styles.bubble}>
        <div>
          <p className={cardStyles.meal}>{meal}</p>
          <p className={cardStyles.serving}>
            <strong>Serving size:</strong> {serving_size}
          </p>
        </div>

        <section className={cardStyles.totalsSection}>
          <dl className={cardStyles.totalsGrid}>
            <div>
              <dt>Calories</dt>
              <dd>{calories} kcal</dd>
            </div>
            <div>
              <dt>Protein</dt>
              <dd>{protein} g</dd>
            </div>
            <div>
              <dt>Carbs</dt>
              <dd>{carbs} g</dd>
            </div>
            <div>
              <dt>Fat</dt>
              <dd>{fat} g</dd>
            </div>
          </dl>
        </section>

        {per_ingredient && per_ingredient.length > 0 && (
          <details>
            <summary>Ingredient breakdown</summary>
            <ul className={cardStyles.ingredientList}>
              {per_ingredient.map((ing, idx) => (
                <li key={idx}>
                  <strong>{ing.ingredient ?? 'Unknown'}</strong>
                  {' – '} {ing.amount ?? '—'}: {ing.calories_kcal ?? '?'} kcal
                </li>
              ))}
            </ul>
          </details>
        )}

        {notes && <p className={cardStyles.notes}>{notes}</p>}
        {disclaimer && (
          <small className={cardStyles.disclaimer}>{disclaimer}</small>
        )}
      </div>
    </div>
  )
}
