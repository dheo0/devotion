import { Outlet } from 'react-router-dom'
import { NavigationBar } from './NavigationBar'

export const AppLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <NavigationBar />
    <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
      <Outlet />
    </main>
  </div>
)
