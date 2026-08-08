const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
  getRecipesByProduct,
} = require('../controllers/recipeController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/product/:productId', getRecipesByProduct);
router.get('/:id', getRecipeById);

// Admin routes
router.post('/', protect, admin, addRecipe);
router.put('/:id', protect, admin, updateRecipe);
router.delete('/:id', protect, admin, deleteRecipe);

module.exports = router;
