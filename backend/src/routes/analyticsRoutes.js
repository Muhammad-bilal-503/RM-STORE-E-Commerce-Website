const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesReport,
  getProductReport,
  getCustomerReport,
  getCategoryPerformance,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All analytics endpoints require the analytics.read permission and are
// computed live from real data
router.use(protect, authorize('analytics.read'));

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/products', getProductReport);
router.get('/customers', getCustomerReport);
router.get('/categories', getCategoryPerformance);

module.exports = router;
