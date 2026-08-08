const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['sales', 'products', 'customers', 'orders']
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalSales: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    topProducts: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      quantity: Number,
      revenue: Number
    }],
    customerMetrics: {
      newCustomers: {
        type: Number,
        default: 0
      },
      returningCustomers: {
        type: Number,
        default: 0
      }
    },
    categoryPerformance: [{
      category: String,
      sales: Number,
      orders: Number
    }]
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
analyticsSchema.index({ type: 1, date: 1, period: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 