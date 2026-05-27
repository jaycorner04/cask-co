import { useState } from 'react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { bottleImages } from '../data/catalog'
import { authSchema, type AuthForm } from '../schemas/forms'
import { Input } from '../components/layout'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const form = useForm<AuthForm>({ resolver: zodResolver(authSchema), defaultValues: { ageConfirm: false } })
  const password = useWatch({ control: form.control, name: 'password' }) ?? ''
  const strength = Math.min(100, password.length * 12)

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode)
    setMessage('')
    form.clearErrors()
  }

  const onSubmit = (values: AuthForm) => {
    if (mode === 'signup') {
      if (!values.name?.trim()) {
        form.setError('name', { message: 'Enter your full name' })
        return
      }
      if (!values.phone || values.phone.replace(/\D/g, '').length < 10) {
        form.setError('phone', { message: 'Enter a valid phone number' })
        return
      }
      if (!values.ageConfirm) {
        form.setError('ageConfirm', { message: 'Age confirmation is required' })
        return
      }

      localStorage.setItem(
        'cask-auth-user',
        JSON.stringify({
          name: values.name.trim(),
          email: values.email,
          phone: values.phone,
          dob: values.dob,
        }),
      )
      localStorage.setItem('cask-auth-session', 'true')
      setMessage('Account created. Opening your dashboard...')
      window.setTimeout(() => navigate('/dashboard'), 650)
      return
    }

    const savedUser = localStorage.getItem('cask-auth-user')
    if (!savedUser) {
      setMessage('Signed in for this demo session. Create an account to save your details.')
    } else {
      setMessage('Signed in. Opening your dashboard...')
    }
    localStorage.setItem('cask-auth-session', 'true')
    window.setTimeout(() => navigate('/dashboard'), 650)
  }

  return (
    <section className="grid min-h-screen pt-20 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img className="h-full w-full object-cover opacity-70" src={bottleImages[0]} alt="Premium bottle service" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <h1 className="absolute bottom-16 left-16 max-w-md font-serif text-6xl">Members get the first pour.</h1>
      </div>
      <div className="grid place-items-center p-5">
        <motion.form className="glass-panel w-full max-w-lg p-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-8 flex border-b border-gold/15">
            {(['signin', 'signup'] as const).map((item) => (
              <button className={`auth-tab ${mode === item ? 'active' : ''}`} type="button" onClick={() => switchMode(item)} key={item}>
                {item === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
          {mode === 'signup' && <Input label="Name" autoComplete="name" error={form.formState.errors.name?.message} {...form.register('name')} />}
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <Input label="Password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} error={form.formState.errors.password?.message} {...form.register('password')} />
          <div className="mt-2 h-2 overflow-hidden bg-white/10"><motion.div className="h-full bg-gold" animate={{ width: `${strength}%` }} /></div>
          {mode === 'signup' && (
            <>
              <Input label="Phone" autoComplete="tel" error={form.formState.errors.phone?.message} {...form.register('phone')} />
              <Input label="DOB" type="date" error={form.formState.errors.dob?.message} {...form.register('dob')} />
              <label className="mt-5 flex items-center gap-3 text-sm text-white/55">
                <input type="checkbox" {...form.register('ageConfirm')} />
                I confirm I am of legal drinking age.
              </label>
              {form.formState.errors.ageConfirm?.message && <span className="text-sm text-red-300">{form.formState.errors.ageConfirm.message}</span>}
            </>
          )}
          {message && <p className="mt-5 border border-gold/15 bg-black/20 p-3 text-sm text-gold">{message}</p>}
          <button
            className="btn-primary shimmer mt-7 w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
            aria-label={mode === 'signin' ? 'Submit sign in' : 'Submit create account'}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
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
