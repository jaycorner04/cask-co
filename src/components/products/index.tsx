import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/catalog'
import type { RateStatus } from '../../hooks/useLiveCatalog'
import useAppStore from '../../store/useAppStore'
import { formatPrice, formatRateSource, productWithVariant } from '../../utils/product'

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product, index) => (
        <ProductCard product={product} index={index} key={product.id} />
      ))}
    </div>
  )
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const addToCart = useAppStore((state) => state.addToCart)
  const variants = product.variants?.length
    ? product.variants
    : [{ volume: product.volume.replace(/(\d+)(ml)/, '$1 ml'), price: product.price, source: product.rateSource }]
  const [selectedVolume, setSelectedVolume] = useState(variants.find((variant) => variant.volume === '750 ml')?.volume ?? variants[0].volume)
  const selectedVariant = variants.find((variant) => variant.volume === selectedVolume) ?? variants[0]

  return (
    <motion.article
      className="product-card group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-black">
        <img className="h-full w-full object-contain p-6 opacity-90 transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
        <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
        <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center border border-white/15 bg-black/40 text-white backdrop-blur">
          <Heart size={16} />
        </button>
        <div className="quick-view">
          <Link to={`/product/${product.id}`}>Quick View</Link>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl leading-tight">{product.name}</h3>
            <p className="mt-1 text-sm text-white/45">{product.distillery} - {product.region}</p>
          </div>
          <span className="age-badge">21+</span>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-white/45">
          <span>{product.abv}% ABV</span>
          <span>{selectedVariant.volume}</span>
          <span className="flex items-center gap-1 text-gold">
            <Star size={13} fill="currentColor" />
            {product.rating} ({product.reviews})
          </span>
        </div>
        <p className="mt-3 text-xs text-white/35">
          {product.category === 'Beer' ? 'Live Telangana beer MRP' : 'Live Telangana whisky-rate feed'}
        </p>
        <div className="pack-selector" aria-label={`Select pack size for ${product.name}`}>
          {variants.map((variant) => (
            <button
              className={selectedVariant.volume === variant.volume ? 'active' : ''}
              type="button"
              onClick={() => setSelectedVolume(variant.volume)}
              key={variant.volume}
            >
              <span>{variant.volume}</span>
              <strong>{formatPrice(variant.price)}</strong>
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-serif text-2xl text-gold">{formatPrice(selectedVariant.price)}</p>
          <button className="liquid-btn" onClick={() => addToCart(productWithVariant(product, selectedVariant))}>Add</button>
        </div>
      </div>
    </motion.article>
  )
}

export function ShopProductList({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <div className="catalog-empty">
        <p className="eyebrow">No match</p>
        <h3>No Hyderabad listing fits these filters.</h3>
      </div>
    )
  }

  return (
    <div className="catalog-list">
      {items.map((product, index) => (
        <ShopProductRow product={product} index={index} key={product.id} />
      ))}
    </div>
  )
}

export function ShopProductRow({ product, index }: { product: Product; index: number }) {
  const addToCart = useAppStore((state) => state.addToCart)
  const variant = product.variants?.[0] ?? { volume: product.volume.replace(/(\d+)(ml)/, '$1 ml'), price: product.price, source: product.rateSource }

  return (
    <motion.article
      className="catalog-row"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: Math.min(index * 0.025, 0.35) }}
      whileHover={{ y: -2 }}
    >
      <Link className="catalog-row-main" to={`/product/${product.id}`}>
        <div className="catalog-thumb">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="catalog-info">
          <div className="catalog-kicker">
            <span>{product.distillery}</span>
            <em>{product.category}</em>
          </div>
          <h3>{product.name}</h3>
          <div className="catalog-meta">
            <span>{variant.volume.toUpperCase()}</span>
            <span className="flex items-center gap-1 text-gold">
              <Star size={13} fill="currentColor" />
              {product.rating.toFixed(1)}
            </span>
            <span>{product.age}</span>
          </div>
          <div className="catalog-tags">
            <span>
              <MapPin size={12} />
              {product.country}
            </span>
            <span>{formatRateSource(product)}</span>
          </div>
        </div>
      </Link>
      <div className="catalog-actions">
        <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
        <strong>{formatPrice(variant.price)}</strong>
        <button className="liquid-btn" type="button" onClick={() => addToCart(productWithVariant(product, variant))}>
          Add
        </button>
      </div>
    </motion.article>
  )
}

export function HyderabadBudgetShelf({ catalog, rateStatus }: { catalog: Product[]; rateStatus: RateStatus }) {
  const localWhiskies = catalog
    .filter(
      (product) =>
        product.category === 'Whisky' &&
        product.region.toLowerCase().includes('telangana'),
    )
    .sort((a, b) => a.price - b.price)
  const localBeers = catalog
    .filter((product) => product.category === 'Beer')
    .sort((a, b) => a.price - b.price)

  return (
    <div className="mb-10 mt-10 grid gap-5 xl:grid-cols-2">
      <BudgetList title="Lowest whisky picks" copy="First low-budget Hyderabad whisky listings from the loaded catalog." items={localWhiskies.slice(0, 8)} />
      <BudgetList
        title="Lowest beer picks"
        copy={rateStatus === 'live' ? 'MRP loaded from Hyderabad beer listings.' : 'Using last verified rates while live page is unavailable.'}
        items={localBeers.slice(0, 8)}
      />
    </div>
  )
}

export function BudgetList({ title, copy, items }: { title: string; copy: string; items: Product[] }) {
  return (
    <motion.div className="budget-list" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{title}</p>
          <p className="mt-2 text-sm text-white/45">{copy}</p>
        </div>
        <span className="age-badge">21+</span>
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <Link className="budget-row" to={`/product/${item.id}`} key={item.id}>
            <span className="budget-rank">{String(index + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1">
              <strong>{item.name}</strong>
              <small>{item.volume} - {item.abv}% ABV - {formatRateSource(item)}</small>
              <span className="budget-packs">
                {(item.variants ?? [{ volume: item.volume.replace(/(\d+)(ml)/, '$1 ml'), price: item.price }]).map((variant) => (
                  <em key={variant.volume}>{variant.volume}: {formatPrice(variant.price)}</em>
                ))}
              </span>
            </span>
            <span className="budget-price">from {formatPrice(Math.min(...(item.variants ?? [{ price: item.price }]).map((variant) => variant.price)))}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}