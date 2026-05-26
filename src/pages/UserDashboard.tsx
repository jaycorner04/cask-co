import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { products } from '../data/catalog'
import { PageHero, Section } from '../components/layout'
import { ProductGrid } from '../components/products'

export function UserDashboard() {
  const tabs = ['Orders', 'Wishlist', 'Addresses', 'Profile', 'Preferences']

  return (
    <>
      <PageHero eyebrow="Member cellar" title="Your dashboard" copy="Track orders, wishlist bottles, manage addresses and tune your tasting preferences." />
      <Section eyebrow="Account" title="Private controls">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lux-panel grid content-start gap-2">
            {tabs.map((tab) => <button className="dashboard-tab" key={tab}>{tab}</button>)}
          </aside>
          <div className="lux-panel">
            <h3 className="font-serif text-3xl">Order CASK-2481</h3>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {['Placed', 'Packed', 'Dispatched', 'Delivered'].map((stage, index) => (
                <motion.div className="timeline-step" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} key={stage}>
                  <Check size={18} />
                  <span>{stage}</span>
                </motion.div>
              ))}
            </div>
            <ProductGrid items={products.slice(1, 5)} />
          </div>
        </div>
      </Section>
    </>
  )
}