import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { staggerContainer, fadeUpItem } from '../../motion/variants'

const fmtCurrency = (v) =>
  `LKR ${Number(v).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const COLORS = [
  '#0e7490', '#0d87a8', '#0c9cc0', '#0ab1d8', '#15b8e0',
  '#1ec0e8', '#27c8f0', '#32d0f6',
]

function CustomTooltip({ active, payload, label, categories }) {
  if (!active || !payload?.length) return null
  const cat = categories?.find((c) => c.categoryCode === label)
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(15,26,44,0.12)',
      fontSize: '0.85rem',
      maxWidth: 220,
    }}>
      <p style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>
        {cat ? cat.categoryDescription : label}
      </p>
      <p style={{ color: '#0e7490', fontWeight: 600 }}>{fmtCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function CategorySection({ categories }) {
  return (
    <section className="report-section">
      <h3 className="section-heading">
        <span className="section-heading-icon" aria-hidden="true" style={{ background: '#ecfeff', color: '#0e7490' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
            <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
            <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        Collections by Fine Category
      </h3>

      <div className="section-grid">
        <div className="table-wrap">
          <motion.table
            className="report-table"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <thead>
              <tr>
                <th>Code</th>
                <th>Category</th>
                <th>Total Collected</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <motion.tr key={row.categoryCode} variants={fadeUpItem}>
                  <td><span className="code-chip">{row.categoryCode}</span></td>
                  <td>{row.categoryDescription}</td>
                  <td className="amount-cell">{fmtCurrency(row.totalCollected)}</td>
                  <td className="count-cell">{row.paidCount}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={categories}
              margin={{ top: 8, right: 12, left: 4, bottom: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="categoryCode"
                angle={-40}
                textAnchor="end"
                tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Inter, sans-serif' }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Inter, sans-serif' }}
                width={42}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={(props) => <CustomTooltip {...props} categories={categories} />}
                cursor={{ fill: '#f0fdfe' }}
              />
              <Bar
                dataKey="totalCollected"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
