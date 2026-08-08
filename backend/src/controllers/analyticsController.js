const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// All analytics here are computed live from the real Order/Product/User
// collections on every request — there is no cached/pre-aggregated snapshot
// to go stale, so placing an order, adding a product, or a new signup is
// reflected immediately on the next request.

// @desc    Real-time dashboard summary (stat cards, recent orders, top products)
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalCustomers, revenueAgg, totalOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ isAdmin: { $ne: true } }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments(),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          sales: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders: recentOrders.map((order) => ({
        _id: order._id,
        customer: order.user?.name || 'Unknown',
        amount: order.totalPrice,
        status: order.status,
        date: order.createdAt,
      })),
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sales report over a date range, grouped by day
// @route   GET /api/analytics/sales?startDate=&endDate=
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { isPaid: true };
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const daily = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const summary = daily.reduce(
      (acc, day) => {
        acc.totalSales += day.totalSales;
        acc.totalOrders += day.totalOrders;
        return acc;
      },
      { totalSales: 0, totalOrders: 0 }
    );
    summary.averageOrderValue = summary.totalOrders > 0 ? summary.totalSales / summary.totalOrders : 0;

    res.json({ summary, details: daily });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Product performance report (units sold / revenue per product)
// @route   GET /api/analytics/products
// @access  Private/Admin
exports.getProductReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const productPerformance = await Order.aggregate([
      { $match: match },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          totalQuantity: { $sum: '$orderItems.qty' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({ productPerformance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer report (new vs returning, based on real orders/signups)
// @route   GET /api/analytics/customers
// @access  Private/Admin
exports.getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateMatch = {};
    if (startDate && endDate) {
      dateMatch.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const newCustomers = await User.countDocuments({
      isAdmin: { $ne: true },
      ...dateMatch,
    });

    // A "returning" customer is one with more than one order
    const returningAgg = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: 'returningCustomers' },
    ]);

    res.json({
      customerMetrics: {
        newCustomers,
        returningCustomers: returningAgg[0]?.returningCustomers || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Category performance (sales/orders per product category, from real orders)
// @route   GET /api/analytics/categories
// @access  Private/Admin
exports.getCategoryPerformance = async (req, res) => {
  try {
    const categoryPerformance = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          sales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { sales: -1 } },
    ]);

    res.json({
      categoryPerformance: categoryPerformance.map((c) => ({
        category: c._id,
        sales: c.sales,
        orders: c.orders,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
