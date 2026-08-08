import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUtensils, FaUser } from 'react-icons/fa';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Recipe Image */}
      <Link to={`/recipe/${recipe._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover hover:transform hover:scale-105 transition-transform duration-300"
          />
          {recipe.isFeatured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded-md">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Recipe Info */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {recipe.category}
          </span>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {recipe.difficulty}
          </span>
        </div>
        
        {/* Title */}
        <Link to={`/recipe/${recipe._id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-green-700 transition-colors">
            {recipe.title}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        {/* Recipe Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span className="mr-3">
              {recipe.preparationTime + recipe.cookingTime} min
            </span>
            <FaUtensils className="mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>
              {recipe.author && recipe.author.name
                ? recipe.author.name
                : 'RM STORE Chef'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 