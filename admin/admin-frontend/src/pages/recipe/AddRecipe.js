"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./AddRecipe.css"
import api from "../../services/api"

function AddRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: "" }],
    steps: [""],
    image: "",
    preparationTime: 0,
    cookingTime: 0,
    servings: 1,
    difficulty: "Easy",
    category: "",
    tags: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    },
    isFeatured: false,
  })

  const [newTag, setNewTag] = useState("")
  const [newStep, setNewStep] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [categories, setCategories] = useState([])
  const [loadingRecipe, setLoadingRecipe] = useState(isEditMode)

  useEffect(() => {
    api
      .get("/recipes/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!isEditMode) return

    api
      .get(`/recipes/${id}`)
      .then(({ data }) => {
        setRecipeData({
          title: data.title || "",
          description: data.description || "",
          ingredients: data.ingredients?.length ? data.ingredients : [{ name: "", quantity: "" }],
          steps: data.steps?.length ? data.steps : [""],
          image: data.image || "",
          preparationTime: data.preparationTime || 0,
          cookingTime: data.cookingTime || 0,
          servings: data.servings || 1,
          difficulty: data.difficulty || "Easy",
          category: data.category || "",
          tags: data.tags || [],
          nutritionalInfo: {
            calories: data.nutritionalInfo?.calories || 0,
            protein: data.nutritionalInfo?.protein || 0,
            carbohydrates: data.nutritionalInfo?.carbohydrates || 0,
            fat: data.nutritionalInfo?.fat || 0,
          },
          isFeatured: data.isFeatured || false,
        })
      })
      .catch(() => setErrorMessage("Failed to load recipe for editing."))
      .finally(() => setLoadingRecipe(false))
  }, [id, isEditMode])

  const difficultyLevels = ["Easy", "Medium", "Hard"]

  // Handle basic input changes
  const handleInputChange = (field, value) => {
    setRecipeData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle nutritional info changes
  const handleNutritionalChange = (field, value) => {
    setRecipeData((prev) => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [field]: value,
      },
    }))
  }

  // Set the recipe image directly from a pasted URL
  const handleImageChange = (value) => {
    setRecipeData((prev) => ({ ...prev, image: value }))
  }

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipeData.ingredients]
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    }
    setRecipeData((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }))
  }

  // Add new ingredient
  const addIngredient = () => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }))
  }

  // Remove ingredient
  const removeIngredient = (index) => {
    if (recipeData.ingredients.length > 1) {
      const updatedIngredients = recipeData.ingredients.filter((_, i) => i !== index)
      setRecipeData((prev) => ({
        ...prev,
        ingredients: updatedIngredients,
      }))
    }
  }

  // Handle step changes
  const handleStepChange = (index, value) => {
    const updatedSteps = [...recipeData.steps]
    updatedSteps[index] = value
    setRecipeData((prev) => ({
      ...prev,
      steps: updatedSteps,
    }))
  }

  // Add new step
  const addStep = () => {
    if (newStep.trim()) {
      setRecipeData((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep.trim()],
      }))
      setNewStep("")
    }
  }

  // Remove step
  const removeStep = (index) => {
    const updatedSteps = recipeData.steps.filter((_, i) => i !== index)
    setRecipeData((prev) => ({
      ...prev,
      steps: updatedSteps,
    }))
  }

  // Add new tag
  const addTag = () => {
    if (newTag.trim() && !recipeData.tags.includes(newTag.trim().toLowerCase())) {
      setRecipeData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }))
      setNewTag("")
    }
  }

  // Remove tag
  const removeTag = (tag) => {
    const updatedTags = recipeData.tags.filter((t) => t !== tag)
    setRecipeData((prev) => ({
      ...prev,
      tags: updatedTags,
    }))
  }

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!recipeData.image) {
    setErrorMessage("Please provide a recipe image URL before submitting.");
    return;
  }

  try {
    if (isEditMode) {
      await api.put(`/recipes/${id}`, recipeData);
      setSuccessMessage("Recipe updated successfully!");
      setErrorMessage("");
      setTimeout(() => navigate("/recipes"), 1000);
      return;
    }

    await api.post('/recipes', recipeData);
    setSuccessMessage("Recipe added successfully!");
    setErrorMessage("");
  } catch (error) {
    console.error(`Error ${isEditMode ? "updating" : "adding"} recipe:`, error);
    setErrorMessage(error.response?.data?.message || `An error occurred while ${isEditMode ? "updating" : "adding"} the recipe.`);
    setSuccessMessage("");
  }
};

  if (loadingRecipe) {
    return <div className="add-recipe-container"><p>Loading recipe...</p></div>
  }

  return (
    <div className="add-recipe-container">
      <div className="add-recipe-header">
        <h1>{isEditMode ? "Edit Recipe" : "Add New Recipe"}</h1>
        <p>{isEditMode ? "Update this recipe's details" : "Share your culinary creation with the world"}</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="add-recipe-form">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2>Basic Information</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input
                id="title"
                value={recipeData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Banana Oat Pancakes"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={recipeData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your recipe..."
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  id="category"
                  list="recipe-category-options"
                  value={recipeData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="Pick an existing category or type a new one"
                  required
                />
                <datalist id="recipe-category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  value={recipeData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preparationTime">Preparation Time (minutes)</label>
                <input
                  id="preparationTime"
                  type="number"
                  min="0"
                  value={recipeData.preparationTime}
                  onChange={(e) => handleInputChange("preparationTime", Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input
                  id="cookingTime"
                  type="number"
                  min="0"
                  value={recipeData.cookingTime}
                  onChange={(e) => handleInputChange("cookingTime", Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="servings">Servings</label>
                <input
                  id="servings"
                  type="number"
                  min="1"
                  value={recipeData.servings}
                  onChange={(e) => handleInputChange("servings", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Image */}
        <div className="card">
          <div className="card-header">
            <h2>Recipe Image</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL *</label>
              <input
                id="imageUrl"
                value={recipeData.image}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            {recipeData.image && (
              <div className="image-preview">
                <img src={recipeData.image} alt="Recipe preview" />
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="card">
          <div className="card-header">
            <h2>Ingredients</h2>
          </div>
          <div className="card-content">
            <div className="ingredients-header">
              <p>Add all ingredients needed for your recipe</p>
              <button type="button" onClick={addIngredient} className="btn-add">
                Add Ingredient
              </button>
            </div>

            {recipeData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <div className="ingredient-row">
                  <div className="form-group">
                    <label>Ingredient Name</label>
                    <input
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      placeholder="e.g., Banana"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                      placeholder="e.g., 2 ripe"
                      required
                    />
                  </div>
                  {recipeData.ingredients.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeIngredient(index)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Steps */}
        <div className="card">
          <div className="card-header">
            <h2>Cooking Steps</h2>
          </div>
          <div className="card-content">
            <div className="steps-input">
              <div className="form-group">
                <label>Add Step</label>
                <div className="step-input-group">
                  <input
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Describe the cooking step..."
                  />
                  <button type="button" onClick={addStep} className="btn-add">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {recipeData.steps.length > 0 && (
              <div className="steps-list">
                <h3>Steps:</h3>
                <ol>
                  {recipeData.steps.map((step, index) => (
                    <li key={index}>
                      <div className="step-item">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleStepChange(index, e.target.value)}
                          className="step-input"
                        />
                        <button type="button" className="btn-remove" onClick={() => removeStep(index)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <div className="card-header">
            <h2>Tags</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Add Tag</label>
              <div className="tag-input-group">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g., healthy" />
                <button type="button" onClick={addTag} className="btn-add">
                  Add
                </button>
              </div>
            </div>

            {recipeData.tags.length > 0 && (
              <div className="tags-container">
                {recipeData.tags.map((tag) => (
                  <div key={tag} className="tag">
                    <span>{tag}</span>
                    <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="card">
          <div className="card-header">
            <h2>Nutritional Information (per serving)</h2>
          </div>
          <div className="card-content">
            <div className="nutrition-grid">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  id="calories"
                  type="number"
                  min="0"
                  value={recipeData.nutritionalInfo.calories}
                  onChange={(e) => handleNutritionalChange("calories", Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  id="protein"
                  type="number"
                  min="0"
                  value={recipeData.nutritionalInfo.protein}
                  onChange={(e) => handleNutritionalChange("protein", Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="carbohydrates">Carbohydrates (g)</label>
                <input
                  id="carbohydrates"
                  type="number"
                  min="0"
                  value={recipeData.nutritionalInfo.carbohydrates}
                  onChange={(e) => handleNutritionalChange("carbohydrates", Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fat">Fat (g)</label>
                <input
                  id="fat"
                  type="number"
                  min="0"
                  value={recipeData.nutritionalInfo.fat}
                  onChange={(e) => handleNutritionalChange("fat", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="card">
          <div className="card-header">
            <h2>Recipe Settings</h2>
          </div>
          <div className="card-content">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isFeatured"
                checked={recipeData.isFeatured}
                onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
              />
              <label htmlFor="isFeatured">Feature this recipe</label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/recipes")}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {isEditMode ? "Update Recipe" : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRecipe
