import React, { useState, useEffect } from 'react';
import { Save, Camera, MapPin, Phone, Mail, Utensils, Star, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const VendorProfile = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessType: 'Street Food Vendor',
    cuisine: '',
    description: '',
    businessLicense: '',
    healthPermit: '',
    operatingHours: {
      monday: '11:00 AM - 9:00 PM',
      tuesday: '11:00 AM - 9:00 PM',
      wednesday: '11:00 AM - 9:00 PM',
      thursday: '11:00 AM - 9:00 PM',
      friday: '11:00 AM - 10:00 PM',
      saturday: '10:00 AM - 10:00 PM',
      sunday: '12:00 PM - 8:00 PM'
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    },
    paymentMethods: ['Cash', 'Credit Card', 'Mobile Payment'],
    specialties: [],
    averageOrderValue: 0,
    monthlyRevenue: 0
  });

  const [activeTab, setActiveTab] = useState('general');

  // Initialize profile with user data when component mounts
  useEffect(() => {
    if (user && user.role === 'vendor') {
      setProfile(prev => ({
        ...prev,
        businessName: user.businessName || '',
        ownerName: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        businessType: 'Street Food Vendor',
        cuisine: '',
        description: '',
        businessLicense: '',
        healthPermit: ''
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save profile logic here
    console.log('Saving vendor profile:', profile);
  };

  // Get initials for profile picture
  const getInitials = () => {
    if (profile.businessName) {
      return profile.businessName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile.ownerName) {
      return profile.ownerName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'VP'; // Default initials for Vendor Profile
  };

  const stats = [
    { label: 'Total Orders', value: '0', color: 'text-blue-600', icon: '🍽️' },
    { label: 'Total Spent', value: '₹0', color: 'text-green-600', icon: '💰' },
    { label: 'Suppliers', value: '0', color: 'text-purple-600', icon: '🏪' },
    { label: 'Avg Rating', value: '0.0', color: 'text-yellow-600', icon: '⭐' }
  ];

  const tabs = [
    { id: 'general', name: 'General Info' },
    { id: 'business', name: 'Business Details' },
    { id: 'operations', name: 'Operations' },
    { id: 'social', name: 'Social & Marketing' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Profile</h2>
          <p className="text-gray-600">Manage your street food business information and settings</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Profile Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials()}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{profile.businessName || 'Your Business Name'}</h3>
            <p className="text-gray-600">{profile.businessType}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile.address || 'Add your address'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile.phone || 'Add your phone'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profile.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                  <input
                    type="text"
                    value={profile.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                  <input
                    type="text"
                    value={profile.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Mexican, Indian, Chinese"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                  <input
                    type="text"
                    value={profile.businessLicense}
                    onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter license number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Permit</label>
                  <input
                    type="text"
                    value={profile.healthPermit}
                    onChange={(e) => handleInputChange('healthPermit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter permit number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe your street food business..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profile.operatingHours).map(([day, hours]) => (
                  <div key={day}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{day}</label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleInputChange('operatingHours', {
                        ...profile.operatingHours,
                        [day]: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 11:00 AM - 9:00 PM"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Social Media & Marketing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="text"
                    value={profile.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia', {
                      ...profile.socialMedia,
                      instagram: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="@yourbusiness"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="text"
                    value={profile.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia', {
                      ...profile.socialMedia,
                      facebook: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your Facebook page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="text"
                    value={profile.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia', {
                      ...profile.socialMedia,
                      twitter: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="@yourbusiness"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;