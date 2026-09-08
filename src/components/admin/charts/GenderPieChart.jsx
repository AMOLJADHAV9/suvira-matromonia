import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { FaUsers } from 'react-icons/fa'

const MAROON = '#6B1224'
const GOLD = '#D4AF37'
const SLATE = '#94A3B8'

const GenderPieChart = ({ data = [] }) => {
  const maleItem = data.find((d) => d.name === 'Male') || { value: 39 }
  const femaleItem = data.find((d) => d.name === 'Female') || { value: 10 }
  const pendingItem = data.find((d) => d.name === 'Pending Profile') || { value: 0 }

  const total = maleItem.value + femaleItem.value + pendingItem.value
  const malePercent = total > 0 ? Math.round((maleItem.value / total) * 100) : 75
  const femalePercent = total > 0 ? Math.round((femaleItem.value / total) * 100) : 20
  const pendingPercent = total > 0 ? Math.round((pendingItem.value / total) * 100) : 5

  const chartData = [
    { name: 'Male Users', value: maleItem.value, fill: MAROON },
    { name: 'Female Users', value: femaleItem.value, fill: GOLD },
    ...(pendingItem.value > 0 ? [{ name: 'Pending Gender Profile', value: pendingItem.value, fill: SLATE }] : []),
  ]

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        {/* Donut Chart with Center Icon */}
        <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
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
              <Tooltip formatter={(value) => [value, 'Users']} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#6B1224]">
              <FaUsers className="text-lg" />
            </div>
          </div>
        </div>

        {/* Custom Right Legend */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start space-x-3">
            <span className="w-3 h-3 rounded-full bg-[#6B1224] mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">{malePercent}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Male Users ({maleItem.value})</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37] mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">{femalePercent}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Female Users ({femaleItem.value})</p>
            </div>
          </div>

          {pendingItem.value > 0 && (
            <div className="flex items-start space-x-3">
              <span className="w-3 h-3 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900 leading-none">{pendingPercent}%</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Pending Gender ({pendingItem.value})</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pill Badge */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/50">
          Total: {total} Registered Users
        </span>
      </div>
    </div>
  )
}

export default GenderPieChart
