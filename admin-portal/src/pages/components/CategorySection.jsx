import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const fmtCurrency = (v) =>
  `LKR ${Number(v).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CategorySection({ categories }) {
  return (
    <section className="report-section">
      <h3 className="section-heading">Collections by Fine Category</h3>
      <div className="section-grid">
        <div className="table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category</th>
                <th>Total Collected</th>
                <th>Paid Count</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.categoryCode}>
                  <td><code>{row.categoryCode}</code></td>
                  <td>{row.categoryDescription}</td>
                  <td>{fmtCurrency(row.totalCollected)}</td>
                  <td>{row.paidCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={categories}
              margin={{ top: 8, right: 16, left: 8, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="categoryCode"
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                width={45}
              />
              <Tooltip
                formatter={(v) => [fmtCurrency(v), 'Collected']}
                labelFormatter={(label) => {
                  const cat = categories.find((c) => c.categoryCode === label)
                  return cat ? cat.categoryDescription : label
                }}
              />
              <Bar dataKey="totalCollected" fill="#0e7490" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
