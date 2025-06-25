import { createRoot } from 'react-dom/client'

import { appStarted } from '~/shared/entry-point'

import { App } from './app'

const root = createRoot(document.getElementById('app') as HTMLElement)

appStarted()

root.render(<App />)
