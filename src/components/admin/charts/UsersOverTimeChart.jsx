import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MAROON = '#881337'

const UsersOverTimeChart = ({ data = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const sampleData = [
    { date: '2026-08-21', count: 1 },
    { date: '2026-08-23', count: 2 },
    { date: '2026-08-25', count: 0 },
    { date: '2026-08-27', count: 1 },
    { date: '2026-08-29', count: 0 },
    { date: '2026-08-31', count: 1 },
    { date: '2026-09-03', count: 3 },
  ]

  const rawData = data && data.length > 0 ? data : sampleData
  const chartData = rawData.map((d) => ({ ...d, label: d.label || formatDate(d.date) }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="userWaveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={MAROON} stopOpacity={0.35} />
            <stop offset="95%" stopColor={MAROON} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'dataMax + 1']} />
        <Tooltip
          formatter={(value) => [value, 'New Users']}
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={MAROON}
          strokeWidth={2.5}
          fill="url(#userWaveGradient)"
          name="New Registrations"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default UsersOverTimeChart

