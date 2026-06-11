import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { staggerContainer, fadeUpItem } from '../../motion/variants'

const fmtCurrency = (v) =>
  `LKR ${Number(v).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const COLORS = [
  '#1a4f8a', '#1d5c9e', '#2068b2', '#2375c6', '#2680d4',
  '#2988de', '#2c90e8', '#2f98f2',
]

// Custom tooltip styled to match the design system.
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(15,26,44,0.12)',
      fontSize: '0.85rem',
    }}>
      <p style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#1a4f8a', fontWeight: 600 }}>{fmtCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function DistrictSection({ districts }) {
  return (
    <section className="report-section">
      <h3 className="section-heading">
        <span className="section-heading-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
              stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        Collections by District
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
                <th>District</th>
                <th>Total Collected</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((row) => (
                <motion.tr key={row.district} variants={fadeUpItem}>
                  <td>{row.district}</td>
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
              data={districts}
              margin={{ top: 8, right: 12, left: 4, bottom: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="district"
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f6ff' }} />
              <Bar
                dataKey="totalCollected"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {districts.map((_, i) => (
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
