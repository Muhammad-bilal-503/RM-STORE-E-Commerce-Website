const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts,
  getProductCategories,
  getCategoryStats,
  renameCategory,
} = require('../controllers/productController');
const { protect, admin, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/top', getTopProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/categories/stats', protect, authorize('categories.read'), getCategoryStats);
router.put('/categories/rename', protect, authorize('categories.update'), renameCategory);
router.get('/category/:category', getProductsByCategory);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes (require the specific permission, not just "is some kind of admin")
router.post('/', protect, authorize('products.create'), createProduct);
router.put('/:id', protect, authorize('products.update'), updateProduct);
router.delete('/:id', protect, authorize('products.delete'), deleteProduct);

module.exports = router;
