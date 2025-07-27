import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Clock, User, Phone, Star, 
  CheckCircle, XCircle, AlertCircle, Eye, 
  Package, Calendar, Navigation
} from 'lucide-react';
import { deliveryAPI } from '../../services/api';

interface Delivery {
  id: number;
  order_id: number;
  orderNumber: string;
  total: number;
  deliveryAddress: string;
  delivery_partner_id: number;
  deliveryPartnerName: string;
  deliveryPartnerPhone: string;
  vehicle_type: string;
  partnerRating: number;
  status: string;
  assigned_at: string;
  pickup_time: string;
  delivery_time: string;
  estimated_delivery_time: string;
  actual_delivery_time: string;
  tracking_number: string;
  notes: string;
  created_at: string;
  progress: number;
  statusText: string;
}

const DeliveryTracking = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getAll();
      setDeliveries(response);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'assigned':
        return <User className="h-4 w-4" />;
      case 'picked_up':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress <= 25) return 'bg-yellow-500';
    if (progress <= 50) return 'bg-orange-500';
    if (progress <= 75) return 'bg-purple-500';
    return 'bg-green-500';
  };

  const filteredDeliveries = filterStatus 
    ? deliveries.filter(d => d.status === filterStatus)
    : deliveries;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
          <p className="text-gray-600">Track your order deliveries in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Navigation className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'in_transit').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{delivery.orderNumber}</h3>
                <p className="text-sm text-gray-500">₹{delivery.total}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(delivery.status)}`}>
                {getStatusIcon(delivery.status)}
                <span className="ml-1">{delivery.status.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{delivery.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(delivery.progress || 0)}`}
                  style={{ width: `${delivery.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Delivery Partner Info */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{delivery.deliveryPartnerName}</p>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-500 ml-1">{delivery.partnerRating}</span>
                  <span className="text-sm text-gray-500 ml-2">• {delivery.vehicle_type}</span>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span>{delivery.tracking_number}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Est: {new Date(delivery.estimated_delivery_time).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDelivery(delivery)}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Track
              </button>
              <button
                onClick={() => window.open(`tel:${delivery.deliveryPartnerPhone}`)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Details</h3>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedDelivery.orderNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedDelivery.tracking_number}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedDelivery.status)}`}>
                    {getStatusIcon(selectedDelivery.status)}
                    <span className="ml-1">{selectedDelivery.status.replace('_', ' ')}</span>
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Partner</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedDelivery.deliveryPartnerName}</p>
                  <p className="text-sm text-gray-500">{selectedDelivery.deliveryPartnerPhone}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-500 ml-1">{selectedDelivery.partnerRating}</span>
                    <span className="text-sm text-gray-500 ml-2">• {selectedDelivery.vehicle_type}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="text-sm text-gray-900">{selectedDelivery.deliveryAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedDelivery.estimated_delivery_time).toLocaleString()}
                  </p>
                </div>
                
                {selectedDelivery.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">{selectedDelivery.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => window.open(`tel:${selectedDelivery.deliveryPartnerPhone}`)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <Phone className="h-4 w-4 inline mr-2" />
                    Call Partner
                  </button>
                  <button
                    onClick={() => setSelectedDelivery(null)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking; 