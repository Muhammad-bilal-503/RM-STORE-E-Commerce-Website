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
  getRecipeCategories,
} = require('../controllers/recipeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/categories', getRecipeCategories);
router.get('/product/:productId', getRecipesByProduct);
router.get('/:id', getRecipeById);

// Admin routes
router.post('/', protect, authorize('recipes.create'), addRecipe);
router.put('/:id', protect, authorize('recipes.update'), updateRecipe);
router.delete('/:id', protect, authorize('recipes.delete'), deleteRecipe);

module.exports = router;
