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
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/top', getTopProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
