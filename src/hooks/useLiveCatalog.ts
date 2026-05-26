import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Product, ProductVariant } from '../types/catalog'
import { beerImages, bottleImages, products } from '../data/catalog'

export const LIVE_BEER_RATE_URL = '/live-rates/beer-price-in-telangana.html'
const LIVE_BEER_RATE_SOURCE = 'https://www.boldsky.com/liquor-price/beer-price-in-telangana.html'
const LIVE_WHISKY_RATE_URL = '/live-rates/whisky-price-in-telangana.html'
const LIVE_WHISKY_RATE_SOURCE = 'https://www.boldsky.com/liquor-price/whisky-price-in-telangana.html'
const LIVCHEERS_PROXY_BASE = '/livcheers/hyderabad'
const LIVCHEERS_SOURCE_BASE = 'https://www.livcheers.com/hyderabad'
const LIVCHEERS_STATIC_BASE = 'https://www.livcheers.com'

type LiveCatalogFeed = {
  path: string
  category: Product['category']
  group: string
}

const livCheersFeeds: LiveCatalogFeed[] = [
  { path: '/category/blended-scotch', category: 'Whisky', group: 'Blended Scotch' },
  { path: '/category/single-malts', category: 'Whisky', group: 'Single Malt' },
  { path: '/category/world-whisky', category: 'Whisky', group: 'World Whisky' },
  { path: '/category/made-in-india-whisky', category: 'Whisky', group: 'Made in India Whisky' },
  { path: '/category/beers', category: 'Beer', group: 'Beer' },
  { path: '/category/gin', category: 'Gin', group: 'Gin' },
  { path: '/category/rum', category: 'Rum', group: 'Rum' },
  { path: '/category/vodka', category: 'Vodka', group: 'Vodka' },
  { path: '/category/brandy', category: 'Brandy', group: 'Brandy' },
]

export const homepageLivCheersCategories = ['Gin', 'Rum', 'Vodka', 'Brandy']

export type RateStatus = 'loading' | 'live' | 'fallback'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, ' ').trim() ?? ''
}

function normalizeVolume(value: string) {
  return cleanText(value).replace(/^(\d+(?:\.\d+)?)\s*ml$/i, '$1 ml')
}

function absoluteLivCheersUrl(value: string) {
  if (!value) return ''
  if (value.startsWith('https://') || value.startsWith('http://')) return value
  if (value.startsWith('//')) return `https:${value}`
  if (value.startsWith('/')) return `${LIVCHEERS_STATIC_BASE}${value}`
  return value
}

function badgeForLiveProduct(category: Product['category'], price: number): Product['badge'] {
  if (category === 'Beer') return price >= 300 ? 'PREMIUM' : 'NEW'
  if (category === 'Gin' || category === 'Vodka') return price >= 2500 ? 'PREMIUM' : 'NEW'
  if (category === 'Rum' || category === 'Brandy') return price >= 2000 ? 'PREMIUM' : 'NEW'
  if (price >= 10000) return 'RARE'
  if (price >= 5000) return 'LIMITED'
  if (price >= 2000) return 'PREMIUM'
  return 'NEW'
}

function parseLivCheersCatalog(html: string, feed: LiveCatalogFeed) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const rows = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href^="/hyderabad/liquor/"]'))
  const seen = new Set<string>()

  return rows.reduce<Product[]>((items, row, index) => {
    const href = row.getAttribute('href') ?? ''
    const slug = href.split('/').filter(Boolean).pop()
    if (!slug || seen.has(slug)) return items
    seen.add(slug)

    const image = row.querySelector<HTMLImageElement>('img[src*="/static/content/images/liquor/"]')
    const nameNode = row.querySelector('h3')
    const name = cleanText(nameNode?.textContent || image?.alt)
    const brand = cleanText(nameNode?.previousElementSibling?.textContent).replace(/^Brand:\s*/i, '')
    const volume = normalizeVolume(cleanText(nameNode?.nextElementSibling?.textContent))
    const rowText = cleanText(row.textContent)
    const priceMatch = rowText.match(/\u20b9\s*([0-9,]+)/)
    const price = priceMatch?.[1] ? Number(priceMatch[1].replace(/,/g, '')) : NaN
    const ratingMatch = rowText.match(/Overall Rating:\s*([0-9.]+)/i)
    const rating = ratingMatch?.[1] ? Number(ratingMatch[1]) : 4.4
    const country = cleanText(row.querySelector<HTMLImageElement>('img[src*="flagcdn.com"]')?.alt) || 'India'
    const paragraphs = Array.from(row.querySelectorAll('p')).map((item) => cleanText(item.textContent)).filter(Boolean)
    const type =
      paragraphs.find(
        (item) =>
          item !== brand &&
          normalizeVolume(item) !== volume &&
          item !== name &&
          !item.startsWith('Brand:') &&
          !item.includes('\u20b9') &&
          !/^\d+(?:\.\d+)?\s*ml$/i.test(item) &&
          !/^Overall Rating/i.test(item) &&
          !/^[0-9.]+$/.test(item),
      ) ?? feed.group
    const source = `${LIVCHEERS_SOURCE_BASE}${href.replace('/hyderabad', '')}`

    if (!name || !volume || !Number.isFinite(price)) return items

    items.push({
      id: `livcheers-${slug}`,
      name,
      distillery: brand || name.split(' ')[0],
      region: 'Hyderabad - Telangana',
      country,
      category: feed.category,
      price,
      abv: feed.category === 'Beer' ? 5 : 42.8,
      volume,
      age: type,
      rating,
      reviews: 32 + ((index * 7) % 90),
      badge: badgeForLiveProduct(feed.category, price),
      image: absoluteLivCheersUrl(image?.getAttribute('src') ?? '') || (feed.category === 'Beer' ? beerImages[0] : bottleImages[0]),
      notes:
        feed.category === 'Beer'
          ? ['Malt', 'Cold pour', 'Hyderabad listing']
          : feed.category === 'Gin'
            ? ['Juniper', 'Citrus', 'Hyderabad listing']
            : feed.category === 'Vodka'
              ? ['Clean', 'Neutral', 'Hyderabad listing']
              : ['Spice', 'Oak', 'Hyderabad listing'],
      pairing: feed.category === 'Beer' ? 'Fries, kebabs, grilled starters' : 'Kebabs, biryani, cocktail mixers',
      rateSource: source,
      variants: [{ volume, price, source }],
    })

    return items
  }, [])
}

let livCheersCatalogPromise: Promise<Product[]> | null = null

function fetchLivCheersCatalog() {
  livCheersCatalogPromise ??= Promise.allSettled(
    livCheersFeeds.map((feed) => axios.get<string>(`${LIVCHEERS_PROXY_BASE}${feed.path}`).then((response) => ({ feed, html: response.data }))),
  ).then((results) => {
    const listedProducts = results.flatMap((result) =>
      result.status === 'fulfilled' ? parseLivCheersCatalog(result.value.html, result.value.feed) : [],
    )
    const unique = new Map<string, Product>()
    listedProducts.forEach((product) => {
      if (!unique.has(product.id)) unique.set(product.id, product)
    })
    return Array.from(unique.values())
  })

  return livCheersCatalogPromise
}

function parseLiveBeerRates(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const text = doc.body.innerText.replace(/\s+/g, ' ')

  return products.reduce<Record<string, number>>((rates, product) => {
    if (!product.rateLookup || !product.rateVolume) return rates

    const matcher = new RegExp(
      `${escapeRegExp(product.rateLookup)}\\s+${escapeRegExp(product.rateVolume)}\\s+₹\\s*([0-9,.]+)`,
      'i',
    )
    const match = text.match(matcher)
    if (match?.[1]) {
      rates[product.id] = Number(match[1].replace(/,/g, ''))
    }

    return rates
  }, {})
}

function parseLiveWhiskyVariants(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const text = doc.body.innerText.replace(/\s+/g, ' ')
  const desiredVolumes = ['375 ml', '750 ml', '1000 ml']

  return products.reduce<Record<string, ProductVariant[]>>((rates, product) => {
    if (product.category !== 'Whisky' || !product.rateLookup) return rates

    const productIndex = text.search(new RegExp(escapeRegExp(product.rateLookup), 'i'))
    if (productIndex < 0) return rates

    const chunk = text.slice(productIndex, productIndex + 520)
    const tokens = Array.from(chunk.matchAll(/(\d{2,4}\s*ml)|₹\s*([0-9,.]+)/gi))
    const volumes: string[] = []
    const prices: number[] = []
    let readingPrices = false

    for (const token of tokens) {
      if (token[1] && !readingPrices) {
        volumes.push(token[1].replace(/\s+/g, ' ').toLowerCase().replace('ml', 'ml'))
      }

      if (token[2]) {
        readingPrices = true
        prices.push(Number(token[2].replace(/,/g, '')))
      }

      if (readingPrices && prices.length >= volumes.length && volumes.length > 0) break
    }

    const variants = volumes
      .map((volume, index) => ({
        volume: volume.replace(/^(\d+)/, (_, number: string) => `${number}`).replace(' ml', ' ml'),
        price: prices[index],
        source: LIVE_WHISKY_RATE_SOURCE,
      }))
      .filter((variant) => desiredVolumes.includes(variant.volume) && Number.isFinite(variant.price))
      .sort((a, b) => Number(a.volume.split(' ')[0]) - Number(b.volume.split(' ')[0]))

    if (variants.length > 0) rates[product.id] = variants

    return rates
  }, {})
}

export function useLiveCatalog() {
  const [catalog, setCatalog] = useState(products)
  const [rateStatus, setRateStatus] = useState<RateStatus>('loading')

  useEffect(() => {
    let mounted = true

    fetchLivCheersCatalog()
      .then((liveProducts) => {
        if (!mounted) return
        if (liveProducts.length > 0) {
          setCatalog(liveProducts)
          setRateStatus('live')
          return
        }
        throw new Error('LivCheers catalog empty')
      })
      .catch(() => {
        Promise.allSettled([axios.get<string>(LIVE_BEER_RATE_URL), axios.get<string>(LIVE_WHISKY_RATE_URL)])
          .then((results) => {
            const beerResult = results[0]
            const whiskyResult = results[1]
            const beerRates = beerResult.status === 'fulfilled' ? parseLiveBeerRates(beerResult.value.data) : {}
            const whiskyRates = whiskyResult.status === 'fulfilled' ? parseLiveWhiskyVariants(whiskyResult.value.data) : {}

            if (!mounted || (Object.keys(beerRates).length === 0 && Object.keys(whiskyRates).length === 0)) {
              if (mounted) setRateStatus('fallback')
              return
            }

            setCatalog((current) =>
              current.map((product) => {
                const beerPrice = beerRates[product.id]
                const whiskyVariants = whiskyRates[product.id]
                if (beerPrice) {
                  return {
                    ...product,
                    price: beerPrice,
                    variants: [{ volume: product.volume.replace(/(\d+)(ml)/, '$1 ml'), price: beerPrice, source: LIVE_BEER_RATE_SOURCE }],
                    rateSource: LIVE_BEER_RATE_SOURCE,
                  }
                }
                if (whiskyVariants?.length) {
                  const preferred = whiskyVariants.find((variant) => variant.volume === '750 ml') ?? whiskyVariants[0]
                  return {
                    ...product,
                    price: preferred.price,
                    volume: preferred.volume.replace(' ', ''),
                    variants: whiskyVariants,
                    rateSource: LIVE_WHISKY_RATE_SOURCE,
                  }
                }
                return product
              }),
            )
            setRateStatus('live')
          })
          .catch(() => {
            if (mounted) setRateStatus('fallback')
          })
      })

    return () => {
      mounted = false
    }
  }, [])

  return { catalog, rateStatus }
}
