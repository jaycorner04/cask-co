import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/catalog'
import { PageHero, Section } from '../components/layout'
import { ProductGrid } from '../components/products'
import { endSession, getCurrentUser, type AuthUser } from '../services/auth'

export function UserDashboard() {
  const navigate = useNavigate()
  const [user] = useState<AuthUser | null>(() => getCurrentUser())
  const tabs = ['Orders', 'Wishlist', 'Addresses', 'Profile', 'Preferences']

  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [navigate, user])

  const signOut = () => {
    endSession()
    navigate('/signin')
  }

  if (!user) return null

  return (
    <>
      <PageHero eyebrow="Member cellar" title={`Welcome, ${user.name}`} copy="Track orders, wishlist bottles, manage addresses and tune your tasting preferences." />
      <Section eyebrow="Account" title="Private controls">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lux-panel grid content-start gap-2">
            {tabs.map((tab) => <button className="dashboard-tab" key={tab}>{tab}</button>)}
            <button className="dashboard-tab mt-4 flex items-center gap-2" type="button" onClick={signOut}>
              <LogOut size={16} />
              Sign Out
            </button>
          </aside>
          <div className="lux-panel grid gap-8">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="detail-cell">
                <p className="eyebrow">Signed in as</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center border border-gold/30 bg-gold/10 text-gold">
                    <User size={20} />
                  </span>
                  <div>
                    <h3 className="font-serif text-3xl">{user.name}</h3>
                    <p className="text-sm text-white/45">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="detail-cell">
                <p className="eyebrow">Account status</p>
                <div className="mt-4 grid gap-3 text-sm text-white/60">
                  <p><span className="text-gold">Session:</span> Active</p>
                  <p><span className="text-gold">Phone:</span> {user.phone || 'Not added'}</p>
                  <p><span className="text-gold">Age check:</span> Verified at login</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-3xl">Order CASK-2481</h3>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {['Placed', 'Packed', 'Dispatched', 'Delivered'].map((stage, index) => (
                <motion.div className="timeline-step" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} key={stage}>
                  <Check size={18} />
                  <span>{stage}</span>
                </motion.div>
              ))}
            </div>
            </div>
            <ProductGrid items={products.slice(1, 5)} />
          </div>
        </div>
      </Section>
    </>
  )
}
