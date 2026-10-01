import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import OrderDetail from './pages/OrderDetail'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import MyOrders from './pages/customer/MyOrders'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerMenu from './pages/owner/OwnerMenu'
import OwnerOrders from './pages/owner/OwnerOrders'
import RiderDashboard from './pages/rider/RiderDashboard'

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]) // start each page at the top

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />

          {/* Any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Route>

          {/* Customer */}
          <Route element={<ProtectedRoute roles={['customer']} />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>

          {/* Restaurant owner */}
          <Route element={<ProtectedRoute roles={['owner']} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/restaurants/:id" element={<OwnerMenu />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
          </Route>

          {/* Rider */}
          <Route element={<ProtectedRoute roles={['rider']} />}>
            <Route path="/rider" element={<RiderDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#e21b70', secondary: '#fff' } },
        }}
      />
    </>
  )
}
