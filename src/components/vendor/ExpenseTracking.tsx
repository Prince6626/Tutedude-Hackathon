import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const ExpenseTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const monthlyData = [
    { month: 'Jan', amount: 1800, orders: 12 },
    { month: 'Feb', amount: 2100, orders: 15 },
    { month: 'Mar', amount: 1950, orders: 13 },
    { month: 'Apr', amount: 2300, orders: 18 },
    { month: 'May', amount: 2150, orders: 16 },
    { month: 'Jun', amount: 2340, orders: 19 }
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35, amount: 819, color: '#10b981' },
    { name: 'Meat & Seafood', value: 30, amount: 702, color: '#f59e0b' },
    { name: 'Dairy Products', value: 20, amount: 468, color: '#3b82f6' },
    { name: 'Spices & Seasonings', value: 15, amount: 351, color: '#8b5cf6' }
  ];

  const recentExpenses = [
    {
      id: 1,
      date: '2024-01-20',
      supplier: 'Green Valley Farms',
      category: 'Vegetables',
      description: 'Fresh Tomatoes, Onions',
      amount: 33.75,
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      date: '2024-01-20',
      supplier: 'Quality Meats Co.',
      category: 'Meat',
      description: 'Premium Ground Beef',
      amount: 44.95,
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      date: '2024-01-19',
      supplier: 'Spice Masters',
      category: 'Spices',
      description: 'Mixed Spice Blend',
      amount: 25.98,
      paymentMethod: 'Credit Card'
    },
    {
      id: 4,
      date: '2024-01-18',
      supplier: 'Dairy Best',
      category: 'Dairy',
      description: 'Whole Milk, Fresh Cheese',
      amount: 22.75,
      paymentMethod: 'Credit Card'
    }
  ];

  const supplierSpending = [
    { name: 'Green Valley Farms', amount: 456, orders: 12, category: 'Vegetables' },
    { name: 'Quality Meats Co.', amount: 678, orders: 8, category: 'Meat' },
    { name: 'Spice Masters', amount: 234, orders: 6, category: 'Spices' },
    { name: 'Dairy Best', amount: 189, orders: 4, category: 'Dairy' }
  ];

  const totalSpent = monthlyData.reduce((sum, month) => sum + month.amount, 0);
  const avgMonthlySpend = totalSpent / monthlyData.length;
  const totalOrders = monthlyData.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalSpent / totalOrders;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Vegetables': 'bg-green-100 text-green-800',
      'Meat': 'bg-red-100 text-red-800',
      'Dairy': 'bg-blue-100 text-blue-800',
      'Spices': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Tracking</h2>
          <p className="text-gray-600">Monitor and analyze your business spending patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% from last period</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
              <p className="text-3xl font-bold text-gray-900">₹{avgMonthlySpend.toFixed(0)}</p>
              <p className="text-sm text-blue-600">Consistent spending</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-purple-600">Across all suppliers</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">₹{avgOrderValue.toFixed(2)}</p>
              <p className="text-sm text-orange-600">Per transaction</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
            <RechartsPieChart>
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
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Spending and Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers by Spending */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers by Spending</h3>
          <div className="space-y-4">
            {supplierSpending.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-500">{supplier.orders} orders • {supplier.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{supplier.amount}</p>
                  <p className="text-sm text-gray-500">Total spent</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{expense.supplier}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{expense.description}</p>
                  <p className="text-xs text-gray-500">{expense.date} • {expense.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{expense.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData.map((category, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <span className="text-sm font-semibold text-gray-600">{category.value}%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{category.amount}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${category.value}%`,
                    backgroundColor: category.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Top Spending Category</h4>
            <p className="text-sm text-gray-600">
              You spend the most on <strong>Vegetables</strong> (35% of total), which is great for maintaining fresh ingredients.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Cost Optimization</h4>
            <p className="text-sm text-gray-600">
              Consider bulk ordering from <strong>Green Valley Farms</strong> to potentially reduce per-unit costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracking;