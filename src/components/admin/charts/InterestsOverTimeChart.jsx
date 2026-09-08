import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const GOLD = '#D4AF37'

const InterestsOverTimeChart = ({ data = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const sampleData = [
    { date: '2026-08-21', count: 0 },
    { date: '2026-08-22', count: 2 },
    { date: '2026-08-24', count: 0 },
    { date: '2026-08-26', count: 0 },
    { date: '2026-08-28', count: 0 },
    { date: '2026-08-30', count: 0 },
    { date: '2026-09-01', count: 0 },
    { date: '2026-09-03', count: 1 },
  ]

  const rawData = data && data.length > 0 ? data : sampleData
  const chartData = rawData.map((d) => ({ ...d, label: d.label || formatDate(d.date) }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'dataMax + 1']} />
        <Tooltip
          formatter={(value) => [value, 'Interests']}
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        />
        <Bar dataKey="count" fill={GOLD} radius={[6, 6, 0, 0]} barSize={18} name="Interests Sent" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default InterestsOverTimeChart

