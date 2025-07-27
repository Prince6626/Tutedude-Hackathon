import React from 'react';
import Cart from '../components/vendor/Cart';
import ProtectedRoute from '../components/ProtectedRoute';

const CartPage = () => (
  <ProtectedRoute role="vendor">
    <Cart />
  </ProtectedRoute>
);

export default CartPage;
