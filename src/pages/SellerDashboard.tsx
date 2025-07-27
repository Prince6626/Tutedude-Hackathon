import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';
import SellerOverview from '../components/seller/SellerOverview';
import ProductManagement from '../components/seller/ProductManagement';
import OrderManagement from '../components/seller/OrderManagement';
import InventoryManagement from '../components/seller/InventoryManagement';
import SellerProfile from '../components/seller/SellerProfile';

const SellerDashboard = () => {
  return (
    <SellerLayout>
      <Routes>
        <Route path="/" element={<SellerOverview />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/profile" element={<SellerProfile />} />
      </Routes>
    </SellerLayout>
  );
};

export default SellerDashboard;