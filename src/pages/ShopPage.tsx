import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { products } from '../data/catalog'
import { useLiveCatalog } from '../hooks/useLiveCatalog'
import { PageHero, Section, SkeletonGrid } from '../components/layout'
import { HyderabadBudgetShelf, ShopProductList } from '../components/products'
import { formatPrice } from '../utils/product'

export function ShopPage() {
  const params = new URLSearchParams(useLocation().search)
  const initialCategory = params.get('category') ?? 'All'
  const [category, setCategory] = useState(initialCategory)
  const [price, setPrice] = useState(50000)
  const [sort, setSort] = useState('Price Low-High')
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('All')
  const [country, setCountry] = useState('All')
  const [type, setType] = useState('All')
  const [loading, setLoading] = useState(true)
  const { catalog, rateStatus } = useLiveCatalog()

  useEffect(() => {
    let mounted = true
    api.get('/products').catch(() => products).finally(() => {
      if (mounted) setTimeout(() => setLoading(false), 500)
    })
    return () => {
      mounted = false
    }
  }, [])

  const categoryOptions = useMemo(() => ['All', ...Array.from(new Set(catalog.map((product) => product.category)))], [catalog])
  const brandOptions = useMemo(() => ['All', ...Array.from(new Set(catalog.map((product) => product.distillery))).sort()], [catalog])
  const countryOptions = useMemo(() => ['All', ...Array.from(new Set(catalog.map((product) => product.country))).sort()], [catalog])
  const typeOptions = useMemo(() => ['All', ...Array.from(new Set(catalog.map((product) => product.age))).sort()], [catalog])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const output = catalog.filter((product) => {
      const matchesSearch = !normalizedQuery || [product.name, product.distillery, product.age, product.country].some((item) => item.toLowerCase().includes(normalizedQuery))
      return (
        matchesSearch &&
        (category === 'All' || product.category === category) &&
        (brand === 'All' || product.distillery === brand) &&
        (country === 'All' || product.country === country) &&
        (type === 'All' || product.age === type) &&
        product.price <= price
      )
    })
    if (sort === 'Price Low-High') return [...output].sort((a, b) => a.price - b.price)
    if (sort === 'Price High-Low') return [...output].sort((a, b) => b.price - a.price)
    if (sort === 'Rating') return [...output].sort((a, b) => b.rating - a.rating)
    return output
  }, [brand, catalog, category, country, price, query, sort, type])

  return (
    <>
      <PageHero eyebrow="Hyderabad live shelf" title="LivCheers-style listings" copy="Hyderabad whisky and beer rows load from the public LivCheers category pages with bottle images, size, rating, type, country and visible MRP." />
      <Section eyebrow="Collection" title="Choose your pour">
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bottle, brand, type or country" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((item) => (
              <button className={`filter-tab ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
          <div className="shop-filter-grid">
            <label>
              <span>Price up to {formatPrice(price)}</span>
              <input className="accent-gold" type="range" min={100} max={50000} step={100} value={price} onChange={(event) => setPrice(Number(event.target.value))} />
            </label>
            <label>
              <span>Sort</span>
              <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
                {['Price Low-High', 'Price High-Low', 'Popularity', 'Newest', 'Rating'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Brand</span>
              <select className="field" value={brand} onChange={(event) => setBrand(event.target.value)}>
                {brandOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Country</span>
              <select className="field" value={country} onChange={(event) => setCountry(event.target.value)}>
                {countryOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Type</span>
              <select className="field" value={type} onChange={(event) => setType(event.target.value)}>
                {typeOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="mb-8 grid gap-3 text-sm text-white/45 md:grid-cols-4">
          {[
            'Availability: Telangana listed only',
            `${filtered.length} visible listings`,
            'Images: product bottle photos from listing',
            'Sort default: low budget to high budget',
            `Rate status: ${rateStatus === 'live' ? 'LivCheers Hyderabad loaded' : rateStatus === 'loading' ? 'Loading Hyderabad listings' : 'Live source unavailable, showing fallback Telangana rates'}`,
          ].map((item) => (
            <div className="border border-gold/10 bg-black/20 p-3" key={item}>{item}</div>
          ))}
        </div>
        {loading ? <SkeletonGrid /> : <ShopProductList items={filtered} />}
        <HyderabadBudgetShelf catalog={catalog} rateStatus={rateStatus} />
      </Section>
    </>
  )
}