import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/ui/Message';
import axiosInstance from '../utils/axios';

const RecipesPage = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/recipes');
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get('/recipes/categories');
        setCategories(['all', ...data]);
      } catch (err) {
        setCategories(['all']);
      }
    };

    fetchRecipes();
    fetchCategories();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesKeyword = recipe.title
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const matchesCategory =
      category === 'all' || recipe.category.toLowerCase() === category.toLowerCase();
    return matchesKeyword && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recipes</h1>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filteredRecipes.length === 0 ? (
        <Message variant="info">No recipes found</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/recipe/${recipe._id}`}>
                <div className="relative pb-[60%]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 mb-2"
                >
                  {recipe.title}
                </Link>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Prep: {recipe.preparationTime} mins</span>
                  <span>Cook: {recipe.cookingTime} mins</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {recipe.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
