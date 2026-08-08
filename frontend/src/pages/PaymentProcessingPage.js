import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCreditCard, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';

const PaymentProcessingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
        
        // If order is already paid, redirect to success
        if (data.isPaid) {
          navigate(`/order-success/${orderId}`);
        }
      } catch (err) {
        toast.error('Error loading order');
        navigate('/orders');
      }
    };

    if (userInfo && orderId) {
      fetchOrder();
    }
  }, [orderId, userInfo, navigate]);

  const processPayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // Process payment based on payment method
      if (order.paymentMethod === 'cod' || order.paymentMethod === 'Cash on Delivery') {
        // For COD, just confirm the order
        await axiosInstance.post('/payment/cod', { orderId });
        
        setPaymentStatus('success');
        toast.success('Order confirmed! You will pay upon delivery.');
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2000);
      } else if (order.paymentMethod === 'stripe' || order.paymentMethod === 'Credit/Debit Card') {
        // TODO: this simulates a successful card payment instead of running a real
        // Stripe Elements charge. The backend already exposes a correct, secure flow
        // (POST /api/payment/create-payment-intent + the webhook at /api/payment/webhook) —
        // wiring up @stripe/react-stripe-js's <CardElement> + stripe.confirmCardPayment()
        // here is the remaining piece to make real card payments work end-to-end.
        await new Promise(resolve => setTimeout(resolve, 3000));

        await axiosInstance.put(`/orders/${orderId}/pay`, {
          id: `payment_${Date.now()}`,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          payment_intent_id: `pi_${Date.now()}`,
        });
        
        setPaymentStatus('success');
        toast.success('Payment processed successfully!');
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2000);
      } else if (order.paymentMethod === 'bank' || order.paymentMethod === 'Bank Transfer') {
        // For bank transfer, mark as pending and provide instructions
        setPaymentStatus('success');
        toast.success('Order confirmed! Please complete the bank transfer as instructed.');
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2000);
      } else {
        // Default case
        setPaymentStatus('success');
        toast.success('Order confirmed!');
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'stripe':
      case 'Credit/Debit Card':
        return <FaCreditCard className="text-2xl text-blue-600" />;
      case 'cod':
      case 'Cash on Delivery':
        return <span className="text-2xl">💵</span>;
      case 'bank':
      case 'Bank Transfer':
        return <span className="text-2xl">🏦</span>;
      case 'paypal':
      case 'PayPal':
        return <span className="text-2xl">🅿️</span>;
      default:
        return <FaCreditCard className="text-2xl text-gray-600" />;
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <FaSpinner className="animate-spin text-4xl text-blue-500" />;
      case 'success':
        return <FaCheckCircle className="text-4xl text-green-500" />;
      case 'failed':
        return <FaTimes className="text-4xl text-red-500" />;
      default:
        return getPaymentMethodIcon(order?.paymentMethod);
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing your payment...';
      case 'success':
        return 'Payment successful!';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return 'Ready to process payment';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center">
              {getStatusIcon()}
            </div>
          </motion.div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {getStatusMessage()}
            </h1>
            <p className="text-gray-600">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium">{order.orderItems.length} item(s)</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            {paymentStatus === 'pending' && (
              <button
                onClick={processPayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${order.totalPrice.toFixed(2)}`
                )}
              </button>
            )}
            
            {paymentStatus === 'failed' && (
              <button
                onClick={processPayment}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            )}
            
            <button
              onClick={() => navigate(`/order/${order._id}`)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              View Order Details
            </button>
          </motion.div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-xs text-gray-500">
              🔒 Your payment is secured with 256-bit SSL encryption
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;