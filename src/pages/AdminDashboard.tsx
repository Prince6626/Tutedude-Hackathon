import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import TransactionManagement from '../components/admin/TransactionManagement';
import PlatformSettings from '../components/admin/PlatformSettings';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/transactions" element={<TransactionManagement />} />
        <Route path="/settings" element={<PlatformSettings />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;