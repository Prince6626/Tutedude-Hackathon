import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, ShoppingCart, MessageCircle, Heart, Eye, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsAPI, suppliersAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  supplierName: string;
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
  supplierImage: string;
}

interface Supplier {
  id: number;
  supplierName: string;
  businessName: string;
  supplierImage: string;
  totalProducts: number;
  averageRating: number;
  totalReviews: number;
  responseTime?: string;
  minOrder?: number;
  deliveryTime?: string;
}

const VendorMarketplace = () => {
  const { cartItems, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'products' | 'suppliers'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Load products and suppliers from API
  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, [selectedCategory, searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters: any = {};
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const productsData = await productsAPI.getAll(filters);
      console.log('Loaded products:', productsData);
      setProducts(productsData || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const suppliersData = await suppliersAPI.getAll();
      console.log('Loaded suppliers:', suppliersData);
      setSuppliers(suppliersData || []);
    } catch (err) {
      console.error('Error loading suppliers:', err);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesLocation = selectedLocation === 'all' || 
                           product.location?.toLowerCase().includes(locations.find(l => l.id === selectedLocation)?.name.toLowerCase() || '');
    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max));
    return matchesLocation && matchesPrice;
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

  // Check if product is in cart
  const isProductInCart = (productId: number) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Add to cart function
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      alert('Product added to cart successfully!');
    } catch (error) {
      alert('Failed to add product to cart');
      console.error('Error adding to cart:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id: number) => {
    const isFavorite = favorites.includes(id);
    setFavorites(prev => 
      isFavorite 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Contact supplier
  const contactSupplier = async (supplierId: number, supplierName: string) => {
    alert(`Message sent to ${supplierName} successfully!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              Suppliers (Coming Soon)
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
                    alt={product.supplierName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-gray-600 text-sm">{product.supplierName}</p>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location} • {product.distance}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
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
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock || isProductInCart(product.id)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {isProductInCart(product.id) ? 'Added' : 'Add to Cart'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={supplier.supplierImage || 'https://via.placeholder.com/60'}
                    alt={supplier.supplierName}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{supplier.supplierName}</h3>
                    <p className="text-gray-600 text-sm">{supplier.businessName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{supplier.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-500 text-sm">({supplier.totalReviews || 0} reviews)</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium">{supplier.totalProducts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">{supplier.responseTime || '< 2 hours'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="font-medium">₹{supplier.minOrder || 25}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setSelectedCategory('all');
                      // Filter products by this supplier
                      setSearchTerm(supplier.supplierName);
                    }}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Products</span>
                  </button>
                  <button
                    onClick={() => contactSupplier(supplier.id, supplier.supplierName)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1"
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

      {/* Empty State for Products */}
      {activeTab === 'products' && sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
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

      {/* Empty State for Suppliers */}
      {activeTab === 'suppliers' && suppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600 mb-4">No suppliers are currently available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMarketplace;