import type { AuthForm } from '../schemas/forms'

export type AuthUser = {
  name: string
  email: string
  phone?: string
  dob?: string
}

export const DEMO_CREDENTIALS = {
  email: 'user@caskco.com',
  password: 'Cask@1234',
  user: {
    name: 'Demo User',
    email: 'user@caskco.com',
    phone: '9876543210',
    dob: '1998-01-01',
  },
}

const USER_KEY = 'cask-auth-user'
const PASSWORD_KEY = 'cask-auth-password'
const SESSION_KEY = 'cask-auth-session'

function readJson<T>(key: string) {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export function getStoredUser() {
  return readJson<AuthUser>(USER_KEY)
}

export function saveCreatedUser(values: AuthForm) {
  const user: AuthUser = {
    name: values.name?.trim() || values.email,
    email: values.email,
    phone: values.phone,
    dob: values.dob,
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(PASSWORD_KEY, values.password)
  return user
}

export function startSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, 'true')
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function endSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function isSignedIn() {
  return localStorage.getItem(SESSION_KEY) === 'true'
}

export function getCurrentUser() {
  if (!isSignedIn()) return null
  return getStoredUser() ?? DEMO_CREDENTIALS.user
}

export function authenticate(email: string, password: string) {
  if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return DEMO_CREDENTIALS.user
  }

  const savedUser = getStoredUser()
  const savedPassword = localStorage.getItem(PASSWORD_KEY)
  if (savedUser && savedUser.email.trim().toLowerCase() === email.trim().toLowerCase() && savedPassword === password) {
    return savedUser
  }

  return null
}
