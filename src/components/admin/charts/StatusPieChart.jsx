import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const StatusPieChart = ({ data = [], title = '', emptyMessage = 'No data available' }) => {
  const hasData = data.some((d) => d.value > 0)
  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div>
      {title && (
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusPieChart
