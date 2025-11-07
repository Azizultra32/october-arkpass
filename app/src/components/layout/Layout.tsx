import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      {/* TODO: Add navigation header */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Outlet />
      </main>
      {/* TODO: Add bottom navigation bar */}
    </div>
  )
}
