import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaUtensils, FaUsers, FaStar } from 'react-icons/fa';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import Rating from '../components/ui/Rating';
import axiosInstance from '../utils/axios';

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(data);
        setError('');
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!recipe) return <Message variant="info">Recipe not found</Message>;

  const ingredients = recipe.ingredients || [];
  const instructions = recipe.steps || [];
  const reviews = recipe.reviews || [];
  const tags = recipe.tags || [];
  const nutrition = recipe.nutritionalInfo;
  const hasNutritionData =
    nutrition &&
    [nutrition.calories, nutrition.protein, nutrition.carbohydrates, nutrition.fat].some(
      (v) => v !== undefined && v !== null
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-green-700 hover:text-green-800 flex items-center transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Recipes
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {/* Recipe Header */}
        <div className="relative h-96">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="p-6 text-white">
              {recipe.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold py-1 px-3 rounded-full mb-3">
                  <FaStar size={10} /> Featured
                </span>
              )}
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Rating value={recipe.rating || 0} text={`${recipe.numReviews || 0} reviews`} />
                <span className="text-sm">•</span>
                <span className="capitalize">{recipe.category}</span>
                <span className="text-sm">•</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <FaClock className="text-green-600" size={20} />
              <div>
                <h3 className="font-medium text-gray-500 text-xs uppercase">Prep Time</h3>
                <p className="text-base font-semibold">{recipe.preparationTime} mins</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <FaUtensils className="text-green-600" size={20} />
              <div>
                <h3 className="font-medium text-gray-500 text-xs uppercase">Cook Time</h3>
                <p className="text-base font-semibold">{recipe.cookingTime} mins</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <FaUsers className="text-green-600" size={20} />
              <div>
                <h3 className="font-medium text-gray-500 text-xs uppercase">Servings</h3>
                <p className="text-base font-semibold">{recipe.servings} people</p>
              </div>
            </div>
          </div>

          {recipe.description && (
            <p className="text-gray-600 mb-8">{recipe.description}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, index) => (
                <span key={index} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {/* Ingredients */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-700 flex justify-between border-b border-gray-100 pb-2">
                      <span>{ing.name}</span>
                      <span className="text-gray-500">{ing.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrition */}
              {hasNutritionData && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h2 className="text-lg font-bold mb-3">Nutrition (per serving)</h2>
                  <div className="space-y-2">
                    {nutrition.calories !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories</span>
                        <span className="font-semibold">{nutrition.calories}</span>
                      </div>
                    )}
                    {nutrition.protein !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protein</span>
                        <span className="font-semibold">{nutrition.protein}g</span>
                      </div>
                    )}
                    {nutrition.carbohydrates !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbohydrates</span>
                        <span className="font-semibold">{nutrition.carbohydrates}g</span>
                      </div>
                    )}
                    {nutrition.fat !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fat</span>
                        <span className="font-semibold">{nutrition.fat}g</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <Message variant="info">No reviews yet</Message>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{review.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
