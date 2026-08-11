import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import Rating from '../ui/Rating';
import { addToCart } from '../../slices/cartSlice';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const wishlist = userInfo?.wishlist || [];
  
  // Get the default variant (first one)
  const defaultVariant = product.variants && product.variants.length > 0
    ? product.variants[0]
    : null;
    
  // Get the price from the default variant or product price
  const price = defaultVariant ? defaultVariant.price : (product.price || 0);
  
  // Calculate discount price if applicable
  const discountPrice = product.discount > 0 
    ? price - (price * (product.discount / 100))
    : null;
  
  // Check if product is in stock
  const inStock = defaultVariant ? defaultVariant.countInStock > 0 : true;
  
  // Get main product image
  const productImage = product.images && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
    : (product.image || 'https://via.placeholder.com/300x300?text=No+Image');
    
  // Check if product is in wishlist
  const isInWishlist = wishlist.includes(product._id);
  
  const addToCartHandler = () => {
    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }
    
    const cartItem = {
      _id: product._id,
      name: product.name,
      image: productImage,
      price: discountPrice || price,
      variantName: defaultVariant?.size || 'Default',
      selectedVariant: defaultVariant?.size || 'default',
      countInStock: defaultVariant?.countInStock || 10,
      qty: 1,
    };
    
    dispatch(addToCart(cartItem));
    toast.success(`${product.name} added to cart`);
  };
  
  if (viewMode === 'list') {
    return (
      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="relative md:w-1/3">
            {/* Badges */}
            {(product.isFeatured || product.isOrganic || product.discount > 0) && (
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                    ⭐ Featured
                  </span>
                )}
                {product.isOrganic && (
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                    🌱 Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                    -{product.discount}%
                  </span>
                )}
              </div>
            )}
            
            <Link to={`/product/${product._id}`}>
              <div className="h-64 md:h-full overflow-hidden">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          </div>
          
          {/* Product Info */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <Link to={`/product/${product._id}`}>
                <h3 className="text-2xl font-bold mb-2 hover:text-green-700 transition-colors duration-200">
                  {product.name}
                </h3>
              </Link>
              
              <div className="mb-3">
                <Rating value={product.rating || 0} text={`${product.numReviews || 0} reviews`} />
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.description || 'Premium quality product sourced from the finest suppliers.'}
              </p>
              
              {/* Category and Brand */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {product.brand}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-green-700">{formatCurrency(discountPrice)}</span>
                      <span className="text-lg text-gray-500 line-through">{formatCurrency(price)}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-green-700">{formatCurrency(price)}</span>
                  )}
                </div>
                {defaultVariant?.size && (
                  <div className="text-sm text-gray-600 mt-1">
                    Size: {defaultVariant.size}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Wishlist Button */}
                <button className="p-3 rounded-full bg-gray-100 hover:bg-red-50 transition-colors group">
                  {isInWishlist ? (
                    <FaHeart className="text-red-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <FaRegHeart className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  )}
                </button>
                
                {/* Add to Cart Button */}
                <button
                  onClick={addToCartHandler}
                  disabled={!inStock}
                  className={`py-3 px-6 rounded-xl flex items-center gap-2 text-white font-semibold transition-all duration-200 ${
                    inStock
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Grid view (default)
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      whileHover={{ y: -8 }}
      layout
    >
      {/* Product Image */}
      <div className="relative">
        {/* Badges */}
        {(product.isFeatured || product.isOrganic || product.discount > 0) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg">
                ⭐ Featured
              </span>
            )}
            {product.isOrganic && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg">
                🌱 Organic
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg">
                -{product.discount}%
              </span>
            )}
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 shadow-lg group/wishlist">
          {isInWishlist ? (
            <FaHeart className="text-red-500 group-hover/wishlist:scale-110 transition-transform" />
          ) : (
            <FaRegHeart className="text-gray-600 group-hover/wishlist:text-red-500 transition-colors" />
          )}
        </button>
        
        <Link to={`/product/${product._id}`}>
          <div className="h-64 overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-green-700 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-3">
          <Rating value={product.rating || 0} text={`${product.numReviews || 0} reviews`} />
        </div>
        
        {/* Category */}
        <div className="mb-3">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {product.category}
          </span>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {discountPrice ? (
              <>
                <span className="text-xl font-bold text-green-700">{formatCurrency(discountPrice)}</span>
                <span className="text-sm text-gray-500 line-through">{formatCurrency(price)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-green-700">{formatCurrency(price)}</span>
            )}
          </div>
          {defaultVariant?.size && (
            <div className="text-sm text-gray-600 mt-1">
              Size: {defaultVariant.size}
            </div>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={addToCartHandler}
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all duration-200 ${
            inStock
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FaShoppingCart />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 