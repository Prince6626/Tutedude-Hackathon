import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, TrendingUp, Users, Plus, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const VendorOverview = () => {
  const stats = [
    {
      name: 'Total Orders',
      value: '45',
      change: '+5 this month',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Spent',
      value: '$2,340',
      change: '+12% from last month',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      name: 'Active Suppliers',
      value: '8',
      change: '+2 new suppliers',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Avg Order Value',
      value: '$52.00',
      change: '+8% from last month',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const spendingData = [
    { month: 'Jan', amount: 1800 },
    { month: 'Feb', amount: 2100 },
    { month: 'Mar', amount: 1950 },
    { month: 'Apr', amount: 2300 },
    { month: 'May', amount: 2150 },
    { month: 'Jun', amount: 2340 }
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35, color: '#10b981' },
    { name: 'Meat', value: 30, color: '#f59e0b' },
    { name: 'Dairy', value: 20, color: '#3b82f6' },
    { name: 'Spices', value: 15, color: '#8b5cf6' }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      supplier: 'Green Valley Farms',
      items: 'Fresh Tomatoes, Onions',
      amount: 33.75,
      status: 'delivered',
      date: '2024-01-20'
    },
    {
      id: 'ORD-002',
      supplier: 'Quality Meats Co.',
      items: 'Ground Beef',
      amount: 44.95,
      status: 'in_transit',
      date: '2024-01-20'
    },
    {
      id: 'ORD-003',
      supplier: 'Spice Masters',
      items: 'Mixed Spices',
      amount: 25.98,
      status: 'processing',
      date: '2024-01-19'
    }
  ];

  const topSuppliers = [
    {
      name: 'Green Valley Farms',
      orders: 12,
      spent: 456,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      name: 'Quality Meats Co.',
      orders: 8,
      spent: 678,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      name: 'Spice Masters',
      orders: 6,
      spent: 234,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800',
      in_transit: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Maria!</h2>
        <p className="opacity-90">Here's how your street food business is performing today.</p>
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
        {/* Spending Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders and Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.supplier}</p>
                  <p className="text-sm text-gray-500">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Suppliers */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-500">{supplier.orders} orders • Rating: {supplier.rating}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${supplier.spent}</p>
                  <p className="text-sm text-gray-500">Total spent</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-orange-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Browse Marketplace</h4>
          <p className="mb-4 opacity-90">Find new suppliers and products</p>
          <Link
            to="/vendor/marketplace"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-block"
          >
            Browse Now
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Track Expenses</h4>
          <p className="mb-4 opacity-90">Monitor your spending patterns</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            View Expenses
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Contact Suppliers</h4>
          <p className="mb-4 opacity-90">Chat with your trusted suppliers</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;