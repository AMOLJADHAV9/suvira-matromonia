import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MAROON = '#7C2D3A'
const GOLD_LIGHT = 'rgba(212, 175, 55, 0.3)'

const RevenueLineChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No revenue data available
      </div>
    )
  }

  const formatCurrency = (v) => `₹${Number(v).toLocaleString('en-IN')}`

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={MAROON} stopOpacity={0.4} />
            <stop offset="95%" stopColor={GOLD_LIGHT} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6b7280" />
        <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Revenue']}
          contentStyle={{ borderRadius: 8 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={MAROON}
          strokeWidth={2}
          fill="url(#revenueGradient)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default RevenueLineChart
