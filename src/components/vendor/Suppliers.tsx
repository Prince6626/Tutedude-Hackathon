import React, { useState } from 'react';
import { Search, Star, MapPin, MessageCircle, Heart, Eye, Filter } from 'lucide-react';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  const suppliers = [
    {
      id: 1,
      name: 'Green Valley Farms',
      category: 'vegetables',
      rating: 4.9,
      reviews: 124,
      location: 'Los Angeles, CA',
      distance: '5.2 miles',
      description: 'Premium organic vegetables and fresh produce. Family-owned farm with 20+ years of experience.',
      specialties: ['Organic Vegetables', 'Fresh Herbs', 'Seasonal Produce'],
      minOrder: 25,
      deliveryTime: '1-2 days',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      totalOrders: 45,
      lastOrder: '2024-01-20',
      isFavorite: true,
      responseTime: '< 2 hours'
    },
    {
      id: 2,
      name: 'Quality Meats Co.',
      category: 'meat',
      rating: 4.8,
      reviews: 89,
      location: 'San Francisco, CA',
      distance: '12.8 miles',
      description: 'High-quality meat and seafood supplier. USDA certified with strict quality standards.',
      specialties: ['Premium Beef', 'Fresh Seafood', 'Poultry'],
      minOrder: 50,
      deliveryTime: '1-3 days',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      totalOrders: 32,
      lastOrder: '2024-01-18',
      isFavorite: false,
      responseTime: '< 4 hours'
    },
    {
      id: 3,
      name: 'Spice Masters',
      category: 'spices',
      rating: 4.9,
      reviews: 203,
      location: 'Oakland, CA',
      distance: '8.5 miles',
      description: 'Authentic spices and seasonings from around the world. Bulk quantities available.',
      specialties: ['International Spices', 'Custom Blends', 'Organic Seasonings'],
      minOrder: 30,
      deliveryTime: '2-3 days',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      totalOrders: 28,
      lastOrder: '2024-01-19',
      isFavorite: true,
      responseTime: '< 1 hour'
    },
    {
      id: 4,
      name: 'Dairy Best',
      category: 'dairy',
      rating: 4.6,
      reviews: 78,
      location: 'Fresno, CA',
      distance: '45.2 miles',
      description: 'Fresh dairy products from local farms. Wide selection of milk, cheese, and dairy alternatives.',
      specialties: ['Fresh Milk', 'Artisan Cheese', 'Dairy Alternatives'],
      minOrder: 40,
      deliveryTime: '1-2 days',
      image: 'https://images.pexels.com/photos/3764578/pexels-photo-3764578.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      totalOrders: 15,
      lastOrder: '2024-01-15',
      isFavorite: false,
      responseTime: '< 6 hours'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'meat', name: 'Meat & Seafood' },
    { id: 'dairy', name: 'Dairy Products' },
    { id: 'spices', name: 'Spices & Seasonings' }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    const matchesRating = selectedRating === 'all' || supplier.rating >= parseFloat(selectedRating);
    return matchesSearch && matchesCategory && matchesRating;
  });

  const toggleFavorite = (supplierId: number) => {
    // Handle favorite toggle logic here
    console.log(`Toggling favorite for supplier ${supplierId}`);
  };
  // Message supplier function
  const messageSupplier = async (supplierId: number, supplierName: string) => {
    try {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipientId: supplierId,
          recipientType: 'supplier',
          subject: 'General Inquiry',
          message: `Hi ${supplierName}, I would like to discuss potential orders and partnership opportunities.`
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Suppliers</h2>
          <p className="text-gray-600">Manage relationships with your trusted suppliers</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
          Find New Suppliers
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-3xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorites</p>
              <p className="text-3xl font-bold text-gray-900">
                {suppliers.filter(s => s.isFavorite).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">
                {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
          </select>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={supplier.image}
                alt={supplier.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleFavorite(supplier.id)}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors duration-200 ${
                  supplier.isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${supplier.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                      <span className="text-sm text-gray-500">({supplier.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{supplier.totalOrders} orders</p>
                  <p>Last: {supplier.lastOrder}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{supplier.location} • {supplier.distance}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{supplier.description}</p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {supplier.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  {supplier.specialties.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{supplier.specialties.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Min Order:</span> ${supplier.minOrder}
                </div>
                <div>
                  <span className="font-medium">Delivery:</span> {supplier.deliveryTime}
                </div>
                <div>
                  <span className="font-medium">Response:</span> {supplier.responseTime}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
                <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span onClick={() => messageSupplier(supplier.id, supplier.name)}>Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Browse All Suppliers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;