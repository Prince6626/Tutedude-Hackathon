import React from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SellerOverview = () => {
  const stats = [
    {
      name: 'Total Products',
      value: '24',
      change: '+3 this month',
      changeType: 'positive',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Orders',
      value: '156',
      change: '+12% from last month',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      name: 'Revenue',
      value: '₹15,600',
      change: '+8% from last month',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-orange-500'
    },
    {
      name: 'Avg Rating',
      value: '4.9',
      change: '+0.2 from last month',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const salesData = [
    { month: 'Jan', sales: 2400, orders: 24 },
    { month: 'Feb', sales: 3200, orders: 32 },
    { month: 'Mar', sales: 2800, orders: 28 },
    { month: 'Apr', sales: 3800, orders: 38 },
    { month: 'May', sales: 4200, orders: 42 },
    { month: 'Jun', sales: 3600, orders: 36 }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      orders: 45,
      revenue: 1125,
      stock: 150,
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Premium Ground Beef',
      category: 'Meat',
      orders: 32,
      revenue: 2880,
      stock: 75,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Organic Onions',
      category: 'Vegetables',
      orders: 28,
      revenue: 490,
      stock: 200,
      image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      vendor: 'Maria\'s Tacos',
      items: 'Fresh Tomatoes (10 lbs)',
      amount: 25.00,
      status: 'completed',
      date: '2024-01-20'
    },
    {
      id: 'ORD-002',
      vendor: 'Dynasty Dumplings',
      items: 'Ground Beef (5 lbs)',
      amount: 44.95,
      status: 'processing',
      date: '2024-01-20'
    },
    {
      id: 'ORD-003',
      vendor: 'Spice Street',
      items: 'Organic Onions (15 lbs)',
      amount: 26.25,
      status: 'pending',
      date: '2024-01-19'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Green Valley Farms!</h2>
        <p className="opacity-90">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category} • {product.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.revenue}</p>
                  <p className="text-sm text-gray-500">{product.stock} in stock</p>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.vendor}</p>
                  <p className="text-sm text-gray-500">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Add New Product</h4>
          <p className="mb-4 opacity-90">Expand your catalog with new items</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Add Product
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Update Inventory</h4>
          <p className="mb-4 opacity-90">Keep your stock levels current</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Update Stock
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">View Analytics</h4>
          <p className="mb-4 opacity-90">Detailed performance insights</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;