import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import UsersPage from './admin/users/UsersPage'
import AdminProfiles from './admin/AdminProfiles'
import AdminInterests from './admin/AdminInterests'
import AdminReports from './admin/AdminReports'
import AdminPremium from './admin/AdminPremium'
import AdminSettings from './admin/AdminSettings'

const AdminPanelPage = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="profiles" element={<AdminProfiles />} />
      <Route path="profile-approvals" element={<AdminProfiles />} />
      <Route path="interests" element={<AdminInterests />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="premium" element={<AdminPremium />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  </AdminLayout>
)

export default AdminPanelPage
