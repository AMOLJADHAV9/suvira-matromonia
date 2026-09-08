import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopNavbar from './AdminTopNavbar'
import { AdminDateRangeProvider } from '../../context/AdminDateRangeContext'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AdminDateRangeProvider>
      <div className="h-screen bg-[#FDFBF9] flex font-sans antialiased overflow-hidden">
        {sidebarOpen && <AdminSidebar />}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <AdminTopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminDateRangeProvider>
  )
}

export default AdminLayout


