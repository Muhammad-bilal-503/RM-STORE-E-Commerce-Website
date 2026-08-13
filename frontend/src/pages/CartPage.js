import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity, initializePrices } from '../slices/cartSlice';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, taxPrice, shippingPrice, totalPrice } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize prices when component mounts
    dispatch(initializePrices());
  }, [dispatch]);

  const removeFromCartHandler = (productId, variantId) => {
    dispatch(removeFromCart({ productId, variantId }));
    toast.success('Item removed from cart');
  };

  const updateQuantityHandler = (productId, variantId, qty) => {
    if (qty === 0) {
      removeFromCartHandler(productId, variantId);
    } else {
      dispatch(updateCartItemQuantity({ productId, variantId, qty }));
    }
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login', { state: { from: { pathname: '/shipping' } } });
    }
  };

  const continueShopping = () => {
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="text-gray-400 text-8xl mb-6">🛍️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to find amazing deals!
              </p>
              <div className="space-y-4">
                <button
                  onClick={continueShopping}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Start Shopping
                </button>
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <nav className="mt-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.selectedVariant}`} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || 'https://via.placeholder.com/150'}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-600 mt-1">
                          {item.variantName && (
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full mr-2">
                              {item.variantName}
                            </span>
                          )}
                          <span className="font-semibold text-lg">{formatCurrency(item.price)}</span>
                        </p>
                        {item.inStock === false && (
                          <p className="text-red-600 text-sm mt-1">⚠️ Out of Stock</p>
                        )}
                      </div>
                      
                      {/* Quantity and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantityHandler(item._id, item.selectedVariant, item.qty - 1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            disabled={item.qty <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-4 py-2 font-medium text-gray-900 min-w-12 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantityHandler(item._id, item.selectedVariant, item.qty + 1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            disabled={item.qty >= (item.countInStock || 10)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCartHandler(item._id, item.selectedVariant)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Continue Shopping */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={continueShopping}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
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
                
                {shippingPrice === 0 && itemsPrice < 100 && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    🎉 Add {formatCurrency(100 - itemsPrice)} more for free shipping!
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={checkoutHandler}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
              
              {/* Security Notice */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 