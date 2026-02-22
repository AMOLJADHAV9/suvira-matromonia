import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopNavbar from './AdminTopNavbar'

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex font-sans antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
    <AdminSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopNavbar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  </div>
)

export default AdminLayout
