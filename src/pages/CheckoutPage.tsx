import { useState } from 'react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, MapPin, PackageCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import useAppStore from '../store/useAppStore'
import { checkoutSchema, type CheckoutForm } from '../schemas/forms'
import { Input, OrderSummary, PageHero } from '../components/layout'

export function CheckoutPage() {
  const { cart } = useAppStore()
  const [step, setStep] = useState(1)
  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const form = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) })

  return (
    <>
      <PageHero eyebrow="Secure checkout" title="Confirm your reservation" copy="Three steps: address, payment, review. Every order requires age verification at handoff." />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="lux-panel">
            <div className="mb-8 grid grid-cols-3 gap-2">
              {['Address', 'Payment', 'Review'].map((label, index) => (
                <button className={`step-tab ${step === index + 1 ? 'active' : ''}`} onClick={() => setStep(index + 1)} key={label}>
                  {index + 1}. {label}
                </button>
              ))}
            </div>
            {step === 1 && (
              <form className="grid gap-4" onSubmit={form.handleSubmit(() => setStep(2))}>
                <Input label="Full name" error={form.formState.errors.name?.message} {...form.register('name')} />
                <Input label="Phone" error={form.formState.errors.phone?.message} {...form.register('phone')} />
                <Input label="Address" error={form.formState.errors.address?.message} {...form.register('address')} />
                <Input label="Pincode" error={form.formState.errors.pincode?.message} {...form.register('pincode')} />
                <div className="border border-gold/10 bg-black/20 p-4 text-white/50"><MapPin className="mb-2 text-gold" /> Map pin selector ready for integration</div>
                <button className="btn-primary">Continue to Payment</button>
              </form>
            )}
            {step === 2 && (
              <div className="grid gap-4">
                {['UPI', 'Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                  <button className="payment-option" key={method}><CreditCard size={18} /> {method}</button>
                ))}
                <button className="btn-primary" onClick={() => setStep(3)}>Review Order</button>
              </div>
            )}
            {step === 3 && (
              <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="grid place-items-center border border-gold/15 p-10 text-center">
                  <PackageCheck className="text-gold" size={44} />
                  <h2 className="mt-4 font-serif text-4xl">Ready to place</h2>
                  <p className="mt-2 text-white/50">Confetti burst and order webhooks can attach here.</p>
                  <button className="btn-primary shimmer mt-6">Place Order</button>
                </div>
              </motion.div>
            )}
          </div>
          <OrderSummary total={total} />
        </div>
      </section>
    </>
  )
}