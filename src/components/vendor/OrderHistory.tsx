import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const vendorOrders = JSON.parse(localStorage.getItem('vendorOrders') || '[]');
        
        // Add default orders if none exist
        if (vendorOrders.length === 0) {
          const defaultOrders = [
            {
              id: 'ORD-001',
              supplierName: 'Green Valley Farms',
              supplierImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
              items: [
                { name: 'Fresh Tomatoes', quantity: 10, unit: 'lbs', price: 2.50 },
                { name: 'Organic Onions', quantity: 5, unit: 'lbs', price: 1.75 }
              ],
              total: 33.75,
              status: 'delivered',
              orderDate: '2024-01-20',
              deliveryDate: '2024-01-22',
              paymentMethod: 'Credit Card',
              trackingNumber: 'TRK-123456789'
            },
            {
              id: 'ORD-002',
              supplierName: 'Quality Meats Co.',
              supplierImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
              items: [
                { name: 'Premium Ground Beef', quantity: 5, unit: 'lbs', price: 8.99 }
              ],
              total: 44.95,
              status: 'in_transit',
              orderDate: '2024-01-20',
              deliveryDate: '2024-01-21',
              paymentMethod: 'Bank Transfer',
              trackingNumber: 'TRK-987654321'
            }
          ];
          setOrders(defaultOrders);
        } else {
          // Map the stored orders to match the expected format
          const mappedOrders = vendorOrders.map(order => ({
            id: order.id,
            supplier: order.supplierName,
            supplierImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            items: order.items,
            total: order.total,
            status: order.status,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            paymentMethod: order.paymentMethod,
            trackingNumber: order.trackingNumber || null
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      }
    };

    loadOrders();

    // Listen for storage changes to update orders in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'vendorOrders') {
        loadOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800',
      in_transit: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const totalSpent = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  const handleReorder = (order: any) => {
    // Placeholder implementation for reordering
    console.log('Reordering:', order);
    // In a real implementation, this would add the order items back to the cart
    // or navigate to a reorder page
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600">Track and manage all your orders from suppliers</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredOrders.filter(o => o.status === 'in_transit').length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredOrders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={order.supplierImage}
                  alt={order.supplier}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">{order.supplier || order.supplierName}</p>
                  <p className="text-sm text-gray-500">Order Date: {order.orderDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${order.total}</p>
                <p className="text-sm text-gray-500">Delivery: {order.deliveryDate}</p>
                {order.trackingNumber && (
                  <p className="text-sm text-gray-500">Track: {order.trackingNumber}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {item.name} - {item.quantity} {item.unit}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  {order.trackingNumber && (
                    <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span onClick={() => handleViewDetails(order)}>View Details</span>
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                      <span onClick={() => handleReorder(order)}>Reorder</span>
                    </button>
                  )}
                  {order.trackingNumber && order.status === 'in_transit' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Browse Marketplace
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p><strong>Status:</strong> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                          {selectedOrder.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                      <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
                      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                      {selectedOrder.trackingNumber && (
                        <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Supplier Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <img
                          src={selectedOrder.supplierImage}
                          alt={selectedOrder.supplier || selectedOrder.supplierName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p><strong>{selectedOrder.supplier || selectedOrder.supplierName}</strong></p>
                      </div>
                      {selectedOrder.deliveryAddress && (
                        <div>
                          <p><strong>Delivery Address:</strong></p>
                          <p className="text-gray-600 ml-4">{selectedOrder.deliveryAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} {item.unit} × ${item.price}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">Total Amount:</p>
                        <p className="text-xl font-bold text-green-600">${selectedOrder.total}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && selectedOrder.specialInstructions !== 'No special instructions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Instructions</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  {selectedOrder.status === 'delivered' && (
                    <button
                      onClick={() => {
                        handleReorder(selectedOrder);
                        closeOrderDetails();
                      }}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
                    >
                      Reorder
                    </button>
                  )}
                  {selectedOrder.trackingNumber && selectedOrder.status === 'in_transit' && (
                    <button
                      onClick={() => {
                        alert(`Tracking order ${selectedOrder.trackingNumber}`);
                        closeOrderDetails();
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Track Order
                    </button>
                  )}
                  <button
                    onClick={closeOrderDetails}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;