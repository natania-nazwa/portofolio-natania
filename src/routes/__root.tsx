import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Not Found</h1>
        <p className="text-slate-600">Halaman tidak ditemukan.</p>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

