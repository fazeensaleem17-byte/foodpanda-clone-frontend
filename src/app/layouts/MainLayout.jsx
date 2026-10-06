import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth'
import { useCart } from '@features/cart'
import { Footer, Navbar } from '@shared/components/layout'

/** Page frame shared by every route: navbar on top, the page in the middle, footer at the bottom. */
export default function MainLayout() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const handleLogout = () => {
    logout('You have been logged out.')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} cartCount={count} onLogout={handleLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
