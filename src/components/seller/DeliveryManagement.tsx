import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Clock, User, Phone, Star, 
  CheckCircle, XCircle, AlertCircle, Eye, 
  ArrowRight, Package, Users, Calendar
} from 'lucide-react';
import { deliveryAPI, deliveryPartnerAPI } from '../../services/api';

interface DeliveryPartner {
  id: number;
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  current_location_lat: number;
  current_location_lng: number;
  status: string;
  rating: number;
  total_deliveries: number;
}

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
}

const DeliveryManagement = () => {
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersResponse, deliveriesResponse] = await Promise.all([
        deliveryPartnerAPI.getAvailable(),
        deliveryAPI.getAll()
      ]);
      setDeliveryPartners(partnersResponse);
      setDeliveries(deliveriesResponse);
    } catch (error) {
      console.error('Error loading delivery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelivery = async (orderId: number, partnerId: number) => {
    try {
      const response = await deliveryAPI.assign(orderId, partnerId);
      if (response.success) {
        alert(`Delivery partner assigned successfully! Tracking: ${response.trackingNumber}`);
        loadData();
        setShowAssignModal(false);
      }
    } catch (error) {
      console.error('Error assigning delivery:', error);
      alert('Failed to assign delivery partner');
    }
  };

  const handleUpdateStatus = async (deliveryId: number, status: string) => {
    try {
      const response = await deliveryAPI.updateStatus(deliveryId, status);
      if (response.success) {
        alert(`Delivery status updated to ${status}`);
        loadData();
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
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
          <h2 className="text-2xl font-bold text-gray-900">Delivery Management</h2>
          <p className="text-gray-600">Manage order deliveries and track delivery partners</p>
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
              <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
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
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Partners</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryPartners.filter(p => p.status === 'available').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'in_transit').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{delivery.orderNumber}</p>
                      <p className="text-sm text-gray-500">₹{delivery.total}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{delivery.deliveryPartnerName}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500 ml-1">{delivery.partnerRating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1">{delivery.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{delivery.tracking_number}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(delivery.estimated_delivery_time).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedDelivery(delivery)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {delivery.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(delivery.order_id);
                            setShowAssignModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign
                        </button>
                      )}
                      {delivery.status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'picked_up')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Pick Up
                        </button>
                      )}
                      {delivery.status === 'picked_up' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'in_transit')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Start Transit
                        </button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Delivery Partner Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Delivery Partner</h3>
              <div className="space-y-4">
                {deliveryPartners.filter(p => p.status === 'available').map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{partner.name}</p>
                        <p className="text-sm text-gray-500">{partner.phone}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500 ml-1">{partner.rating}</span>
                          <span className="text-sm text-gray-500 ml-2">• {partner.total_deliveries} deliveries</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignDelivery(selectedOrderId!, partner.id)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <p className="text-sm font-medium text-gray-500">Delivery Partner</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedDelivery.deliveryPartnerName}</p>
                  <p className="text-sm text-gray-500">{selectedDelivery.deliveryPartnerPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedDelivery.status)}`}>
                    {getStatusIcon(selectedDelivery.status)}
                    <span className="ml-1">{selectedDelivery.status.replace('_', ' ')}</span>
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="text-sm text-gray-900">{selectedDelivery.deliveryAddress}</p>
                </div>
                {selectedDelivery.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">{selectedDelivery.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement; 