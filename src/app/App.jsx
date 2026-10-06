import { Toaster } from 'react-hot-toast'
import AppProviders from './providers/AppProviders'
import AppRoutes from './routes'

const TOAST_OPTIONS = {
  duration: 3500,
  style: { borderRadius: '12px', fontSize: '14px' },
  success: { iconTheme: { primary: '#e21b70', secondary: '#fff' } },
}

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster position="top-center" toastOptions={TOAST_OPTIONS} />
    </AppProviders>
  )
}
