import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { applyTheme, getPreferredTheme } from './lib/theme'

const router = createRouter({
  routeTree,
})

// init theme before render
applyTheme(getPreferredTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

