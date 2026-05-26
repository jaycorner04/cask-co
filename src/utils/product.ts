import type { Product, ProductVariant } from '../types/catalog'

const LIVCHEERS_SOURCE_BASE = 'https://www.livcheers.com/hyderabad'
const LIVE_WHISKY_RATE_SOURCE = 'https://www.boldsky.com/liquor-price/whisky-price-in-telangana.html'
const LIVE_BEER_RATE_SOURCE = 'https://www.boldsky.com/liquor-price/beer-price-in-telangana.html'

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRateSource(product: Product) {
  if (product.rateSource?.startsWith(LIVCHEERS_SOURCE_BASE)) return 'Source: LivCheers Hyderabad'
  if (product.rateSource === LIVE_WHISKY_RATE_SOURCE) return 'Live source: Boldsky Telangana whisky rate'
  if (product.rateSource === LIVE_BEER_RATE_SOURCE) return 'Live source: Boldsky Telangana beer rate'
  return product.rateSource ?? product.region
}

export function productWithVariant(product: Product, variant: ProductVariant) {
  return {
    ...product,
    id: `${product.id}-${variant.volume.replace(/\s+/g, '-')}`,
    price: variant.price,
    volume: variant.volume.replace(' ', ''),
    variants: [variant],
  }
}