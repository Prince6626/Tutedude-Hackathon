import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VendorLayout from '../components/vendor/VendorLayout';
import VendorOverview from '../components/vendor/VendorOverview';
import VendorMarketplace from '../components/vendor/Marketplace';
import Cart from '../components/vendor/Cart';
import OrderHistory from '../components/vendor/OrderHistory';
import Suppliers from '../components/vendor/Suppliers';
import ExpenseTracking from '../components/vendor/ExpenseTracking';
import VendorProfile from '../components/vendor/VendorProfile';

const VendorDashboard = () => {
  return (
    <VendorLayout>
      <Routes>
        <Route path="/" element={<VendorOverview />} />
        <Route path="/marketplace" element={<VendorMarketplace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/expenses" element={<ExpenseTracking />} />
        <Route path="/profile" element={<VendorProfile />} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorDashboard;