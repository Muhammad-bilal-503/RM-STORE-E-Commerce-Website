const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesReport,
  getProductReport,
  getCustomerReport,
  getCategoryPerformance,
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All analytics endpoints are admin-only and computed live from real data
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/products', getProductReport);
router.get('/customers', getCustomerReport);
router.get('/categories', getCategoryPerformance);

module.exports = router;
