import { create } from 'zustand'
import type { AppStore } from '../types/catalog'

export const useAppStore = create<AppStore>((set) => ({
  ageVerified: localStorage.getItem('cask-age-verified') === 'true',
  cartOpen: false,
  mobileOpen: false,
  cart: [],
  verifyAge: () => {
    localStorage.setItem('cask-age-verified', 'true')
    set({ ageVerified: true })
  },
  denyAge: () => set({ ageVerified: false }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setMobileOpen: (open) => set({ mobileOpen: open }),
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((line) => line.id === product.id)
      if (existing) {
        return {
          cartOpen: true,
          cart: state.cart.map((line) =>
            line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        }
      }
      return { cartOpen: true, cart: [...state.cart, { ...product, quantity: 1 }] }
    }),
  changeQuantity: (id, amount) =>
    set((state) => ({
      cart: state.cart
        .map((line) => (line.id === id ? { ...line, quantity: Math.max(0, line.quantity + amount) } : line))
        .filter((line) => line.quantity > 0),
    })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((line) => line.id !== id) })),
}))

export default useAppStore
