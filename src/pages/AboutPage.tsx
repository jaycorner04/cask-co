import { ShieldCheck } from 'lucide-react'
import { PageHero, Section } from '../components/layout'

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="A concierge cellar for modern India" copy="CASK & CO. blends verified compliance, premium procurement and tasting-room curation for serious buyers." />
      <Section eyebrow="Our standard" title="Luxury without noise">
        <div className="grid gap-5 md:grid-cols-3">
          {['Verified legal handoff', 'No dry-zone fulfillment', 'Temperature-aware routing'].map((item) => (
            <div className="lux-panel" key={item}><ShieldCheck className="mb-5 text-gold" /><h3 className="font-serif text-2xl">{item}</h3><p className="mt-3 text-white/50">Compliance and care are built into the booking flow.</p></div>
          ))}
        </div>
      </Section>
    </>
  )
}