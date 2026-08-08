import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { addToCart } from '../slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data - in a real app, this would come from Redux store or API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockWishlist = [
        {
          _id: '1',
          name: 'Premium Basmati Rice',
          price: 299,
          image: '/api/placeholder/300/300',
          description: 'Long grain aromatic basmati rice',
          inStock: true,
          rating: 4.5,
          numReviews: 150
        },
        {
          _id: '2',
          name: 'Organic Honey',
          price: 450,
          image: '/api/placeholder/300/300',
          description: 'Pure organic wildflower honey',
          inStock: true,
          rating: 4.8,
          numReviews: 89
        },
        {
          _id: '3',
          name: 'Mixed Dry Fruits',
          price: 650,
          image: '/api/placeholder/300/300',
          description: 'Premium quality mixed dry fruits',
          inStock: false,
          rating: 4.6,
          numReviews: 203
        }
      ];
      setWishlistItems(mockWishlist);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      inStock: product.inStock,
      qty: 1
    }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
    toast.success('Item removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-6">💝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Start adding items you love to your wishlist!
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors transform hover:scale-105"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <div className="flex items-center space-x-2 text-2xl">
              <FaHeart className="text-red-500" />
              <span className="font-bold text-gray-900">{wishlistItems.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Product Image */}
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/products/${item._id}`}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FaEye className="text-gray-700" />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Stock Status */}
                {!item.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-600 text-sm ml-2">
                      ({item.numReviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{item.price}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={!item.inStock}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-colors ${
                      item.inStock
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart />
                    {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/products"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;