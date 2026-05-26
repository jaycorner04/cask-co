import { useState } from 'react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { bottleImages } from '../data/catalog'
import { authSchema, type AuthForm } from '../schemas/forms'
import { Input } from '../components/layout'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const form = useForm<AuthForm>({ resolver: zodResolver(authSchema), defaultValues: { ageConfirm: false } })
  const password = useWatch({ control: form.control, name: 'password' }) ?? ''
  const strength = Math.min(100, password.length * 12)

  return (
    <section className="grid min-h-screen pt-20 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img className="h-full w-full object-cover opacity-70" src={bottleImages[0]} alt="Premium bottle service" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <h1 className="absolute bottom-16 left-16 max-w-md font-serif text-6xl">Members get the first pour.</h1>
      </div>
      <div className="grid place-items-center p-5">
        <motion.form className="glass-panel w-full max-w-lg p-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex border-b border-gold/15">
            {(['signin', 'signup'] as const).map((item) => (
              <button className={`auth-tab ${mode === item ? 'active' : ''}`} type="button" onClick={() => setMode(item)} key={item}>
                {item === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
          {mode === 'signup' && <Input label="Name" />}
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register('password')} />
          <div className="mt-2 h-2 overflow-hidden bg-white/10"><motion.div className="h-full bg-gold" animate={{ width: `${strength}%` }} /></div>
          {mode === 'signup' && (
            <>
              <Input label="Phone" />
              <Input label="DOB" type="date" />
              <label className="mt-5 flex items-center gap-3 text-sm text-white/55">
                <input type="checkbox" {...form.register('ageConfirm')} />
                I confirm I am of legal drinking age.
              </label>
            </>
          )}
          <button className="btn-primary shimmer mt-7 w-full" type="button">{mode === 'signin' ? 'Sign In' : 'Verify OTP'}</button>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-outline" type="button">Google</button>
            <button className="btn-outline" type="button">Apple</button>
          </div>
          <button className="mt-5 text-sm text-gold" type="button">Forgot Password?</button>
        </motion.form>
      </div>
    </section>
  )
}