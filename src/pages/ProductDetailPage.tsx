import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { bottleImages, products } from '../data/catalog'
import { useLiveCatalog } from '../hooks/useLiveCatalog'
import useAppStore from '../store/useAppStore'
import { PageHero, Section } from '../components/layout'
import { ProductGrid } from '../components/products'
import { formatPrice, productWithVariant } from '../utils/product'

export function ProductDetailPage() {
  const location = useLocation()
  const id = location.pathname.split('/').pop()
  const { catalog } = useLiveCatalog()
  const product = catalog.find((item) => item.id === id) ?? catalog[0]
  const addToCart = useAppStore((state) => state.addToCart)
  const variants = product.variants?.length
    ? product.variants
    : [{ volume: product.volume.replace(/(\d+)(ml)/, '$1 ml'), price: product.price, source: product.rateSource }]
  const [selectedVolume, setSelectedVolume] = useState(variants.find((variant) => variant.volume === '750 ml')?.volume ?? variants[0].volume)
  const selectedVariant = variants.find((variant) => variant.volume === selectedVolume) ?? variants[0]

  return (
    <>
      <PageHero eyebrow="Bottle dossier" title={product.name} copy={`${product.distillery} - ${product.region} - ${product.country}`} />
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div className="border border-gold/15 bg-[#120d08] p-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <img className="aspect-[4/5] w-full object-cover" src={product.image} alt={product.name} />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.image, ...bottleImages].slice(0, 4).map((image) => (
                <img className="aspect-square border border-gold/15 object-cover" src={image} alt="" key={image} />
              ))}
            </div>
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge inline-badge badge-rare">{product.badge}</span>
              <span className="age-badge">21+ verified delivery</span>
              <span className="flex items-center gap-1 text-gold"><Star size={16} fill="currentColor" /> {product.rating} rating</span>
            </div>
            <h2 className="mt-6 font-serif text-5xl text-gold">{formatPrice(selectedVariant.price)}</h2>
            <p className="mt-5 max-w-2xl text-white/60">
              A cellar-grade allocation with layered aromatics, steady structure and concierge handling from pickup to
              doorstep. No returns on opened bottles.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {['Nose', 'Palate', 'Finish'].map((label, index) => (
                <div className="detail-cell" key={label}>
                  <p className="eyebrow">{label}</p>
                  <p className="mt-2 text-white/70">{product.notes[index]}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 border border-gold/15 p-5">
              <p className="eyebrow">Pairing suggestions</p>
              <p className="mt-3 text-white/60">{product.pairing}</p>
            </div>
            <div className="pack-selector pack-selector-detail" aria-label={`Select pack size for ${product.name}`}>
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
            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <input className="field" placeholder="Enter pincode for delivery estimate" />
              <button className="btn-outline">Check Delivery</button>
            </div>
            <button className="btn-primary shimmer mt-6" onClick={() => addToCart(productWithVariant(product, selectedVariant))}>Add to Cart</button>
          </div>
        </div>
      </section>
      <Section eyebrow="Similar bottles" title="You may also like">
        <ProductGrid items={products.filter((item) => item.id !== product.id).slice(0, 4)} />
      </Section>
    </>
  )
}
