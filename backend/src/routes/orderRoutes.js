const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('orders.read'), getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('orders.update'), updateOrderToDelivered);
router.route('/:id/status').put(protect, authorize('orders.update'), updateOrderStatus);

module.exports = router; 