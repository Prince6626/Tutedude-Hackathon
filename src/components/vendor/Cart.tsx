import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, MapPin, MessageCircle, ArrowLeft, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string;
  productId: number;
  name: string;
  supplier: string;
  supplierId: number;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  minOrder: number;
  deliveryTime: string;
}

interface CartSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 1,
      name: 'Fresh Tomatoes',
      supplier: 'Green Valley Farms',
      supplierId: 1,
      price: 2.50,
      quantity: 10,
      unit: 'lbs',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      minOrder: 5,
      deliveryTime: '1-2 days'
    },
    {
      id: '2',
      productId: 2,
      name: 'Premium Ground Beef',
      supplier: 'Quality Meats Co.',
      supplierId: 2,
      price: 8.99,
      quantity: 5,
      unit: 'lbs',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      minOrder: 2,
      deliveryTime: '1-3 days'
    },
    {
      id: '3',
      productId: 3,
      name: 'Mixed Spice Blend',
      supplier: 'Spice Masters',
      supplierId: 3,
      price: 12.99,
      quantity: 2,
      unit: '5lb bags',
      image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      minOrder: 1,
      deliveryTime: '2-3 days'
    }
  ]);

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '123 Food Truck Lane',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210'
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get current location using geocoding
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get address
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const components = result.components;
                
                setDeliveryAddress({
                  street: `${components.house_number || ''} ${components.road || ''}`.trim(),
                  city: components.city || components.town || components.village || '',
                  state: components.state_code || components.state || '',
                  zipCode: components.postcode || ''
                });
              }
            } else {
              // Fallback to a mock address based on coordinates
              setDeliveryAddress({
                street: `${Math.floor(latitude * 100)} Location Street`,
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90210'
              });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback address
            setDeliveryAddress({
              street: `${Math.floor(latitude * 100)} Current Location`,
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90210'
            });
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location. Please enter address manually.');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } catch (error) {
      console.error('Location error:', error);
      setIsLoadingLocation(false);
    }
  };

  // Calculate cart summary
  const calculateSummary = (): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 100 ? 0 : 15; // Free delivery over $100
    const total = subtotal + tax + deliveryFee;

    return { subtotal, tax, deliveryFee, total };
  };

  const summary = calculateSummary();

  // Update quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Check minimum order requirement
    if (newQuantity < item.minOrder) {
      alert(`Minimum order quantity is ${item.minOrder} ${item.unit}`);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Note: In a real application, this would sync with backend
    console.log('Cart updated locally');
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));

    // Note: In a real application, this would sync with backend
    console.log('Item removed from cart locally');
  };

  // Group items by supplier
  const groupedItems = cartItems.reduce((groups, item) => {
    const supplierId = item.supplierId;
    if (!groups[supplierId]) {
      groups[supplierId] = {
        supplier: item.supplier,
        items: []
      };
    }
    groups[supplierId].items.push(item);
    return groups;
  }, {} as Record<number, { supplier: string; items: CartItem[] }>);

  // Place order
  // ...existing code...
  // Place order
  const placeOrder = async () => {
    setIsProcessing(true);

    try {
      // Create orders for each supplier
      const ordersBySupplier = groupedItems;
      const newOrders = [];

      for (const [supplierId, group] of Object.entries(ordersBySupplier)) {
        const orderTotal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderTax = orderTotal * 0.08;
        const orderDeliveryFee = orderTotal > 100 ? 0 : 15;
        const orderGrandTotal = orderTotal + orderTax + orderDeliveryFee;

        const newOrder = {
          id: `ORD-${Date.now()}-${supplierId}`,
          vendorId: 'vendor-1', // Current vendor ID
          vendorName: 'Maria\'s Tacos',
          vendorEmail: 'maria@mariastacos.com',
          supplierId: parseInt(supplierId),
          supplierName: group.supplier,
          items: group.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            total: item.price * item.quantity
          })),
          subtotal: orderTotal,
          tax: orderTax,
          deliveryFee: orderDeliveryFee,
          total: orderGrandTotal,
          status: 'pending',
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentMethod: paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`,
          specialInstructions: specialInstructions || 'No special instructions',
          createdAt: new Date().toISOString()
        };

        newOrders.push(newOrder);
      }

      // Store orders in localStorage for suppliers to access
      const existingOrders = JSON.parse(localStorage.getItem('supplierOrders') || '[]');
      const updatedOrders = [...existingOrders, ...newOrders];
      localStorage.setItem('supplierOrders', JSON.stringify(updatedOrders));

      // Store orders in vendor's order history
      const existingVendorOrders = JSON.parse(localStorage.getItem('vendorOrders') || '[]');
      const updatedVendorOrders = [...existingVendorOrders, ...newOrders];
      localStorage.setItem('vendorOrders', JSON.stringify(updatedVendorOrders));

      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem('cart'); // <-- Only remove cart, not all storage
      
      // Show success message
      alert(`${newOrders.length} order(s) placed successfully! Your orders have been sent to the suppliers.`);
      
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
// ...existing code...
  // Contact supplier
  const contactSupplier = async (supplierId: number, supplierName: string) => {
    // Simulate sending message to supplier
    alert(`Message sent to ${supplierName} successfully!`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/marketplace"
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products from our marketplace to get started</p>
            <Link
              to="/marketplace"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 inline-block"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/marketplace"
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedItems).map(([supplierId, group]) => (
            <div key={supplierId} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{group.supplier}</h3>
                <button
                  onClick={() => contactSupplier(parseInt(supplierId), group.supplier)}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact Supplier</span>
                </button>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        ${item.price} {item.unit} • Min order: {item.minOrder} {item.unit}
                      </p>
                      <p className="text-sm text-gray-500">Delivery: {item.deliveryTime}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                        disabled={item.quantity <= item.minOrder}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
              <button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="ml-auto flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200 disabled:opacity-50"
              >
                <Navigation className="h-4 w-4" />
                <span>{isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Street Address"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="State"
                />
              </div>
              <input
                type="text"
                value={deliveryAddress.zipCode}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="ZIP Code"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Credit Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Any special delivery instructions or notes for suppliers..."
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {summary.deliveryFee === 0 ? 'FREE' : `$${summary.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          <button
            onClick={placeOrder}
            disabled={isProcessing}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Pay ₹' + summary.total.toFixed(2)}
          </button>

            {summary.subtotal < 100 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Add ${(100 - summary.subtotal).toFixed(2)} more for free delivery!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;