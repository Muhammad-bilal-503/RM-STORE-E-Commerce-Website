import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaLeaf, FaStar } from 'react-icons/fa';
import axiosInstance from '../utils/axios';
import { formatCurrency } from '../utils/formatCurrency';
import Rating from '../components/ui/Rating';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import { addToCart } from '../slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
        setSelectedVariantIndex(0);
        setQty(1);
        setError('');
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!product) return <Message variant="error">Product not found</Message>;

  // Stock and price are per-variant, not on the product itself.
  // Fall back to the product's own price only if it truly has no variants.
  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  const price = selectedVariant ? selectedVariant.price : product.price || 0;
  const discountPrice = product.discount > 0 ? price - price * (product.discount / 100) : null;
  const availableStock = selectedVariant ? selectedVariant.countInStock : 99;
  const inStock = availableStock > 0;

  const addToCartHandler = () => {
    if (!inStock) {
      toast.error('This variant is out of stock');
      return;
    }

    const productImage =
      product.images && product.images.length > 0 ? product.images[0] : product.image;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: productImage,
        price: discountPrice || price,
        variantName: selectedVariant?.size || 'Default',
        selectedVariant: selectedVariant?.size || 'default',
        countInStock: availableStock,
        qty,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const nutrition = product.nutritionFacts;
  const hasNutritionData =
    nutrition &&
    [nutrition.calories, nutrition.protein, nutrition.carbohydrates, nutrition.fat].some(
      (v) => v !== undefined && v !== null
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-green-700 hover:text-green-800 mb-6 flex items-center transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1">
                <FaStar size={10} /> Featured
              </span>
            )}
            {product.isOrganic && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1">
                <FaLeaf size={10} /> Organic
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Rating value={product.rating || 0} text={`${product.numReviews || 0} reviews`} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            {discountPrice ? (
              <>
                <span className="text-3xl font-bold text-green-700">{formatCurrency(discountPrice)}</span>
                <span className="text-lg text-gray-500 line-through">{formatCurrency(price)}</span>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-green-700">{formatCurrency(price)}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variant Selector */}
          {hasVariants && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant._id || index}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setQty(1);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      index === selectedVariantIndex
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:border-green-400'
                    } ${variant.countInStock === 0 ? 'opacity-50' : ''}`}
                  >
                    {variant.size}
                    {variant.countInStock === 0 && ' (Out of stock)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium capitalize">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-medium">{product.brand}</p>
            </div>
            {product.weight && (
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{product.weight}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className={`font-medium ${inStock ? 'text-green-700' : 'text-red-600'}`}>
                {inStock ? `${availableStock} in stock` : 'Out of stock'}
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <p className="text-gray-600 mr-4">Quantity:</p>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={!inStock}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                {[...Array(Math.min(availableStock, 20)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addToCartHandler}
              disabled={!inStock}
              className={`w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all duration-200 ${
                inStock
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Nutrition Facts */}
      {hasNutritionData && (
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h2>
          <div className="grid grid-cols-2 gap-4">
            {nutrition.calories !== undefined && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Calories</span>
                <span className="font-semibold">{nutrition.calories}</span>
              </div>
            )}
            {nutrition.protein !== undefined && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Protein</span>
                <span className="font-semibold">{nutrition.protein}g</span>
              </div>
            )}
            {nutrition.carbohydrates !== undefined && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Carbohydrates</span>
                <span className="font-semibold">{nutrition.carbohydrates}g</span>
              </div>
            )}
            {nutrition.fat !== undefined && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Fat</span>
                <span className="font-semibold">{nutrition.fat}g</span>
              </div>
            )}
          </div>
        </div>
      )}

      {product.ingredients && (
        <div className="mt-6 max-w-md">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ingredients</h2>
          <p className="text-gray-600">{product.ingredients}</p>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Rating value={review.rating} />
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {!userInfo && (
        <p className="mt-4 text-sm text-gray-500">
          <Link to="/login" className="text-green-700 hover:underline">
            Log in
          </Link>{' '}
          to leave a review.
        </p>
      )}
    </div>
  );
};

export default ProductPage;
