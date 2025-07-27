import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, MapPin, MessageCircle, ArrowLeft, Navigation, Map, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI, deliveryAPI, deliveryPartnerAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';


interface CartSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, loading, error, clearCart } = useCart();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '123 Food Truck Lane',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210'
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Debug: Monitor deliveryAddress changes
  useEffect(() => {
    console.log('Delivery address updated:', deliveryAddress);
  }, [deliveryAddress]);

  // 1. Add Razorpay script loading in useEffect
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Function to forward geocode (address to coordinates)
  const forwardGeocode = async (address: string) => {
    console.log('Forward geocoding address:', address);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Forward geocoding result:', data);
        
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          
          console.log('Found coordinates:', lat, lng);
          
          // Set the location for map display
          setCurrentLocation({ lat, lng, address: result.display_name });
          setSelectedLocation({ lat, lng, address: result.display_name });
          
          // Show map with the found location
          setShowMap(true);
          
          return { lat, lng };
        } else {
          console.log('No coordinates found for address');
          alert('Location not found. Please try a different address.');
        }
      } else {
        console.error('Forward geocoding API error:', response.status);
        alert('Unable to find location. Please try again.');
      }
    } catch (error) {
      console.error('Forward geocoding error:', error);
      alert('Error finding location. Please try again.');
    }
  };

  // Function to parse address and update delivery fields
  const parseAddressAndUpdate = (fullAddress: string) => {
    console.log('Parsing address:', fullAddress);
    const parts = fullAddress.split(',').map(part => part.trim());
    console.log('Address parts:', parts);

    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';

    const zipCodeIndex = parts.findIndex(part => /^\d{5,6}$/.test(part));
    if (zipCodeIndex !== -1) {
      zipCode = parts[zipCodeIndex];
      parts.splice(zipCodeIndex, 1);
    }

    const countryIndex = parts.findIndex(part =>
      ['India', 'United States', 'Canada', 'UK', 'Australia'].includes(part)
    );
    if (countryIndex !== -1) {
      parts.splice(countryIndex, 1);
    }

    if (parts.length >= 3) { // For Indian addresses: "Madhupura, Asarva Taluka, Ahmedabad, Gujarat"
      street = parts[0] || 'Unknown Street';
      city = parts[2] || parts[1] || 'Unknown City';
      state = parts[3] || parts[2] || 'Unknown State';
    } else if (parts.length >= 2) {
      street = parts[0] || 'Unknown Street';
      city = parts[1] || 'Unknown City';
      state = 'Unknown State';
    } else {
      street = parts[0] || fullAddress;
      city = 'Unknown City';
      state = 'Unknown State';
    }

    console.log('Parsed address components:', { street, city, state, zipCode });

    const updatedAddress = {
      street: street,
      city: city,
      state: state,
      zipCode: zipCode || 'Unknown ZIP'
    };
    console.log('Setting delivery address to:', updatedAddress);
    setDeliveryAddress(updatedAddress);
  };

  // 2. Add handlePayment function
  const handlePayment = () => {
    if (!(window as any).Razorpay) {
      alert('Razorpay not loaded. Please try again.');
      return;
    }

    const options = {
      key: 'rzp_test_bW1uocJtyIMt1H', // Replace with your actual key
      amount: summary.total * 100, // Amount in paise
      currency: 'INR',
      name: 'Food Supply Platform',
      description: 'Order Payment',
      image: 'https://via.placeholder.com/150',
      order_id: null,
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone
      },
      notes: {
        address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`
      },
      theme: {
        color: '#f97316'
      },
      handler: async function (response: any) {
        try {
          console.log('Payment successful:', response);
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          
          // Create orders and assign delivery partners
          await createOrdersAndAssignDelivery();
          
        } catch (error) {
          console.error('Error processing payment success:', error);
          alert('Payment successful but there was an error processing your order. Please contact support.');
        }
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

const createOrdersAndAssignDelivery = async () => {
    try {
      setIsProcessing(true);
      
      // Create orders
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          supplierId: item.supplierId
        })),
        deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`,
        paymentMethod: 'razorpay',
        specialInstructions: specialInstructions
      };

      const orderResponse = await ordersAPI.create(orderData);
      
      if (orderResponse.success) {
        // Get available delivery partners
        const availablePartners = await deliveryPartnerAPI.getAvailable();
        
        if (availablePartners.length > 0) {
          // Assign delivery partner to each order
          for (const order of orderResponse.orders) {
            const selectedPartner = availablePartners[0]; // Select first available partner
            await deliveryAPI.assign(order.id, selectedPartner.id);
          }
          
          alert(`✅ Payment successful! Orders created and delivery partners assigned.\n📦 Orders sent to ${orderResponse.supplierCount} suppliers.\n🚚 Delivery partners assigned for tracking.`);
        } else {
          alert(`✅ Payment successful! Orders created.\n📦 Orders sent to ${orderResponse.supplierCount} suppliers.\n⚠️ No delivery partners available at the moment.`);
        }
        
        // Clear cart and form
        clearCart();
        setDeliveryAddress({ street: '', city: '', state: '', zipCode: '' });
        setSpecialInstructions('');
        setCustomerDetails({ name: '', email: '', phone: '' });
        
      } else {
        alert('Payment successful but order creation failed. Please contact support.');
      }
      
    } catch (error: any) {
      console.error('Error creating orders and assigning delivery:', error);
      if (error.message && error.message.toLowerCase().includes('authentication')) {
        alert('Authentication failed. Please login again.');
        // Logout user and redirect to login
        
        navigate('/login');
      } else {
        alert('Payment successful but there was an error processing your order. Please contact support.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle address fetched from LocationFetcher
  const handleAddressFetched = (address: string) => {
    console.log('Address fetched from LocationFetcher:', address);
    setFetchedAddress(address);
    parseAddressAndUpdate(address);
  };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapsLoaded(true);
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        // Use a demo key for development - replace with your actual API key in production
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGI&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setMapsLoaded(true);
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google Maps'));
        };
        document.head.appendChild(script);
      });
    };

    if (showMap) {
      loadGoogleMaps().then(() => {
        initializeMap();
      }).catch((error) => {
        console.error('Failed to load Google Maps:', error);
        // Fallback: just use the coordinates without map
        if (currentLocation) {
          setSelectedLocation(currentLocation);
          reverseGeocodeFallback(currentLocation.lat, currentLocation.lng);
        }
      });
    }
  }, [showMap, currentLocation, selectedLocation]);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Los Angeles

    const map = new window.google.maps.Map(mapRef.current, {
      center: selectedLocation || currentLocation || defaultLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add click listener to map
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation({ lat, lng, address: '' });
      
      // Update marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
        title: 'Selected Location'
      });

      // Reverse geocode the selected location
      reverseGeocode(lat, lng);
    });

    // If we have a selected location (from manual search or current location), add a marker
    if (selectedLocation) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        draggable: true,
        title: selectedLocation.address || 'Selected Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      // Add drag listener to marker
      markerRef.current.addListener('dragend', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng, address: '' });
        reverseGeocode(lat, lng);
      });
    }
  };

  // Reverse geocoding function using Google Maps API
  const reverseGeocode = async (lat: number, lng: number) => {
    console.log('Starting reverse geocoding for:', lat, lng);
    
    if (!window.google?.maps) {
      console.log('Google Maps not available, using fallback');
      reverseGeocodeFallback(lat, lng);
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        console.log('Google Maps geocoding result:', status, results);
        
        if (status === 'OK' && results[0]) {
          const result = results[0];
          const addressComponents = result.address_components;
          
          let streetNumber = '';
          let route = '';
          let city = '';
          let state = '';
          let zipCode = '';

          for (const component of addressComponents) {
            const types = component.types;
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('route')) {
              route = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('postal_code')) {
              zipCode = component.long_name;
            }
          }

          const street = `${streetNumber} ${route}`.trim();
          const address = result.formatted_address;

          console.log('Google Maps address components:', { street, city, state, zipCode });

          setSelectedLocation({ lat, lng, address });
          
          // Update delivery address
          setDeliveryAddress({
            street: street || 'Unknown Street',
            city: city || 'Unknown City',
            state: state || 'Unknown State',
            zipCode: zipCode || 'Unknown ZIP'
          });
        } else {
          console.log('Google Maps geocoding failed, using fallback');
          reverseGeocodeFallback(lat, lng);
        }
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      reverseGeocodeFallback(lat, lng);
    }
  };

  // Fallback reverse geocoding using a free service
  const reverseGeocodeFallback = async (lat: number, lng: number) => {
    console.log('Using fallback geocoding for:', lat, lng);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('OpenStreetMap geocoding result:', data);
        
        const address = data.address;
        
        // Handle international addresses with different structures
        let street = '';
        let city = '';
        let state = '';
        let zipCode = '';
        
        // Try different address component combinations for international locations
        if (address.road) {
          street = `${address.house_number || ''} ${address.road}`.trim();
        } else if (address.suburb) {
          street = address.suburb;
        } else if (address.neighbourhood) {
          street = address.neighbourhood;
        } else {
          street = 'Unknown Street';
        }
        
        // Handle city field variations
        if (address.city) {
          city = address.city;
        } else if (address.town) {
          city = address.town;
        } else if (address.village) {
          city = address.village;
        } else if (address.county) {
          city = address.county;
        } else if (address.state_district) {
          city = address.state_district;
        } else {
          city = 'Unknown City';
        }
        
        // Handle state field variations
        if (address.state) {
          state = address.state;
        } else if (address.province) {
          state = address.province;
        } else {
          state = 'Unknown State';
        }
        
        // Handle postal code variations
        if (address.postcode) {
          zipCode = address.postcode;
        } else if (address.postal_code) {
          zipCode = address.postal_code;
        } else {
          zipCode = 'Unknown ZIP';
        }
        
        console.log('OpenStreetMap address components:', { 
          street, 
          city, 
          state, 
          zipCode,
          originalAddress: address
        });
        
        setSelectedLocation({ 
          lat, 
          lng, 
          address: data.display_name 
        });
        
        // Update delivery address with proper fallbacks
        const updatedAddress = {
          street: street,
          city: city,
          state: state,
          zipCode: zipCode
        };
        
        console.log('Setting delivery address to:', updatedAddress);
        setDeliveryAddress(updatedAddress);
        
        console.log('Delivery address updated:', updatedAddress);
      } else {
        console.error('OpenStreetMap API error:', response.status);
        // Set basic coordinates as address
        setSelectedLocation({ 
          lat, 
          lng, 
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
        });
        
        // Set a basic address based on coordinates
        setDeliveryAddress({
          street: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          city: 'Unknown City',
          state: 'Unknown State',
          zipCode: 'Unknown ZIP'
        });
      }
    } catch (error) {
      console.error('Fallback geocoding error:', error);
      // Set basic coordinates as address
      setSelectedLocation({ 
        lat, 
        lng, 
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
      });
      
      // Set a basic address based on coordinates
      setDeliveryAddress({
        street: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: 'Unknown City',
        state: 'Unknown State',
        zipCode: 'Unknown ZIP'
      });
    }
  };

  // Get current location using geolocation
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
          
          setCurrentLocation({ lat: latitude, lng: longitude, address: '' });
          setSelectedLocation({ lat: latitude, lng: longitude, address: '' });
          
          // Show map for location confirmation
          setShowMap(true);
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location. Please enter address manually or try again.');
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

  // Confirm location from map
  const confirmLocation = () => {
    if (selectedLocation) {
      setShowMap(false);
      // The address is already updated via reverseGeocode
    }
  };

  // Calculate cart summary
  const calculateSummary = (): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const deliveryFee = subtotal >= 1000 ? 0 : 100; // Free delivery above ₹1000
    const total = subtotal + tax + deliveryFee;

    return { subtotal, tax, deliveryFee, total };
  };

  const summary = calculateSummary();

  // Update quantity
  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Check minimum order requirement
    if (newQuantity < item.minOrder) {
      alert(`Minimum order quantity is ${item.minOrder} ${item.unit}`);
      return;
    }

    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      alert('Failed to update quantity');
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      alert('Failed to remove item');
      console.error('Error removing item:', error);
    }
  };

  // Group items by supplier
  const groupedItems = cartItems.reduce((groups, item) => {
    const supplierId = item.supplierId;
    if (!groups[supplierId]) {
      groups[supplierId] = {
        supplier: item.supplierName,
        items: []
      };
    }
    groups[supplierId].items.push(item);
    return groups;
  }, {} as Record<number, { supplier: string; items: any[] }>);

  // 3. Update your placeOrder function
  const placeOrder = async () => {
    if (!user) {
      alert('Please login to proceed with payment.');
      navigate('/login');
      return;
    }

    if (paymentMethod === 'razorpay') {
      setIsProcessing(true);
      handlePayment();
    } else {
      setIsProcessing(true);
      try {
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            supplierId: item.supplierId
          })),
          deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`,
          paymentMethod: paymentMethod,
          specialInstructions: specialInstructions
        };

        const response = await ordersAPI.create(orderData);
        if (response.success) {
          alert(`✅ Order placed successfully! Orders sent to ${response.supplierCount} suppliers.\n🚚 Delivery partners will be assigned automatically when suppliers accept orders.`);
          console.log('Order details:', response);
          clearCart();
          setDeliveryAddress({ street: '', city: '', state: '', zipCode: '' });
          setSpecialInstructions('');
          setCustomerDetails({ name: '', email: '', phone: '' });
        } else {
          alert('Failed to place order. Please try again.');
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Cart</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/vendor/marketplace"
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
              to="/vendor/marketplace"
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
            to="/vendor/marketplace"
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
                        ₹{item.price} {item.unit} • Min order: {item.minOrder} {item.unit}
                      </p>
                      <p className="text-sm text-gray-500">Delivery: {item.deliveryTime}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                        disabled={item.quantity <= item.minOrder}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
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
              {/* Manual Address Search */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && manualAddress.trim()) {
                      forwardGeocode(manualAddress);
                    }
                  }}
                  placeholder="Enter address to search..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={() => forwardGeocode(manualAddress)}
                  disabled={!manualAddress.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
              
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

          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Razorpay (Online Payment)</span>
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
                <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">₹{summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          <button
            onClick={placeOrder}
            disabled={isProcessing}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isProcessing ? 'Processing...' : `Pay ₹${summary.total.toFixed(2)}`}
          </button>

            {summary.subtotal < 1000 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Add ₹{(1000 - summary.subtotal).toFixed(2)} more for free delivery!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 h-5/6 max-w-4xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Map className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Confirm Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  {currentLocation ? 'Your current location is marked. Click anywhere on the map to select a different location, or drag the marker to adjust.' : 'Click anywhere on the map to select your delivery location.'}
                </p>
                {selectedLocation && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Selected Location:</strong> {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
                    </p>
                  </div>
                )}
              </div>
              
              <div 
                ref={mapRef} 
                className="w-full h-96 rounded-lg border border-gray-300"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLocation}
                disabled={!selectedLocation}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;