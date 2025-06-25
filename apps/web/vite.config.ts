import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': Bun.fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      cssModules: {
        pattern: '[hash]_[local]',
      },
      drafts: {
        customMedia: true,
      },
      targets: browserslistToTargets(browserslist()),
    },
  },
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
