import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Plus, Edit, Search, X, ShoppingCart, RefreshCw } from 'lucide-react';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [newStock, setNewStock] = useState({
    name: '',
    category: 'vegetables',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    costPerUnit: '',
    sellPrice: '',
    supplier: 'Green Valley'
  });

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unit: 'lbs',
      costPerUnit: 1.80,
      sellPrice: 2.50,
      lastRestocked: '2024-01-18',
      supplier: 'Green Valley',
      status: 'in_stock'
    },
    {
      id: 2,
      name: 'Premium Ground Beef',
      category: 'meat',
      currentStock: 25,
      minStock: 30,
      maxStock: 100,
      unit: 'lbs',
      costPerUnit: 6.50,
      sellPrice: 8.99,
      lastRestocked: '2024-01-19',
      supplier: 'Green Valley',
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Organic Onions',
      category: 'vegetables',
      currentStock: 200,
      minStock: 75,
      maxStock: 250,
      unit: 'lbs',
      costPerUnit: 1.20,
      sellPrice: 1.75,
      lastRestocked: '2024-01-17',
      supplier: 'Green Valley',
      status: 'in_stock'
    },
    {
      id: 4,
      name: 'Whole Milk',
      category: 'dairy',
      currentStock: 0,
      minStock: 20,
      maxStock: 80,
      unit: 'gallons',
      costPerUnit: 2.50,
      sellPrice: 3.25,
      lastRestocked: '2024-01-15',
      supplier: 'Green Valley',
      status: 'out_of_stock'
    },
    {
      id: 5,
      name: 'Mixed Spice Blend',
      category: 'spices',
      currentStock: 45,
      minStock: 20,
      maxStock: 60,
      unit: '5lb bags',
      costPerUnit: 8.50,
      sellPrice: 12.99,
      lastRestocked: '2024-01-20',
      supplier: 'Green Valley',
      status: 'in_stock'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'meat', name: 'Meat & Seafood' },
    { id: 'dairy', name: 'Dairy Products' },
    { id: 'spices', name: 'Spices & Seasonings' }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800',
      low_stock: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current === 0) return 'out_of_stock';
    if (current <= min) return 'low_stock';
    return 'in_stock';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-500';
      case 'low_stock': return 'bg-yellow-500';
      case 'out_of_stock': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory_data');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        setInventory(parsedInventory);
      } catch (error) {
        console.error('Error loading inventory data from localStorage:', error);
      }
    }
  }, []);

  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
  const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;

  const handleAddStock = async () => {
    try {
      // Validate required fields
      if (!newStock.name || !newStock.currentStock || !newStock.minStock || !newStock.maxStock || !newStock.unit || !newStock.costPerUnit || !newStock.sellPrice) {
        alert('Please fill in all required fields');
        return;
      }

      // Create new stock item with proper data types and status
      const newItem = {
        id: inventory.length + 1,
        name: newStock.name,
        category: newStock.category,
        currentStock: parseInt(newStock.currentStock),
        minStock: parseInt(newStock.minStock),
        maxStock: parseInt(newStock.maxStock),
        unit: newStock.unit,
        costPerUnit: parseFloat(newStock.costPerUnit),
        sellPrice: parseFloat(newStock.sellPrice),
        lastRestocked: new Date().toISOString().split('T')[0],
        supplier: newStock.supplier || 'Green Valley',
        status: getStockLevel(parseInt(newStock.currentStock), parseInt(newStock.minStock), parseInt(newStock.maxStock))
      };

      // Add to inventory (this would be an API call in production)
      setInventory(prevInventory => [...prevInventory, newItem]);
      
      // Save to localStorage for persistence
      const updatedInventory = [...inventory, newItem];
      localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
      
      console.log('Successfully added new stock item:', newItem);
      
      // Reset form
      setNewStock({
        name: '',
        category: 'vegetables',
        currentStock: '',
        minStock: '',
        maxStock: '',
        unit: '',
        costPerUnit: '',
        sellPrice: '',
        supplier: ''
      });
      
      alert('Stock item added successfully!');
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock item. Please try again.');
    }
  };

  const handleRestock = async (amount) => {
    try {
      if (!selectedItem || !amount || amount <= 0) {
        alert('Please enter a valid restock amount');
        return;
      }

      const restockQty = parseInt(amount);
      const newStockLevel = selectedItem.currentStock + restockQty;
      
      // Check if restock amount exceeds maximum capacity
      if (newStockLevel > selectedItem.maxStock) {
        alert(`Cannot restock ${restockQty} ${selectedItem.unit}. Maximum capacity would be exceeded.`);
        return;
      }

      // Update inventory with new stock level
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedItem.id) {
          const updatedItem = {
            ...item,
            currentStock: newStockLevel,
            lastRestocked: new Date().toISOString().split('T')[0],
            status: getStockLevel(newStockLevel, item.minStock, item.maxStock)
          };
          return updatedItem;
        }
        return item;
      });

      // Update state
      setInventory(updatedInventory);
      
      // Save to localStorage for persistence
      localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
      
      // Log the transaction (in production, this would be saved to a transactions table)
      const transaction = {
        id: Date.now(),
        type: 'restock',
        productId: selectedItem.id,
        productName: selectedItem.name,
        quantity: restockQty,
        unit: selectedItem.unit,
        cost: (selectedItem.costPerUnit * restockQty).toFixed(2),
        timestamp: new Date().toISOString(),
        previousStock: selectedItem.currentStock,
        newStock: newStockLevel
      };
      
      // Save transaction to localStorage
      const existingTransactions = JSON.parse(localStorage.getItem('inventory_transactions') || '[]');
      const updatedTransactions = [...existingTransactions, transaction];
      localStorage.setItem('inventory_transactions', JSON.stringify(updatedTransactions));
      
      console.log('Successfully restocked item:', transaction);
      alert(`Successfully restocked ${restockQty} ${selectedItem.unit} of ${selectedItem.name}`);
      
    } catch (error) {
      console.error('Error restocking item:', error);
      alert('Error restocking item. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Monitor and manage your product inventory levels</p>
        </div>
        <button 
          onClick={() => setShowAddStockModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900">₹{totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
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
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/Unit
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sell Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockPercentage = (item.currentStock / item.maxStock) * 100;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-900">
                              {item.currentStock} {item.unit}
                            </span>
                            <span className="text-gray-500">
                              {item.maxStock} max
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getStockColor(item.status)}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.costPerUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.sellPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastRestocked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedItem(item);
                            setShowRestockModal(true);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Restock</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory
              .filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
              .map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Current: {item.currentStock} {item.unit} (Min: {item.minStock})
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setShowRestockModal(true);
                    }}
                    className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Restock Now</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Add New Stock Item</h3>
              <button 
                onClick={() => setShowAddStockModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text"
                  placeholder="Enter product name"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newStock.category}
                  onChange={(e) => setNewStock({ ...newStock, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="meat">Meat & Seafood</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="spices">Spices & Seasonings</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newStock.currentStock}
                    onChange={(e) => setNewStock({ ...newStock, currentStock: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    placeholder="lbs, gallons, pieces"
                    value={newStock.unit}
                    onChange={(e) => setNewStock({ ...newStock, unit: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newStock.minStock}
                    onChange={(e) => setNewStock({ ...newStock, minStock: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newStock.maxStock}
                    onChange={(e) => setNewStock({ ...newStock, maxStock: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newStock.costPerUnit}
                    onChange={(e) => setNewStock({ ...newStock, costPerUnit: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sell Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newStock.sellPrice}
                    onChange={(e) => setNewStock({ ...newStock, sellPrice: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  placeholder="Supplier name"
                  value={newStock.supplier}
                  onChange={(e) => setNewStock({ ...newStock, supplier: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <button 
                onClick={() => setShowAddStockModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleAddStock();
                  setShowAddStockModal(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Restock {selectedItem.name}</h3>
              <button 
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedItem(null);
                  setRestockAmount('');
                }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.currentStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Minimum Stock:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.minStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maximum Stock:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.maxStock} {selectedItem.unit}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restock Amount ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedItem.maxStock - selectedItem.currentStock}
                  placeholder="Enter amount to restock"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available space: {selectedItem.maxStock - selectedItem.currentStock} {selectedItem.unit}
                </p>
              </div>
              {restockAmount && restockAmount > 0 && (
                <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    New stock level: {parseInt(selectedItem.currentStock) + parseInt(restockAmount)} {selectedItem.unit}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Estimated cost: ₹{(parseFloat(selectedItem.costPerUnit) * parseInt(restockAmount)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <button 
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedItem(null);
                  setRestockAmount('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleRestock(restockAmount);
                  setShowRestockModal(false);
                  setSelectedItem(null);
                  setRestockAmount('');
                }}
                disabled={!restockAmount || restockAmount <= 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Restock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
