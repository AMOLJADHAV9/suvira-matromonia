import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MAROON = '#881337'

const RevenueLineChart = ({ data = [] }) => {
  const sampleData = [
    { label: 'Apr 2026', revenue: 0 },
    { label: 'May 2026', revenue: 0 },
    { label: 'Jun 2026', revenue: 0 },
    { label: 'Jul 2026', revenue: 0 },
    { label: 'Aug 2026', revenue: 0 },
    { label: 'Sept 2026', revenue: 0 },
  ]

  const chartData = data && data.length > 0 ? data : sampleData
  const formatCurrency = (v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={MAROON} stopOpacity={0.25} />
            <stop offset="95%" stopColor={MAROON} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} domain={[0, 'auto']} />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={MAROON}
          strokeWidth={2.5}
          fill="url(#revenueAreaGradient)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default RevenueLineChart

