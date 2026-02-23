import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MAROON = '#7C2D3A'

const UsersOverTimeChart = ({ data = [] }) => {
  const hasData = data.some((d) => d.count > 0)
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No registration data available
      </div>
    )
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date) }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6b7280" />
        <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" allowDecimals={false} />
        <Tooltip
          formatter={(value) => [value, 'New Users']}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="count" fill={MAROON} radius={[4, 4, 0, 0]} name="Registrations" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default UsersOverTimeChart
