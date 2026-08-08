const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/orderModel');

const {
  createPaymentIntent,
  handleWebhook,
} = require('../controllers/paymentController');

// @route   POST /api/payment/create-payment-intent
// @desc    Create a Stripe PaymentIntent for an order (used with Stripe Elements on the client)
// @access  Private
router.post('/create-payment-intent', protect, createPaymentIntent);

// @route   POST /api/payment/webhook
// @desc    Handle Stripe webhook events (marks order as paid on payment_intent.succeeded)
// @access  Public (verified via Stripe signature)
// NOTE: the raw body parser for this route is applied globally in server.js,
// BEFORE express.json(), because Stripe signature verification requires the
// unparsed request body.
router.post('/webhook', handleWebhook);

// @route   POST /api/payment/cod
// @desc    Confirm a Cash on Delivery order
// @access  Private
router.post('/cod', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // For COD, the order is not marked paid at this point — payment is
    // collected on delivery. We just confirm the order for processing.
    order.paymentMethod = 'Cash on Delivery';
    order.status = 'Processing';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Cash on Delivery order confirmed',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('COD error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Order processing failed',
    });
  }
});

module.exports = router;
