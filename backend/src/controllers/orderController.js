const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Check if order belongs to user or user is admin
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
      payment_intent_id: req.body.payment_intent_id,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';
    
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { status, trackingNumber, notes } = req.body;

    if (status) {
      order.status = status;
      
      // Update delivery status if needed
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === 'Shipped' && trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
    }

    if (notes) {
      order.notes = notes;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Add pagination support
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // Prepare filter options
  const filterOptions = {};
  
  // Filter by status if provided
  if (req.query.status && req.query.status !== 'All') {
    filterOptions.status = req.query.status;
  }
  
  // Filter by payment status if provided
  if (req.query.isPaid) {
    filterOptions.isPaid = req.query.isPaid === 'true';
  }
  
  // Filter by delivery status if provided
  if (req.query.isDelivered) {
    filterOptions.isDelivered = req.query.isDelivered === 'true';
  }
  
  // Count total orders matching the filter
  const count = await Order.countDocuments(filterOptions);
  
  // Get orders for current page with user info
  const orders = await Order.find(filterOptions)
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if user is authorized to cancel (either the owner or admin)
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Can only cancel if not delivered yet
  if (order.isDelivered) {
    res.status(400);
    throw new Error('Cannot cancel a delivered order');
  }

  // Update order status
  order.status = 'Cancelled';
  
  // Restore stock for cancelled items
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    
    if (product) {
      const variant = product.variants.find(v => v.size === item.size);
      
      if (variant) {
        variant.countInStock += item.qty;
      }
      
      await product.save();
    }
  }

  const updatedOrder = await order.save();

  // Send cancellation email — failure here should not fail the cancellation
  // itself, since the order has already been updated and saved.
  try {
    await sendEmail({
      to: req.user.email,
      subject: 'RM STORE - Order Cancellation Confirmation',
      html: `
        <h2>Your Order Has Been Cancelled</h2>
        <p>Order ID: ${order._id}</p>
        <p>We have processed your cancellation request. If you paid for this order, a refund will be issued according to our refund policy.</p>
        <p>If you have any questions, please contact our customer support.</p>
      `,
    });
  } catch (emailError) {
    console.error('Failed to send cancellation email:', emailError.message);
  }

  res.json(updatedOrder);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
}; 