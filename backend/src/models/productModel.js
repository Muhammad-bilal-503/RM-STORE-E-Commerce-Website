const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const variantSchema = mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true, default: 0 },
});

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    variants: [variantSchema],
    isOrganic: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    nutritionFacts: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbohydrates: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 