const Analytics = require('../models/analyticsModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Generate daily analytics
exports.generateDailyAnalytics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's orders
    const orders = await Order.find({
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('items.product');

    // Calculate metrics
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.product._id]) {
          productSales[item.product._id] = {
            productId: item.product._id,
            name: item.product.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.product._id].quantity += item.quantity;
        productSales[item.product._id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get customer metrics
    const newCustomers = await User.countDocuments({
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const returningCustomers = orders.length - newCustomers;

    // Get category performance
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        if (!categorySales[category]) {
          categorySales[category] = {
            category,
            sales: 0,
            orders: 0
          };
        }
        categorySales[category].sales += item.price * item.quantity;
        categorySales[category].orders += 1;
      });
    });

    const categoryPerformance = Object.values(categorySales);

    // Save analytics
    const analytics = new Analytics({
      type: 'sales',
      date: today,
      period: 'daily',
      metrics: {
        totalSales,
        totalOrders,
        averageOrderValue,
        topProducts,
        customerMetrics: {
          newCustomers,
          returningCustomers
        },
        categoryPerformance
      }
    });

    await analytics.save();
    return analytics;
  } catch (error) {
    console.error('Error generating daily analytics:', error);
    throw error;
  }
};

// Get analytics for a specific period
exports.getAnalytics = async (req, res) => {
  try {
    const { type, period, startDate, endDate } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (period) query.period = period;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(100);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      type: 'sales',
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const analytics = await Analytics.find(query)
      .sort({ date: 1 });

    // Calculate summary
    const summary = analytics.reduce((acc, curr) => {
      acc.totalSales += curr.metrics.totalSales;
      acc.totalOrders += curr.metrics.totalOrders;
      acc.averageOrderValue = acc.totalSales / acc.totalOrders;
      return acc;
    }, {
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0
    });

    res.json({
      summary,
      details: analytics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product performance report
exports.getProductReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      type: 'sales',
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const analytics = await Analytics.find(query)
      .sort({ date: 1 });

    // Aggregate product performance
    const productPerformance = {};
    analytics.forEach(record => {
      record.metrics.topProducts.forEach(product => {
        if (!productPerformance[product.productId]) {
          productPerformance[product.productId] = {
            name: product.name,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        productPerformance[product.productId].totalQuantity += product.quantity;
        productPerformance[product.productId].totalRevenue += product.revenue;
      });
    });

    res.json({
      productPerformance: Object.values(productPerformance)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer analytics report
exports.getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      type: 'sales',
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const analytics = await Analytics.find(query)
      .sort({ date: 1 });

    // Aggregate customer metrics
    const customerMetrics = analytics.reduce((acc, curr) => {
      acc.newCustomers += curr.metrics.customerMetrics.newCustomers;
      acc.returningCustomers += curr.metrics.customerMetrics.returningCustomers;
      return acc;
    }, {
      newCustomers: 0,
      returningCustomers: 0
    });

    res.json({
      customerMetrics,
      details: analytics.map(record => ({
        date: record.date,
        metrics: record.metrics.customerMetrics
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 