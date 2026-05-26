export type Product = {
  id: string
  name: string
  distillery: string
  region: string
  country: string
  category: string
  price: number
  abv: number
  volume: string
  age: string
  rating: number
  reviews: number
  badge: 'PREMIUM' | 'RARE' | 'NEW' | 'LIMITED'
  image: string
  notes: string[]
  pairing: string
  rateLookup?: string
  rateVolume?: string
  rateSource?: string
  variants?: ProductVariant[]
}

export type ProductVariant = {
  volume: string
  price: number
  source?: string
}

export type CartLine = Product & { quantity: number }

export type AppStore = {
  ageVerified: boolean
  cartOpen: boolean
  mobileOpen: boolean
  cart: CartLine[]
  verifyAge: () => void
  denyAge: () => void
  setCartOpen: (open: boolean) => void
  setMobileOpen: (open: boolean) => void
  addToCart: (product: Product) => void
  changeQuantity: (id: string, amount: number) => void
  removeFromCart: (id: string) => void
}
