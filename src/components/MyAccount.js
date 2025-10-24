import React, { useState, useEffect, useCallback } from 'react';
import { User, ShoppingBag, LogOut, X, Coffee, Clock, CheckCircle } from 'lucide-react';
import { AuthServiceNew } from '../auth-service-new';

const MyAccount = ({ user, onLogout, onClose }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profile = await AuthServiceNew.getUserProfile(user.uid);
      const userOrders = await AuthServiceNew.getUserOrders(user.uid);
      
      setUserProfile(profile);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    try {
      await AuthServiceNew.signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">☕</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-500">My Account</h2>
                <p className="text-yellow-600">Welcome, {userProfile?.name || 'User'}!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-pink-600'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <User size={18} className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-pink-600'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <ShoppingBag size={18} className="inline mr-2" />
              Orders
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {userProfile?.name || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {userProfile?.surname || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {userProfile?.mobile || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {userProfile?.email || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order History</h3>
              
              {Object.keys(orders).length === 0 ? (
                <div className="text-center py-12">
                  <Coffee size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <p className="text-sm text-gray-500">Your order history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(orders)
                    .sort(([,a], [,b]) => b.createdAt - a.createdAt)
                    .map(([orderId, order]) => (
                      <div key={orderId} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">#{order.orderNumber}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Table: {order.tableNumber}</p>
                            <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Items: {order.items?.length || 0}</p>
                            {order.items && (
                              <div className="text-sm text-gray-500">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <span key={index}>
                                    {item.name} ({item.quantity})
                                    {index < Math.min(order.items.length, 2) - 1 && ', '}
                                  </span>
                                ))}
                                {order.items.length > 2 && ` +${order.items.length - 2} more`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Account created: {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'Unknown'}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
