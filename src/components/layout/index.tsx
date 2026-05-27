import { forwardRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, LayoutDashboard, Menu, Minus, Plus, Search, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import { endSession, getCurrentUser } from '../../services/auth'
import { formatPrice } from '../../utils/product'

export function AgeGate() {
  const { ageVerified, verifyAge, denyAge } = useAppStore()
  const [error, setError] = useState(false)

  if (ageVerified) return null

  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-5 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,168,76,0.2),transparent_35%)]" />
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          className="absolute h-1 w-1 bg-gold"
          style={{ left: `${12 + ((index * 43) % 76)}%`, top: `${10 + ((index * 29) % 78)}%` }}
          animate={{ y: [-8, -42, -8], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 4 + index * 0.12, repeat: Infinity, delay: index * 0.16 }}
          key={index}
        />
      ))}
      <motion.div
        className="glass-panel relative w-full max-w-xl p-8 text-center sm:p-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={error ? { x: [0, -12, 12, -8, 8, 0], opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      >
        <motion.div
          className="mx-auto mb-6 grid h-20 w-20 place-items-center border border-gold/40 bg-gold/10 font-serif text-2xl text-gold"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          C&C
        </motion.div>
        <p className="eyebrow justify-center">Age verification required</p>
        <h1 className="mt-4 font-serif text-5xl text-gold sm:text-6xl">CASK & CO.</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Premium spirits are available only to customers of legal drinking age in their delivery zone.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <motion.button className="btn-primary shimmer" whileTap={{ scale: 0.98 }} onClick={verifyAge}>
            I am 21+
          </motion.button>
          <button
            className="btn-outline"
            onClick={() => {
              denyAge()
              setError(true)
            }}
          >
            I am under 21
          </button>
        </div>
        {error && <p className="mt-5 text-sm text-red-300">Entry blocked. Legal age confirmation is mandatory.</p>}
        <p className="mt-8 text-xs uppercase tracking-normal text-white/40">
          Drink responsibly. Do not drink and drive.
        </p>
      </motion.div>
    </motion.div>
  )
}

export function Navbar() {
  const { cart, setCartOpen, mobileOpen, setMobileOpen } = useAppStore()
  const [solid, setSolid] = useState(false)
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const user = getCurrentUser()
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const signOut = () => {
    endSession()
    setMobileOpen(false)
    navigate('/signin')
  }

  const links = [
    ['Home', '/'],
    ['Shop', '/shop'],
    ['Tastings', '/tastings'],
    ['About', '/about'],
    ['Track Order', '/track'],
  ]

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? 'nav-solid' : 'bg-transparent'}`} data-route={pathname}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-gold/40 bg-gold/10 font-serif text-sm text-gold">
            C&C
          </span>
          <span className="font-serif text-xl text-gold">CASK & CO.</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, to]) => (
            <NavLink className="nav-link" to={to} key={to}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Search">
            <Search size={18} />
          </IconButton>
          <IconButton label="Cart" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </IconButton>
          {user ? (
            <>
              <Link className="hidden lg:block" to="/dashboard">
                <button className="btn-ghost">
                  <User size={16} />
                  <span className="max-w-36 truncate">{user.name}</span>
                </button>
              </Link>
              <button className="btn-ghost hidden lg:inline-flex" type="button" onClick={signOut}>
                Sign Out
              </button>
            </>
          ) : (
            <Link className="hidden lg:block" to="/signin">
              <button className="btn-ghost">
                <User size={16} />
                Sign In
              </button>
            </Link>
          )}
          <IconButton label="Menu" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </IconButton>
        </div>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-y-0 right-0 z-[80] w-80 border-l border-gold/20 bg-[#100c08] p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="font-serif text-gold">CASK & CO.</span>
              <IconButton label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </IconButton>
            </div>
            <div className="grid gap-4">
              {links.map(([label, to]) => (
                <NavLink className="mobile-link" to={to} onClick={() => setMobileOpen(false)} key={to}>
                  {label}
                  <ChevronRight size={18} />
                </NavLink>
              ))}
              <NavLink className="mobile-link" to="/admin" onClick={() => setMobileOpen(false)}>
                Admin
                <LayoutDashboard size={18} />
              </NavLink>
              {user ? (
                <>
                  <NavLink className="mobile-link" to="/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                    <User size={18} />
                  </NavLink>
                  <button className="mobile-link" type="button" onClick={signOut}>
                    Sign Out
                    <X size={18} />
                  </button>
                </>
              ) : (
                <NavLink className="mobile-link" to="/signin" onClick={() => setMobileOpen(false)}>
                  Sign In
                  <User size={18} />
                </NavLink>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  )
}

export function IconButton({
  children,
  label,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  label: string
  className?: string
  onClick?: () => void
}) {
  return (
    <button className={`icon-button ${className}`} type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, changeQuantity, removeFromCart } = useAppStore()
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const tax = Math.round(subtotal * 0.18)

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-gold/20 bg-[#100c08] p-6 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-gold">Reserve Cart</h2>
              <IconButton label="Close cart" onClick={() => setCartOpen(false)}>
                <X size={18} />
              </IconButton>
            </div>
            <div className="mt-8 flex-1 space-y-4 overflow-auto">
              <AnimatePresence initial={false}>
                {cart.map((line) => (
                  <motion.div
                    className="cart-line"
                    key={line.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                  >
                    <img src={line.image} alt={line.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg">{line.name}</p>
                      <p className="text-sm text-white/45">{line.volume} - {formatPrice(line.price)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="quantity-btn" onClick={() => changeQuantity(line.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <button className="quantity-btn" onClick={() => changeQuantity(line.id, 1)}>
                          <Plus size={14} />
                        </button>
                        <button className="ml-auto text-xs uppercase text-white/40" onClick={() => removeFromCart(line.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cart.length === 0 && <p className="rounded border border-gold/10 p-8 text-center text-white/45">Your cellar is waiting.</p>}
            </div>
            <div className="space-y-3 border-t border-gold/15 pt-5">
              <div className="flex justify-between text-sm text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/50">
                <span>Estimated tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-serif text-2xl text-gold">
                <span>Total</span>
                <span>{formatPrice(subtotal + tax)}</span>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)}>
                <button className="btn-primary shimmer mt-3 w-full">Checkout</button>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-hero">
      <div className="grain" />
      <div className="mx-auto max-w-7xl px-4 pt-36 sm:px-6 lg:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-none sm:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-white/55">{copy}</p>
      </div>
    </section>
  )
}

export function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-5xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  )
}

export function SkeletonGrid() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-[460px]" key={index} />)}</div>
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(
  function Input({ label, error, ...props }, ref) {
    return (
      <label className="grid gap-2 text-sm text-white/50">
        {label}
        <input className="field" ref={ref} {...props} />
        {error && <span className="text-red-300">{error}</span>}
      </label>
    )
  },
)

export function OrderSummary({ total }: { total: number }) {
  return (
    <aside className="lux-panel h-fit">
      <h3 className="font-serif text-3xl">Order summary</h3>
      <div className="mt-5 space-y-3 text-sm text-white/55">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
        <div className="flex justify-between"><span>GST estimate</span><span>{formatPrice(Math.round(total * 0.18))}</span></div>
        <div className="flex justify-between"><span>Concierge delivery</span><span>Included</span></div>
      </div>
      <div className="mt-5 border-t border-gold/15 pt-5 font-serif text-3xl text-gold">{formatPrice(Math.round(total * 1.18))}</div>
    </aside>
  )
}

export function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="lux-panel"><h3 className="mb-5 font-serif text-3xl">{title}</h3>{children}</div>
}

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-[#080604] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-serif text-3xl text-gold">CASK & CO.</p>
          <p className="mt-3 text-sm text-white/45">Rare Finds. Delivered.</p>
          <p className="mt-6 text-xs uppercase tracking-normal text-white/35">Drink responsibly. Do not drink and drive.</p>
        </div>
        <div className="grid gap-6 text-sm text-white/45 sm:grid-cols-3">
          <p>License: IN-URB-SPIRITS-2026</p>
          <p>No delivery to dry states or restricted zones.</p>
          <p>Terms: no returns on opened bottles. Age verification required at delivery.</p>
        </div>
      </div>
    </footer>
  )
}
