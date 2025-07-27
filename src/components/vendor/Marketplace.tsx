import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, ShoppingCart, MessageCircle, Heart, Eye, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  supplier: string;
  supplierId: number;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  category: string;
  image: string;
  description: string;
  minOrder: number;
  deliveryTime: string;
  inStock: boolean;
  supplierRating: number;
  supplierImage: string;
}

interface Supplier {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  categories: string[];
  image: string;
  description: string;
  totalProducts: number;
  responseTime: string;
  minOrder: number;
  deliveryTime: string;
  verified: boolean;
}

const VendorMarketplace = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'suppliers'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛒' },
    { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
    { id: 'meat', name: 'Meat & Seafood', icon: '🥩' },
    { id: 'dairy', name: 'Dairy Products', icon: '🥛' },
    { id: 'spices', name: 'Spices & Seasonings', icon: '🌶️' },
    { id: 'grains', name: 'Grains & Cereals', icon: '🌾' },
    { id: 'packaging', name: 'Packaging Materials', icon: '📦' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'los_angeles', name: 'Los Angeles, CA' },
    { id: 'san_francisco', name: 'San Francisco, CA' },
    { id: 'san_diego', name: 'San Diego, CA' },
    { id: 'sacramento', name: 'Sacramento, CA' },
    { id: 'fresno', name: 'Fresno, CA' },
    { id: 'oakland', name: 'Oakland, CA' }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      supplier: 'Green Valley Farms',
      supplierId: 1,
      price: 2.50,
      unit: 'per lb',
      rating: 4.8,
      reviews: 124,
      location: 'Los Angeles, CA',
      distance: '5.2 miles',
      category: 'vegetables',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Fresh, ripe tomatoes perfect for cooking',
      minOrder: 10,
      deliveryTime: '1-2 days',
      inStock: true,
      supplierRating: 4.9,
      supplierImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Premium Ground Beef',
      supplier: 'Quality Meats Co.',
      supplierId: 2,
      price: 8.99,
      unit: 'per lb',
      rating: 4.9,
      reviews: 89,
      location: 'San Francisco, CA',
      distance: '12.8 miles',
      category: 'meat',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'High-quality ground beef, 80/20 lean',
      minOrder: 5,
      deliveryTime: '1-3 days',
      inStock: true,
      supplierRating: 4.8,
      supplierImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Organic Bananas',
      supplier: 'Tropical Fruits Inc.',
      supplierId: 3,
      price: 1.25,
      unit: 'per lb',
      rating: 4.6,
      reviews: 156,
      location: 'San Diego, CA',
      distance: '8.3 miles',
      category: 'fruits',
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Sweet, organic bananas perfect for smoothies',
      minOrder: 15,
      deliveryTime: '2-3 days',
      inStock: true,
      supplierRating: 4.7,
      supplierImage: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 4,
      name: 'Whole Milk',
      supplier: 'Dairy Best',
      supplierId: 4,
      price: 3.25,
      unit: 'per gallon',
      rating: 4.6,
      reviews: 78,
      location: 'Fresno, CA',
      distance: '45.2 miles',
      category: 'dairy',
      image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Fresh whole milk from local farms',
      minOrder: 5,
      deliveryTime: '1-2 days',
      inStock: false,
      supplierRating: 4.6,
      supplierImage: 'https://images.pexels.com/photos/3764578/pexels-photo-3764578.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 5,
      name: 'Mixed Spice Blend',
      supplier: 'Spice Masters',
      supplierId: 5,
      price: 12.99,
      unit: 'per 5lb bag',
      rating: 4.9,
      reviews: 203,
      location: 'Oakland, CA',
      distance: '15.7 miles',
      category: 'spices',
      image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Premium spice blend for authentic flavors',
      minOrder: 2,
      deliveryTime: '2-3 days',
      inStock: true,
      supplierRating: 4.9,
      supplierImage: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 6,
      name: 'Basmati Rice',
      supplier: 'Golden Grains Co.',
      supplierId: 6,
      price: 4.50,
      unit: 'per 10lb bag',
      rating: 4.7,
      reviews: 92,
      location: 'Sacramento, CA',
      distance: '25.1 miles',
      category: 'grains',
      image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Premium long-grain basmati rice',
      minOrder: 5,
      deliveryTime: '2-4 days',
      inStock: true,
      supplierRating: 4.5,
      supplierImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Green Valley Farms',
      rating: 4.9,
      reviews: 124,
      location: 'Los Angeles, CA',
      distance: '5.2 miles',
      categories: ['vegetables', 'fruits'],
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Premium organic vegetables and fresh produce. Family-owned farm with 20+ years of experience.',
      totalProducts: 45,
      responseTime: '< 2 hours',
      minOrder: 25,
      deliveryTime: '1-2 days',
      verified: true
    },
    {
      id: 2,
      name: 'Quality Meats Co.',
      rating: 4.8,
      reviews: 89,
      location: 'San Francisco, CA',
      distance: '12.8 miles',
      categories: ['meat'],
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'High-quality meat and seafood supplier. USDA certified with strict quality standards.',
      totalProducts: 28,
      responseTime: '< 4 hours',
      minOrder: 50,
      deliveryTime: '1-3 days',
      verified: true
    },
    {
      id: 3,
      name: 'Spice Masters',
      rating: 4.9,
      reviews: 203,
      location: 'Oakland, CA',
      distance: '15.7 miles',
      categories: ['spices'],
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Authentic spices and seasonings from around the world. Bulk quantities available.',
      totalProducts: 67,
      responseTime: '< 1 hour',
      minOrder: 30,
      deliveryTime: '2-3 days',
      verified: true
    }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || 
                           product.location.toLowerCase().includes(locations.find(l => l.id === selectedLocation)?.name.toLowerCase() || '');
    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max));
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplier.categories.includes(selectedCategory);
    const matchesLocation = selectedLocation === 'all' || 
                           supplier.location.toLowerCase().includes(locations.find(l => l.id === selectedLocation)?.name.toLowerCase() || '');
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  // Add to cart function
  const addToCart = async (product: Product) => {
    // Add to local cart state
    setCartItems(prev => [...prev, product.id]);
    alert('Product added to cart successfully!');
  };

  // Toggle favorite
  const toggleFavorite = async (id: number) => {
    // Toggle favorite in local state
    const isFavorite = favorites.includes(id);
    setFavorites(prev => 
      isFavorite 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Contact supplier
  const contactSupplier = async (supplierId: number, supplierName: string) => {
    // Simulate sending message
    alert(`Message sent to ${supplierName} successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
          <p className="text-gray-600">Discover products and suppliers for your business</p>
        </div>
        <Link
          to="/vendor/cart"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>View Cart ({cartItems.length})</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'products'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'suppliers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suppliers ({filteredSuppliers.length})
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors duration-200 ${
                    favorites.includes(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
                {!product.inStock && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={product.supplierImage}
                    alt={product.supplier}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-gray-600 text-sm">{product.supplier}</p>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location} • {product.distance}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <span className="text-gray-500 ml-1">{product.unit}</span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Min: {product.minOrder} {product.unit.split(' ')[1]}</p>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      <span>{product.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-center flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock || cartItems.includes(product.id)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {cartItems.includes(product.id) ? 'Added' : 'Add to Cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suppliers Grid */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-full h-48 object-cover"
                />
                {supplier.verified && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Verified</span>
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(supplier.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors duration-200 ${
                    favorites.includes(supplier.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(supplier.id) ? 'fill-current' : ''}`} />
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
                    <p>{supplier.totalProducts} products</p>
                    <p>Response: {supplier.responseTime}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{supplier.location} • {supplier.distance}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{supplier.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {supplier.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                      >
                        {categories.find(cat => cat.id === category)?.name || category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Min Order:</span> ${supplier.minOrder}
                  </div>
                  <div>
                    <span className="font-medium">Delivery:</span> {supplier.deliveryTime}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/vendor/suppliers/${supplier.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-center flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                  <button
                    onClick={() => contactSupplier(supplier.id, supplier.name)}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'products' && sortedProducts.length === 0) || 
        (activeTab === 'suppliers' && filteredSuppliers.length === 0)) && (
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setPriceRange({ min: '', max: '' });
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMarketplace;