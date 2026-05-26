import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { bottleImages, categories, products } from '../data/catalog'
import { cellarMoments, citySignals, heroScenes, tickerItems } from '../data/home'
import { homepageLivCheersCategories, useLiveCatalog } from '../hooks/useLiveCatalog'
import { Section, SkeletonGrid } from '../components/layout'
import { ProductGrid, ShopProductList } from '../components/products'
import { formatPrice } from '../utils/product'

export function HomePage() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 180])
  const [sceneIndex, setSceneIndex] = useState(0)
  const activeScene = heroScenes[sceneIndex]
  const words = activeScene.title.split(' ')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSceneIndex((index) => (index + 1) % heroScenes.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13, 10, 6, 0.96), rgba(13, 10, 6, 0.64), rgba(13, 10, 6, 0.34)), url("${activeScene.image}")`,
        }}
      >
        <div className="grain" />
        <div className="hero-beams">
          {Array.from({ length: 9 }).map((_, index) => <span key={index} />)}
        </div>
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 pt-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={activeScene.kicker} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <p className="eyebrow">{activeScene.kicker}</p>
                <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-none text-white sm:text-7xl lg:text-8xl">
                  {words.map((word, index) => (
                    <motion.span
                      className="mr-4 inline-block"
                      key={`${activeScene.title}-${word}`}
                      initial={{ y: 42, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.07, duration: 0.65 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>
            </AnimatePresence>
            <p className="mt-6 max-w-xl text-lg text-white/60">
              {activeScene.copy}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop"><button className="btn-primary shimmer">Explore the Collection</button></Link>
              <Link to="/tastings"><button className="btn-outline">Book a Private Tasting</button></Link>
            </div>
            <div className="scene-rail">
              {heroScenes.map((scene, index) => (
                <button className={sceneIndex === index ? 'active' : ''} onClick={() => setSceneIndex(index)} key={scene.kicker}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {scene.bottle}
                </button>
              ))}
            </div>
          </div>
          <motion.div className="hero-bottle-wrap hero-stage" style={{ y }}>
            <motion.div
              className="hero-bottle"
              animate={{ y: [-18, 18, -18], rotateY: [0, 10, 0], rotateZ: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="bottle-neck" />
              <div className="bottle-body">
                <span>C&C</span>
                <small>Private Reserve</small>
              </div>
            </motion.div>
            <motion.div className="concierge-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
              <p className="eyebrow">Now staging</p>
              <h3>{activeScene.bottle}</h3>
              <p>{activeScene.note}</p>
              <div>
                <span>ETA</span>
                <strong>118 min</strong>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <StatsStrip />
        <motion.div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-gold md:block" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ArrowDown size={24} />
        </motion.div>
      </section>
      <LuxuryTicker />
      <CategoryShowcase />
      <LivCheersHomeShelf />
      <FeaturedProducts />
      <CellarTheatre />
      <CityServiceGrid />
      <ExperienceBand />
    </>
  )
}

export function StatsStrip() {
  const stats = [
    ['500+', 'Expressions'],
    ['18+', 'Countries'],
    ['2hr', 'Delivery'],
    ['4.9', 'Rating'],
  ]

  return (
    <div className="absolute inset-x-0 bottom-0 hidden border-y border-gold/15 bg-black/25 backdrop-blur md:block">
      <div className="mx-auto grid max-w-5xl grid-cols-4 divide-x divide-gold/15">
        {stats.map(([value, label], index) => (
          <motion.div
            className="p-5 text-center"
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <p className="font-serif text-3xl text-gold">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-normal text-white/45">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function LuxuryTicker() {
  return (
    <div className="luxury-ticker" aria-hidden="true">
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}

export function CategoryShowcase() {
  const navigate = useNavigate()
  const rowRef = useRef<HTMLDivElement>(null)
  const { catalog } = useLiveCatalog()
  const liveCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: catalog.filter((product) => product.category === category.name).length || category.count,
      })),
    [catalog],
  )
  const scrollCategories = (direction: -1 | 1) => {
    const row = rowRef.current
    if (!row) return
    const card = row.querySelector<HTMLElement>('.category-card')
    const distance = card ? card.offsetWidth + 16 : 260
    row.scrollBy({ left: distance * direction, behavior: 'smooth' })
  }

  return (
    <Section eyebrow="Curated shelves" title="Browse by spirit">
      <div className="category-carousel-controls" aria-label="Browse spirits">
        <button className="icon-button" type="button" onClick={() => scrollCategories(-1)} aria-label="Previous spirits">
          <ChevronLeft size={18} />
        </button>
        <button className="icon-button" type="button" onClick={() => scrollCategories(1)} aria-label="Next spirits">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="snap-row" ref={rowRef}>
        {liveCategories.map((category) => (
          <motion.button
            className="category-card"
            key={category.name}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate(`/shop?category=${category.name}`)}
          >
            <span className="text-4xl">{category.icon}</span>
            <span className="mt-5 font-serif text-3xl">{category.name}</span>
            <span className="mt-2 text-sm text-white/45">{category.count} bottles</span>
          </motion.button>
        ))}
      </div>
    </Section>
  )
}

export function CellarTheatre() {
  const [active, setActive] = useState(0)
  const activeProduct = products[active]

  return (
    <section className="cellar-theatre">
      <div className="theatre-media">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeProduct.id}
            src={activeProduct.image}
            alt={activeProduct.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55 }}
          />
        </AnimatePresence>
      </div>
      <div className="theatre-content">
        <p className="eyebrow">Cellar theatre</p>
        <h2>Choose by mood, not just category.</h2>
        <p>
          A more premium shelf should move like a menu at a serious bar: highlight the bottle, reveal the notes,
          keep the next action close.
        </p>
        <div className="theatre-tabs">
          {products.slice(0, 4).map((product, index) => (
            <button className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} key={product.id}>
              <span>{product.category}</span>
              {product.name}
            </button>
          ))}
        </div>
        <div className="theatre-note">
          <span>{activeProduct.badge}</span>
          <strong>{formatPrice(activeProduct.price)}</strong>
          <p>{activeProduct.notes.join(' / ')}</p>
        </div>
        <div className="moment-grid">
          {cellarMoments.map(([number, label, copy]) => (
            <div key={label}>
              <span>{number}</span>
              <strong>{label}</strong>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CityServiceGrid() {
  return (
    <Section eyebrow="Delivery intelligence" title="Built for urban nights">
      <div className="city-grid">
        {citySignals.map(([city, zones, eta], index) => (
          <motion.article
            className="city-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            key={city}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{city}</h3>
            <p>{zones}</p>
            <strong>{eta}</strong>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}

export function FeaturedProducts() {
  const { catalog } = useLiveCatalog()

  return (
    <Section eyebrow="Sommelier selection" title="Bottles worthy of the top shelf">
      <ProductGrid items={catalog.slice(0, 4)} />
    </Section>
  )
}

export function LivCheersHomeShelf() {
  const { catalog, rateStatus } = useLiveCatalog()

  return (
    <Section eyebrow="LivCheers Hyderabad" title="Gin, rum, vodka and brandy list">
      <div className="mb-8 grid gap-3 text-sm text-white/45 md:grid-cols-4">
        {[
          'Source: livcheers.com/hyderabad',
          'Images: original bottle photos',
          'Prices: visible Hyderabad MRP',
          rateStatus === 'live' ? 'Status: live list loaded' : rateStatus === 'loading' ? 'Status: loading list' : 'Status: fallback visible',
        ].map((item) => (
          <div className="border border-gold/10 bg-black/20 p-3" key={item}>{item}</div>
        ))}
      </div>
      <div className="grid gap-8">
        {homepageLivCheersCategories.map((category) => {
          const items = catalog.filter((product) => product.category === category)
          return (
            <div className="home-shelf-group" key={category}>
              <div className="home-shelf-head">
                <div>
                  <p className="eyebrow">{category}</p>
                  <h3>{category} in Hyderabad</h3>
                </div>
                <Link to={`/shop?category=${category}`} className="home-shelf-link">View in shop</Link>
              </div>
              {rateStatus === 'loading' && items.length === 0 ? <SkeletonGrid /> : <ShopProductList items={items} />}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export function ExperienceBand() {
  return (
    <section className="relative overflow-hidden py-28">
      <img className="absolute inset-0 h-full w-full object-cover opacity-35" src={bottleImages[1]} alt="Fine dining spirits experience" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0A06] via-[#0D0A06]/85 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Michelin-menu energy</p>
        <h2 className="mt-4 max-w-2xl font-serif text-5xl">Every bottle arrives with the occasion already considered.</h2>
        <p className="mt-5 max-w-xl text-white/55">Pairing notes, delivery timing, private tasting slots and compliance checks are handled without making the experience feel clinical.</p>
      </div>
    </section>
  )
}
