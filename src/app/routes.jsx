import { Route, Routes } from 'react-router-dom'
import { LoginPage, ProfilePage, ProtectedRoute, RegisterPage } from '@features/auth'
import { CartPage } from '@features/cart'
import { CheckoutPage, MyOrdersPage, OrderDetailPage } from '@features/orders'
import { OwnerDashboardPage, OwnerMenuPage, OwnerOrdersPage } from '@features/owner'
import { HomePage, RestaurantPage } from '@features/restaurants'
import { RiderDashboardPage } from '@features/rider'
import MainLayout from './layouts/MainLayout'
import NotFoundPage from './NotFoundPage'

/** Every route of the app, grouped by who may open it. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants/:id" element={<RestaurantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Customer */}
        <Route element={<ProtectedRoute roles={['customer']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
        </Route>

        {/* Restaurant owner */}
        <Route element={<ProtectedRoute roles={['owner']} />}>
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/owner/restaurants/:id" element={<OwnerMenuPage />} />
          <Route path="/owner/orders" element={<OwnerOrdersPage />} />
        </Route>

        {/* Rider */}
        <Route element={<ProtectedRoute roles={['rider']} />}>
          <Route path="/rider" element={<RiderDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
