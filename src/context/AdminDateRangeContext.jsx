import React, { createContext, useContext, useState, useMemo } from 'react'

const AdminDateRangeContext = createContext()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export const formatShortDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export const getDynamicDateOptions = () => {
  const now = new Date()

  const formatDateStr = (dateObj) => {
    const day = dateObj.getDate()
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    return `${day} ${month} ${year}`
  }

  const todayStr = formatDateStr(now)

  const getDatePast = (daysAgo) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (daysAgo - 1))
    return formatDateStr(d)
  }

  const getDatePastYear = (yearsAgo) => {
    const d = new Date(now)
    d.setFullYear(d.getFullYear() - yearsAgo)
    return formatDateStr(d)
  }

  return [
    { days: 7, label: 'Last 7 Days', dateText: `${getDatePast(7)} – ${todayStr}` },
    { days: 14, label: 'Last 14 Days', dateText: `${getDatePast(14)} – ${todayStr}` },
    { days: 30, label: 'Last 30 Days', dateText: `${getDatePast(30)} – ${todayStr}` },
    { days: 90, label: 'Last 90 Days', dateText: `${getDatePast(90)} – ${todayStr}` },
    { days: 365, label: `Last 1 Year (${now.getFullYear() - 1} – ${now.getFullYear()})`, dateText: `${getDatePastYear(1)} – ${todayStr}` },
    { days: 730, label: `Last 2 Years (${now.getFullYear() - 2} – ${now.getFullYear()})`, dateText: `${getDatePastYear(2)} – ${todayStr}` },
    { days: 1825, label: 'All Time (5 Years)', dateText: `1 Jan 2021 – ${todayStr}` },
  ]
}

export const DATE_RANGE_OPTIONS = getDynamicDateOptions()

export const AdminDateRangeProvider = ({ children }) => {
  const dynamicOptions = useMemo(() => getDynamicDateOptions(), [])
  const [selectedRange, setSelectedRange] = useState(dynamicOptions[1]) // Default: Last 14 Days

  return (
    <AdminDateRangeContext.Provider value={{ selectedRange, setSelectedRange, DATE_RANGE_OPTIONS: dynamicOptions, formatShortDate }}>
      {children}
    </AdminDateRangeContext.Provider>
  )
}

export const useAdminDateRange = () => {
  const context = useContext(AdminDateRangeContext)
  if (!context) {
    const fallbackOptions = getDynamicDateOptions()
    return {
      selectedRange: fallbackOptions[1],
      setSelectedRange: () => {},
      DATE_RANGE_OPTIONS: fallbackOptions,
      formatShortDate
    }
  }
  return context
}

