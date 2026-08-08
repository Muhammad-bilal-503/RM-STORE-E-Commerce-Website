import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        console.log(data);
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!recipe) return <Message variant="info">Recipe not found</Message>;

  const ingredients = recipe.ingredients || [];
  const instructions = recipe.steps || recipe.instructions || [];
  const reviews = recipe.reviews || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Recipes
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Recipe Header */}
        <div className="relative h-96">
          <img
            src={recipe.image}
            alt={recipe.title || recipe.name}
            className="w-45 h-full object-cover"
          />
          <div className="absolute inset-0  bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{recipe.title || recipe.name}</h1>
              <div className="flex items-center space-x-4">
                <Rating value={recipe.rating || 0} text={`${recipe.numReviews || 0} reviews`} />
                <span className="text-sm">•</span>
                <span>{recipe.category}</span>
                <span className="text-sm">•</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="p-4">
          <div className="grid w-50 grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-2 rounded-md">
              <h3 className="font-medium text-gray-600 text-sm mb-1">Prep Time</h3>
              <p className="text-base">{recipe.preparationTime || recipe.prepTime} mins</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <h3 className="font-medium text-gray-600 text-sm mb-1">Cook Time</h3>
              <p className="text-base">{recipe.cookingTime || recipe.cookTime} mins</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <h3 className="font-medium text-gray-600 text-sm mb-1">Servings</h3>
              <p className="text-base">{recipe.servings} people</p>
            </div>
          </div>
        


        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {ingredients.map((ing, index) => (
              <li key={index} className="text-gray-700">
                {ing.quantity} {ing.unit || ''} {ing.name || ing.product?.name || ''}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-4">
            {instructions.map((step, index) => (
              <li key={index} className="text-gray-700">
                {typeof step === 'string' ? step : step?.description || JSON.stringify(step)}
              </li>
            ))}
          </ol>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <Message variant="info">No reviews yet</Message>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
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
    </div >
  );
};

export default RecipePage;
