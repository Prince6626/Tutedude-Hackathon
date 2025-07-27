import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Truck, Shield, MessageCircle, ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mock product data - in real app, fetch based on id
  const product = {
    id: 1,
    name: 'Fresh Tomatoes',
    supplier: 'Green Valley Farms',
    price: 2.50,
    unit: 'per lb',
    rating: 4.8,
    reviews: 124,
    location: 'Los Angeles, CA',
    description: 'Premium quality fresh tomatoes, perfect for street food preparation. Grown using sustainable farming practices and harvested at peak ripeness for maximum flavor and nutrition.',
    images: [
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    ],
    specifications: {
      'Origin': 'California, USA',
      'Variety': 'Roma Tomatoes',
      'Shelf Life': '7-10 days',
      'Storage': 'Cool, dry place',
      'Minimum Order': '10 lbs',
      'Delivery Time': '1-2 business days'
    },
    supplier_info: {
      name: 'Green Valley Farms',
      rating: 4.9,
      years_in_business: 15,
      total_orders: 2500,
      response_time: '< 2 hours',
      avatar: 'https://images.pexels.com/photos/3764578/pexels-photo-3764578.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  };

  // Add to cart function
  const addToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          supplierId: 1 // This should come from product data
        })
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Please login to add items to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
                            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">StreetSmart Supply</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
                    <span className="text-gray-500 ml-2">per {product.unit}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews} reviews)</span>
                  </div>
                </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">lbs</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  Total: ₹{(product.price * quantity).toFixed(2)}
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={addToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-200">
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">1-2 days</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Quality Assured</p>
                  <p className="text-xs text-gray-500">Premium grade</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Direct Contact</p>
                  <p className="text-xs text-gray-500">Chat with supplier</p>
                </div>
              </div>
            </div>

            {/* Supplier Info */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Supplier Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={product.supplier_info.avatar}
                  alt={product.supplier_info.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{product.supplier_info.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.supplier_info.rating}</span>
                    <span className="text-sm text-gray-500">supplier rating</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Years in Business:</span>
                  <span className="font-medium ml-2">{product.supplier_info.years_in_business}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Orders:</span>
                  <span className="font-medium ml-2">{product.supplier_info.total_orders}+</span>
                </div>
                <div>
                  <span className="text-gray-500">Response Time:</span>
                  <span className="font-medium ml-2">{product.supplier_info.response_time}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                Contact Supplier
              </button>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="border border-gray-200 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="text-lg font-semibold text-gray-900">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;