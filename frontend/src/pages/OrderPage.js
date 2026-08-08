import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaPrint, 
  FaDownload, 
  FaTruck, 
  FaCheck, 
  FaShoppingCart,
  FaClock 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import axiosInstance from '../utils/axios';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/orders/${orderId}`);

      // The backend doesn't store itemsPrice separately — derive it from the line items
      const itemsPrice = (data.orderItems || []).reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      setOrder({ ...data, itemsPrice });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'placed', label: 'Placed', icon: FaShoppingCart, completed: true },
      { key: 'processing', label: 'Processing', icon: FaClock, completed: false, active: true },
      { key: 'shipped', label: 'Shipped', icon: FaTruck, completed: false },
      { key: 'delivered', label: 'Delivered', icon: FaCheck, completed: false }
    ];

    if (order) {
      steps.forEach(step => {
        if (order.status === 'Processing' && step.key === 'processing') {
          step.active = true;
        } else if (order.status === 'Shipped' && (step.key === 'placed' || step.key === 'processing' || step.key === 'shipped')) {
          step.completed = true;
          step.active = step.key === 'shipped';
        } else if (order.status === 'Delivered') {
          step.completed = true;
          step.active = false;
        }
      });
    }

    return steps;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info('PDF download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/profile"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link
            to="/profile"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/profile"
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Orders
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              {/* Status Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          step.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : step.active 
                              ? 'bg-yellow-500 border-yellow-500 text-white'
                              : 'bg-gray-200 border-gray-300 text-gray-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                        
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute top-6 left-12 w-full h-0.5 transition-colors duration-300 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} style={{ width: 'calc(100% + 2rem)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <FaTruck />
                    <span className="font-medium">Tracking Number: {order.trackingNumber}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.variant?.name && (
                        <p className="text-sm text-gray-600">Size: {item.variant.name}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₹{item.price}/each</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">₹{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹{order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{order.taxPrice.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  {order.isPaid && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid At:</span>
                      <span className="font-medium">
                        {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
              
              <div className="text-gray-600 space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;