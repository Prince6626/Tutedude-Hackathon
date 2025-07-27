import React from 'react';
import { Users, DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminOverview = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '12,543',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Monthly Revenue',
      value: '₹45,231',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      name: 'Total Orders',
      value: '8,942',
      change: '+15%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'bg-orange-500'
    },
    {
      name: 'Active Disputes',
      value: '23',
      change: '-5%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 32000, orders: 450 },
    { month: 'Feb', revenue: 35000, orders: 520 },
    { month: 'Mar', revenue: 38000, orders: 580 },
    { month: 'Apr', revenue: 42000, orders: 640 },
    { month: 'May', revenue: 45000, orders: 720 },
    { month: 'Jun', revenue: 48000, orders: 800 }
  ];

  const userGrowthData = [
    { month: 'Jan', vendors: 1200, suppliers: 300 },
    { month: 'Feb', vendors: 1350, suppliers: 340 },
    { month: 'Mar', vendors: 1500, suppliers: 380 },
    { month: 'Apr', vendors: 1680, suppliers: 420 },
    { month: 'May', vendors: 1850, suppliers: 460 },
    { month: 'Jun', vendors: 2000, suppliers: 500 }
  ];

  const recentActivities = [
    { id: 1, type: 'user_registered', message: 'New vendor "Green Valley" registered', time: '2 minutes ago' },
    { id: 2, type: 'order_placed', message: 'Order #ORD-001 placed by Green Valley', time: '5 minutes ago' },
    { id: 3, type: 'order_completed', message: 'Order #ORD-002 completed by Green Valley Farms', time: '10 minutes ago' },
    { id: 4, type: 'payment_processed', message: 'Payment of ₹245.50 processed for Order #ORD-001', time: '15 minutes ago' },
    { id: 5, type: 'message_sent', message: 'Vendor contacted supplier about order inquiry', time: '20 minutes ago' }
  ];

  return (
    <div className="space-y-6">
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
                  {stat.change} from last month
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
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendors" fill="#10b981" />
              <Bar dataKey="suppliers" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Pending Verifications</h4>
          <p className="text-3xl font-bold mb-2">15</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Review Now
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">System Health</h4>
          <p className="text-lg font-medium mb-2">All Systems Operational</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            View Details
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <h4 className="text-lg font-semibold mb-2">Support Tickets</h4>
          <p className="text-3xl font-bold mb-2">8</p>
          <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Handle Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;