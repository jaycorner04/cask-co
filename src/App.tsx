import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AgeGate, CartDrawer, Footer, Navbar } from './components/layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AuthPage } from './pages/AuthPage'
import { UserDashboard } from './pages/UserDashboard'
import { TastingsPage } from './pages/TastingsPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { AboutPage } from './pages/AboutPage'
import { TrackOrderPage } from './pages/TrackOrderPage'

function App() {
  return (
    <div className="min-h-screen bg-cask text-white">
      <AgeGate />
      <Navbar />
      <CartDrawer />
      <RouteLiquidWipe />
      <main>
        <AnimatePresence mode="wait">
          <AnimatedRoutes />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageShell><HomePage /></PageShell>} />
      <Route path="/shop" element={<PageShell><ShopPage /></PageShell>} />
      <Route path="/product/:id" element={<PageShell><ProductDetailPage /></PageShell>} />
      <Route path="/checkout" element={<PageShell><CheckoutPage /></PageShell>} />
      <Route path="/signin" element={<PageShell><AuthPage /></PageShell>} />
      <Route path="/dashboard" element={<PageShell><UserDashboard /></PageShell>} />
      <Route path="/tastings" element={<PageShell><TastingsPage /></PageShell>} />
      <Route path="/about" element={<PageShell><AboutPage /></PageShell>} />
      <Route path="/track" element={<PageShell><TrackOrderPage /></PageShell>} />
      <Route path="/admin" element={<PageShell><AdminDashboard /></PageShell>} />
    </Routes>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RouteLiquidWipe() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="pointer-events-none fixed inset-y-0 left-0 z-[90] w-full origin-left bg-gradient-to-r from-gold via-amber-200 to-crimson"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0], originX: [0, 0, 1] }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
    </AnimatePresence>
  )
}

export default App
