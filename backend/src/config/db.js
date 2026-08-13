const mongoose = require('mongoose');

/**
 * Connects to MongoDB (Atlas in production, local/Atlas in development)
 * using the connection string supplied via MONGO_URI.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // fail fast with a clear error instead of hanging
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
