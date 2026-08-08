const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Analytics data is admin-only
router.use(protect, admin);

// Get analytics data
router.get('/', analyticsController.getAnalytics);

// Get sales report
router.get('/sales', analyticsController.getSalesReport);

// Get product performance report
router.get('/products', analyticsController.getProductReport);

// Get customer analytics report
router.get('/customers', analyticsController.getCustomerReport);

module.exports = router; 