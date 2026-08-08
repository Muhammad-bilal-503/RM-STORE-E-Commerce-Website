const asyncHandler = require('express-async-handler');
const Recipe = require('../models/recipeModel');
const Product = require('../models/productModel');

// @desc    Fetch all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = asyncHandler(async (req, res) => {
  // Search filter
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // Category filter
  const category = req.query.category ? { category: req.query.category } : {};

  // Difficulty filter
  const difficulty = req.query.difficulty ? { difficulty: req.query.difficulty } : {};

  // Max cooking time filter
  const cookingTimeFilter = {};
  if (req.query.maxTime) {
    cookingTimeFilter.cookingTime = { $lte: Number(req.query.maxTime) };
  }

  // Combine all filters
  const filter = {
    ...keyword,
    ...category,
    ...difficulty,
    ...cookingTimeFilter,
  };

  // Fetch all recipes matching filter
  const recipes = await Recipe.find(filter)
    .populate('ingredients.product', 'name images')
    .sort({ createdAt: -1 });

  res.json(recipes);
});

// @desc    Fetch single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate('ingredients.product', 'name images variants');

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});


// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private/Admin
const addRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      image,
      preparationTime,
      cookingTime,
      servings,
      difficulty,
      category,
      tags,
      nutritionalInfo,
      isFeatured,
    } = req.body;

    // Basic validation (you can enhance this)
    if (
      !title ||
      !description ||
      !ingredients?.length ||
      !steps?.length ||
      !image ||
      !preparationTime ||
      !cookingTime ||
      !servings ||
      !difficulty ||
      !category
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      image,
      preparationTime,
      cookingTime,
      servings,
      difficulty,
      category,
      tags,
      nutritionalInfo,
      isFeatured,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Could not create recipe' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
const updateRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    ingredients,
    steps,
    image,
    preparationTime,
    cookingTime,
    servings,
    difficulty,
    category,
    tags,
    nutritionalInfo,
    isFeatured,
  } = req.body;

  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    // Validate product IDs in ingredients
    if (ingredients) {
      for (const ingredient of ingredients) {
        if (ingredient.product) {
          const product = await Product.findById(ingredient.product);
          if (!product) {
            res.status(400);
            throw new Error(`Product not found: ${ingredient.product}`);
          }
        }
      }
    }

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.steps = steps || recipe.steps;
    recipe.image = image || recipe.image;
    recipe.preparationTime = preparationTime || recipe.preparationTime;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.difficulty = difficulty || recipe.difficulty;
    recipe.category = category || recipe.category;
    recipe.tags = tags || recipe.tags;
    recipe.nutritionalInfo = nutritionalInfo || recipe.nutritionalInfo;
    recipe.isFeatured = isFeatured !== undefined ? isFeatured : recipe.isFeatured;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Get featured recipes
// @route   GET /api/recipes/featured
// @access  Public
const getFeaturedRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ isFeatured: true })
    .populate('author', 'name')
    .limit(4);
  
  res.json(recipes);
});

// @desc    Get recipes by product
// @route   GET /api/recipes/product/:productId
// @access  Public
const getRecipesByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Find recipes that include the specified product
  const recipes = await Recipe.find({
    'ingredients.product': productId,
  })
    .populate('author', 'name')
    .populate('ingredients.product', 'name images');
  
  if (recipes.length > 0) {
    res.json(recipes);
  } else {
    res.status(404);
    throw new Error('No recipes found with this product');
  }
});

// @desc    Get all distinct recipe categories currently in use
// @route   GET /api/recipes/categories
// @access  Public
const getRecipeCategories = asyncHandler(async (req, res) => {
  const categories = await Recipe.distinct('category');
  res.json(categories.filter(Boolean).sort());
});

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
  getRecipesByProduct,
  getRecipeCategories,
}; 