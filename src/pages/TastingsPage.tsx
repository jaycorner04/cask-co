import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { bottleImages } from '../data/catalog'
import { PageHero } from '../components/layout'

export function TastingsPage() {
  const [packageName, setPackageName] = useState('Couple')

  return (
    <>
      <PageHero eyebrow="Private tastings" title="Book a guided tasting" copy="Calendar-led reservations for curated flights, led by cellar experts across your city." />
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="lux-panel">
            <div className="mb-8 grid gap-4 md:grid-cols-7">
              {Array.from({ length: 14 }).map((_, index) => (
                <button className={`date-tile ${index === 3 ? 'active' : ''}`} key={index}>
                  <span>May</span>
                  <strong>{26 + index}</strong>
                </button>
              ))}
            </div>
            <h3 className="font-serif text-3xl">Select a slot</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {['11:00', '13:30', '18:00', '20:30'].map((slot) => <button className="payment-option" key={slot}><CalendarDays size={18} /> {slot}</button>)}
            </div>
            <h3 className="mt-8 font-serif text-3xl">Package</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {['Solo', 'Couple', 'Group'].map((item) => (
                <button className={`package-card ${packageName === item ? 'active' : ''}`} onClick={() => setPackageName(item)} key={item}>
                  <span className="font-serif text-2xl">{item}</span>
                  <span className="text-sm text-white/45">{item === 'Group' ? '4-8 pax' : item === 'Couple' ? '2 pax' : '1 pax'}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lux-panel">
            <img className="aspect-[4/3] w-full object-cover" src={bottleImages[2]} alt="Sommelier tasting setup" />
            <p className="eyebrow mt-5">Expert host</p>
            <h3 className="mt-2 font-serif text-3xl">Aarav Mehta</h3>
            <p className="mt-3 text-white/55">Certified spirits educator, single malt specialist and menu designer for private clubs.</p>
            <div className="mt-6 border border-gold/15 p-4">
              <p className="font-serif text-2xl">Preview menu</p>
              <p className="mt-2 text-white/50">Speyside malt, aged rum, grower champagne and a blind Indian wine pour.</p>
            </div>
            <button className="btn-primary shimmer mt-6 w-full">Confirm Booking 🥂</button>
          </div>
        </div>
      </section>
    </>
  )
}