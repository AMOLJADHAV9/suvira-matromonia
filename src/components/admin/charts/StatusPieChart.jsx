import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const StatusPieChart = ({ data = [] }) => {
  const approvedItem = data.find((d) => d.name === 'Approved') || { value: 8, fill: '#10B981' }
  const pendingItem = data.find((d) => d.name === 'Pending') || { value: 43, fill: '#EAB308' }
  const rejectedItem = data.find((d) => d.name === 'Rejected') || { value: 0, fill: '#6B1224' }

  const total = approvedItem.value + pendingItem.value + rejectedItem.value
  const approvedPercent = total > 0 ? Math.round((approvedItem.value / total) * 100) : 16
  const pendingPercent = total > 0 ? Math.round((pendingItem.value / total) * 100) : 84
  const rejectedPercent = total > 0 ? Math.round((rejectedItem.value / total) * 100) : 0

  const chartData = [
    { name: 'Approved', value: approvedItem.value, fill: '#10B981', percent: approvedPercent },
    { name: 'Pending', value: pendingItem.value, fill: '#EAB308', percent: pendingPercent },
    { name: 'Rejected', value: rejectedItem.value, fill: '#6B1224', percent: rejectedPercent },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      {/* Donut Chart */}
      <div className="w-44 h-44 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} cornerRadius={4} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Profiles']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Right Custom Legend */}
      <div className="flex-1 space-y-3 w-full">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="font-semibold text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-500 font-medium">
              <span>{item.percent}%</span>
              <span className="text-gray-400">({item.value})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusPieChart

