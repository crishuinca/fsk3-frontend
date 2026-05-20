import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
