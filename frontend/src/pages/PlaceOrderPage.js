import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axios';
import { formatCurrency } from '../utils/formatCurrency';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect if missing information
  if (!shippingAddress.address) {
    navigate('/shipping');
    return null;
  }

  if (!paymentMethod) {
    navigate('/payment');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      // Create order object
      const order = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
          variant: item.selectedVariant,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      // Make API call to create order
      const { data } = await axiosInstance.post('/orders', order);
      
      // Clear cart and redirect to order details
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
      
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      toast.error(message);
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'stripe': return 'Credit/Debit Card';
      case 'paypal': return 'PayPal';
      case 'cod': return 'Cash on Delivery';
      case 'bank': return 'Bank Transfer';
      default: return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Review</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                  <button
                    onClick={() => navigate('/shipping')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-gray-700">
                  <p className="font-medium">{userInfo?.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.country}</p>
                  <p className="mt-2">📞 {shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  <button
                    onClick={() => navigate('/payment')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-700 font-medium">{getPaymentMethodName(paymentMethod)}</p>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                  <button
                    onClick={() => navigate('/cart')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={`${item._id}-${item.selectedVariant}`} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/150'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {item.variantName && (
                            <p className="text-sm text-gray-600">{item.variantName}</p>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(item.price * item.qty)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                    <span className="font-medium">{formatCurrency(itemsPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(shippingPrice)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(taxPrice)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={placeOrderHandler}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
                
                {/* Security Notice */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your order is protected by SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;