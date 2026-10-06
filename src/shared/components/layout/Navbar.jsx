import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogOut, Menu, ShoppingBag, UserRound, X } from 'lucide-react'
import { Avatar } from '@shared/components/ui'
import { ROLE_LABELS } from '@shared/utils/constants'
import Logo from './Logo'
import { NAV_LINKS } from './navLinks'

/**
 * Top navigation bar. It is a pure component: the layout passes in the
 * current user, the cart count and the logout handler, so this file does not
 * depend on any feature.
 */
export default function Navbar({ user, cartCount = 0, onLogout }) {
  const count = cartCount
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close the mobile menu on navigation; add a shadow once the page scrolls.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const role = user?.role ?? 'guest'
  const links = NAV_LINKS[role] ?? NAV_LINKS.guest
  const showCart = role === 'guest' || role === 'customer'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`

  const cartButton = showCart && (
    <Link
      to="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-brand-50 hover:text-brand-600"
      aria-label={`Cart, ${count} items`}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-fade-in items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  )

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'border-gray-200 shadow-sm' : 'border-transparent'}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to + l.label} to={l.to} end={l.end} className={linkClass}>
              <l.icon className="h-4 w-4" aria-hidden="true" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {cartButton}
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 transition hover:bg-gray-100"
              >
                <Avatar user={user} />
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold text-gray-900">{user.username}</span>
                  <span className="block text-xs text-gray-500">{ROLE_LABELS[user.role]}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="btn-ghost rounded-xl p-2.5"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: cart + menu toggle */}
        <div className="flex items-center gap-1 md:hidden">
          {cartButton}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-gray-100 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden">
          {user && (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Avatar user={user} size="h-10 w-10 text-sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
          )}
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to + l.label} to={l.to} end={l.end} className={linkClass}>
                <l.icon className="h-4 w-4" aria-hidden="true" />
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/profile" className={linkClass}>
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log out
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-outline">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
