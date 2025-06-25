import { Suspense } from 'react'
import { RouterProvider } from 'atomic-router-react'

import '@fontsource/poppins'
import '@repo/ui/style.css'

import { router } from '~/shared/config/routes'
import { Pages } from '~/views'

import './index.css'

export function App() {
  return (
    <RouterProvider router={router}>
      <Suspense fallback="Loading...">
        <Pages />
      </Suspense>
    </RouterProvider>
  )
}
