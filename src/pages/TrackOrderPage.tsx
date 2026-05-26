import { Check } from 'lucide-react'
import { PageHero, Section } from '../components/layout'

export function TrackOrderPage() {
  return (
    <>
      <PageHero eyebrow="Track order" title="Follow the bottle" copy="Enter an order ID to view packing, dispatch, delivery ETA and age-verification status." />
      <Section eyebrow="Tracking" title="Live status">
        <div className="lux-panel mx-auto max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <input className="field" defaultValue="CASK-2481" />
            <button className="btn-primary">Track</button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Placed', 'Packed', 'Dispatched', 'Delivered'].map((stage, index) => (
              <div className="timeline-step" key={stage}><Check size={18} className={index < 3 ? 'text-gold' : 'text-white/30'} /> {stage}</div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}