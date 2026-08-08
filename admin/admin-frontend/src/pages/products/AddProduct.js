"use client"

import { useState } from "react"
import "./AddProduct.css"
import api from "../../services/api"

function AddProduct() {
  const [productData, setProductData] = useState({
    name: "",
    image: "",
    images: [],
    brand: "",
    category: "",
    description: "",
    rating: 0,
    numReviews: 0,
    variants: [{ name: "", size: "", price: 0, countInStock: 0 }],
    isOrganic: false,
    isFeatured: false,
    discount: 0,
    weight: "",
    ingredients: "",
    nutritionFacts: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    },
    price: "",
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)

  const categories = [
    "flours", "grains", "spices", "oils", "dairy", "vegetables",
    "fruits", "meat", "seafood", "beverages", "snacks", "bakery"
  ]

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNutritionChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      nutritionFacts: { ...prev.nutritionFacts, [field]: value }
    }))
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...productData.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setProductData((prev) => ({ ...prev, variants: updatedVariants }))
  }

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", size: "", price: 0, countInStock: 0 }]
    }))
  }

  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      const updatedVariants = productData.variants.filter((_, i) => i !== index)
      setProductData((prev) => ({ ...prev, variants: updatedVariants }))
    }
  }

  const uploadImageFile = async (file) => {
    const formData = new FormData()
    formData.append("image", file)
    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.imageUrl
  }

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingMain(true)
    setErrorMessage("")
    try {
      const imageUrl = await uploadImageFile(file)
      handleInputChange("image", imageUrl)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Image upload failed.")
    } finally {
      setUploadingMain(false)
    }
  }

  const handleAdditionalImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingExtra(true)
    setErrorMessage("")
    try {
      const imageUrl = await uploadImageFile(file)
      setProductData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }))
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Image upload failed.")
    } finally {
      setUploadingExtra(false)
      e.target.value = ""
    }
  }

  const removeImage = (index) => {
    const updatedImages = productData.images.filter((_, i) => i !== index)
    setProductData((prev) => ({ ...prev, images: updatedImages }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!productData.image) {
      setErrorMessage("Please upload a main image before submitting.")
      return
    }

    try {
      await api.post("/products", productData)

      setSuccessMessage("Product added successfully!")
      setErrorMessage("")

      // Optionally reset form
      setProductData({
        name: "",
        image: "",
        images: [],
        brand: "",
        category: "",
        description: "",
        rating: 0,
        numReviews: 0,
        variants: [{ name: "", size: "", price: 0, countInStock: 0 }],
        isOrganic: false,
        isFeatured: false,
        discount: 0,
        weight: "",
        ingredients: "",
        nutritionFacts: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
        },
        price: "",
      })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add product.")
      setSuccessMessage("")
    }
  }

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p>Fill in the details to add a new product to your store</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

       <form onSubmit={handleSubmit} className="add-product-form">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2>Basic Information</h2>
          </div>
          <div className="card-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  id="name"
                  value={productData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Organic Whole Wheat Flour"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand *</label>
                <input
                  id="brand"
                  value={productData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="e.g., RM STORE"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={productData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  value={productData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="e.g., 1kg"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your product..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ingredients">Ingredients</label>
              <textarea
                id="ingredients"
                value={productData.ingredients}
                onChange={(e) => handleInputChange("ingredients", e.target.value)}
                placeholder="List all ingredients..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <div className="card-header">
            <h2>Product Images</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="mainImage">Main Image *</label>
              <input
                id="mainImage"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleMainImageUpload}
                disabled={uploadingMain}
              />
              {uploadingMain && <p>Uploading…</p>}
              {productData.image && (
                <img src={productData.image} alt="Main preview" className="image-preview" />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="additionalImages">Additional Images</label>
              <input
                id="additionalImages"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleAdditionalImageUpload}
                disabled={uploadingExtra}
              />
              {uploadingExtra && <p>Uploading…</p>}
              {productData.images.length > 0 && (
                <div className="image-list">
                  {productData.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image} alt={`Preview ${index + 1}`} className="image-preview" />
                      <button type="button" className="btn-remove" onClick={() => removeImage(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card">
          <div className="card-header">
            <h2>Pricing & Stock</h2>
          </div>
          <div className="card-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Base Price</label>
                <input
                  id="price"
                  value={productData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="450"
                />
              </div>
              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  id="discount"
                  type="number"
                  value={productData.discount}
                  onChange={(e) => handleInputChange("discount", Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <hr className="divider" />

            <div className="variants-section">
              <div className="variants-header">
                <label>Product Variants</label>
                <button type="button" onClick={addVariant} className="btn-add">
                  Add Variant
                </button>
              </div>

              {productData.variants.map((variant, index) => (
                <div key={index} className="variant-card">
                  <div className="variant-header">
                    <h4>Variant {index + 1}</h4>
                    {productData.variants.length > 1 && (
                      <button type="button" className="btn-remove" onClick={() => removeVariant(index)}>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="variant-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                        placeholder="Regular"
                      />
                    </div>
                    <div className="form-group">
                      <label>Size</label>
                      <input
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        placeholder="1kg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", Number(e.target.value))}
                        placeholder="3.99"
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={variant.countInStock}
                        onChange={(e) => handleVariantChange(index, "countInStock", Number(e.target.value))}
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="card">
          <div className="card-header">
            <h2>Nutrition Facts (per 100g)</h2>
          </div>
          <div className="card-content">
            <div className="nutrition-grid">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  id="calories"
                  type="number"
                  value={productData.nutritionFacts.calories}
                  onChange={(e) => handleNutritionChange("calories", Number(e.target.value))}
                  placeholder="340"
                />
              </div>
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  id="protein"
                  type="number"
                  value={productData.nutritionFacts.protein}
                  onChange={(e) => handleNutritionChange("protein", Number(e.target.value))}
                  placeholder="13"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carbohydrates">Carbs (g)</label>
                <input
                  id="carbohydrates"
                  type="number"
                  value={productData.nutritionFacts.carbohydrates}
                  onChange={(e) => handleNutritionChange("carbohydrates", Number(e.target.value))}
                  placeholder="72"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fat">Fat (g)</label>
                <input
                  id="fat"
                  type="number"
                  value={productData.nutritionFacts.fat}
                  onChange={(e) => handleNutritionChange("fat", Number(e.target.value))}
                  placeholder="2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Flags */}
        <div className="card">
          <div className="card-header">
            <h2>Product Settings</h2>
          </div>
          <div className="card-content">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isOrganic"
                checked={productData.isOrganic}
                onChange={(e) => handleInputChange("isOrganic", e.target.checked)}
              />
              <label htmlFor="isOrganic">Organic Product</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isFeatured"
                checked={productData.isFeatured}
                onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
              />
              <label htmlFor="isFeatured">Featured Product</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={productData.rating}
                  onChange={(e) => handleInputChange("rating", Number(e.target.value))}
                  placeholder="4.5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numReviews">Number of Reviews</label>
                <input
                  id="numReviews"
                  type="number"
                  value={productData.numReviews}
                  onChange={(e) => handleInputChange("numReviews", Number(e.target.value))}
                  placeholder="12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="button" className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
