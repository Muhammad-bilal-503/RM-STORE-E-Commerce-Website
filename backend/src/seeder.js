const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Create an admin user if it doesn't exist
    const adminUser = await User.findOne({ email: 'admin@rmstore.com' });
    if (!adminUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@rmstore.com',
        password: 'admin123',
        isAdmin: true,
        isVerified: true,
      });
      console.log('Admin user created');
    }

    // Get the admin user for product creation
    const user = await User.findOne({ email: 'admin@rmstore.com' });

    // Clear existing products
    await Product.deleteMany();
    console.log('Products cleared');

    // Add user reference to products and format images
    const productsWithUser = products.map((product) => ({
      ...product,
      user: user._id,
      image: product.images[0].url, // Set the first image as the main image
      images: product.images.map(img => img.url), // Convert image objects to strings
    }));

    // Insert products
    await Product.insertMany(productsWithUser);
    console.log('Products imported');

    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Products destroyed');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 