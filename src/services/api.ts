const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `HTTP error! status: ${response.status} for endpoint: ${endpoint}`;
      console.error(`[API ERROR] ${endpoint} - Status: ${response.status} - Message:`, errorMsg);
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API REQUEST FAILED] ${endpoint}:`, error);
    throw error;
  }
};

// Products API
export const productsAPI = {
  getAll: async (filters?: {
    category?: string;
    search?: string;
    supplierId?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.supplierId) {
      params.append('supplierId', filters.supplierId.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return await apiRequest(endpoint);
  },

  getById: async (id: number) => {
    return await apiRequest(`/products/${id}`);
  },
};

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    return await apiRequest('/suppliers');
  },

  getById: async (id: number) => {
    return await apiRequest(`/suppliers/${id}`);
  },
};

// Cart API
export const cartAPI = {
  getItems: async () => {
    return await apiRequest('/cart');
  },

  addItem: async (productId: number, quantity: number) => {
    return await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (itemId: number) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    // This will be handled by the backend when placing orders
    return await apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return await apiRequest('/orders');
  },

  getItems: async (orderId: number) => {
    return await apiRequest(`/orders/${orderId}/items`);
  },

  create: async (orderData: {
    items: Array<{
      productId: number;
      quantity: number;
      price: number;
      supplierId: number;
    }>;
    deliveryAddress: string;
    paymentMethod: string;
    specialInstructions?: string;
  }) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  updateStatus: async (orderId: number, status: string) => {
    return await apiRequest(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async () => {
    return await apiRequest('/users');
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => apiRequest('/notifications')
};

// Delivery Partner API
export const deliveryPartnerAPI = {
  getAll: () => apiRequest('/delivery-partners'),
  getAvailable: () => apiRequest('/delivery-partners/available'),
  updateLocation: (partnerId: number, lat: number, lng: number) => 
    apiRequest(`/delivery-partners/${partnerId}/location`, {
      method: 'PUT',
      body: JSON.stringify({ lat, lng })
    })
};

// Delivery API
export const deliveryAPI = {
  assign: (orderId: number, deliveryPartnerId: number) => 
    apiRequest('/deliveries/assign', {
      method: 'POST',
      body: JSON.stringify({ orderId, deliveryPartnerId })
    }),
  updateStatus: (deliveryId: number, status: string, notes?: string) => 
    apiRequest(`/deliveries/${deliveryId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    }),
  getTracking: (trackingNumber: string) => 
    apiRequest(`/deliveries/tracking/${trackingNumber}`),
  getAll: (status?: string, deliveryPartnerId?: number) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (deliveryPartnerId) params.append('deliveryPartnerId', deliveryPartnerId.toString());
    return apiRequest(`/deliveries?${params.toString()}`);
  }
};

// Location API
export const locationAPI = {
  getSellerLocations: (sellerId: number) => 
    apiRequest(`/seller-locations/${sellerId}`),
  getVendorLocations: (vendorId: number) => 
    apiRequest(`/vendor-locations/${vendorId}`)
};

// Export default API object
export default {
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  users: usersAPI,
}; 