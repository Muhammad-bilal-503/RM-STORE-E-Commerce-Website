// controllers/productController.js
const Product = require('../models/productModel');

// Fetch all products with filtering (no pagination)
exports.getProducts = async (req, res) => {
  try {
    // Pagination variables removed

    // Filters (same as before)
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) {
      priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
    }

    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    const filter = {
      ...keyword,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    };

    // Count all filtered products (optional, can skip if not needed)
    const count = await Product.countDocuments(filter);

    // Find all filtered products without limit or skip
    const products = await Product.find(filter)
      .sort(req.query.sortBy ? { [req.query.sortBy]: req.query.order || -1 } : { createdAt: -1 });

    // Return products only (no pagination info)
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/// Create a product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      images,
      brand,
      category,
      description,
      rating,
      numReviews,
      variants,
      isOrganic,
      isFeatured,
      discount,
      weight,
      ingredients,
      nutritionFacts,
      price
    } = req.body;

    // Validate required fields
    if (!name || !brand || !category || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new product with data from the form
    const product = new Product({
      name,
      price: price || (variants && variants.length > 0 ? variants[0].price : 0),
      user: req.user._id,
      image: image || '/uploads/sample.jpg',
      images: images || [],
      brand,
      category,
      description,
      rating: rating || 0,
      numReviews: numReviews || 0,
      variants: variants || [],
      isOrganic: isOrganic || false,
      isFeatured: isFeatured || false,
      discount: discount || 0,
      weight: weight || '',
      ingredients: ingredients || '',
      nutritionFacts: nutritionFacts || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
      },
      reviews: []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};
// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top rated products
exports.getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true }).limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ message: 'No products found in this category' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const relatedProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: product.category,
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
