import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { products } from '../data/catalog'
import { categoryData, revenueData } from '../data/home'
import { ChartPanel, PageHero } from '../components/layout'

export function AdminDashboard() {
  return (
    <>
      <PageHero eyebrow="Admin cockpit" title="Operations dashboard" copy="Revenue, compliance, inventory, delivery zones and order control in one dense command surface." />
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="lux-panel grid content-start gap-2">
            {['Overview', 'Orders', 'Inventory', 'Customers', 'Delivery Zones', 'Analytics', 'Compliance', 'Promotions', 'Age Verification Flags', 'Settings'].map((item) => (
              <button className="dashboard-tab" key={item}>{item}</button>
            ))}
          </aside>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              {['₹8.4L Revenue', '128 Orders', '23 Pending', '18m Avg ETA'].map((kpi) => <div className="kpi-card" key={kpi}>{kpi}</div>)}
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <ChartPanel title="Hourly revenue">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData}><XAxis dataKey="hour" stroke="#7c6a39" /><YAxis stroke="#7c6a39" /><Tooltip /><Bar dataKey="revenue" fill="#C9A84C" /></BarChart>
                </ResponsiveContainer>
              </ChartPanel>
              <ChartPanel title="Category split">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" outerRadius={92}>
                      {categoryData.map((_, index) => <Cell fill={['#C9A84C', '#8B1A1A', '#E8C97A', '#2A9D8F', '#FFFFFF'][index]} key={index} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartPanel>
            </div>
            <ChartPanel title="Top selling products">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={products.map((product) => ({ name: product.category, value: product.reviews }))}>
                  <XAxis dataKey="name" stroke="#7c6a39" /><YAxis stroke="#7c6a39" /><Tooltip /><Area dataKey="value" fill="#C9A84C" stroke="#E8C97A" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>
            <OrdersTable />
          </div>
        </div>
      </section>
    </>
  )
}

export function OrdersTable() {
  const orders = [
    ['CASK-2481', 'Anika Rao', 'Macallan + Roku', '₹54,700', 'Bandra', 'Processing', '24m'],
    ['CASK-2482', 'Kabir S', 'Dom Perignon', '₹32,500', 'Jubilee Hills', 'Pending', '41m'],
    ['CASK-2483', 'Mira N', 'Sula Rasa x 6', '₹14,700', 'Indiranagar', 'Delivered', '0m'],
  ]

  return (
    <div className="lux-panel overflow-auto">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-serif text-3xl">Orders</h3>
        <button className="btn-outline">Export CSV</button>
      </div>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-gold">
          <tr>{['ID', 'Customer', 'Items', 'Amount', 'Zone', 'Status', 'ETA'].map((head) => <th className="border-b border-gold/15 py-3" key={head}>{head}</th>)}</tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr className="text-white/60" key={order[0]}>
              {order.map((cell, index) => <td className="border-b border-gold/10 py-4" key={cell}>{index === 5 ? <span className={`status status-${cell.toLowerCase()}`}>{cell}</span> : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}