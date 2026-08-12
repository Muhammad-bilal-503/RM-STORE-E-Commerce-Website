import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTag } from 'react-icons/fa';
import api from '../../services/api';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/categories/stats');
      setCategories(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startRename = (category) => {
    setEditingCategory(category);
    setNewName(category.name);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim() === editingCategory.name) {
      setEditingCategory(null);
      return;
    }

    setSaving(true);
    try {
      await api.put('/products/categories/rename', {
        oldName: editingCategory.name,
        newName: newName.trim(),
      });
      toast.success(`Renamed "${editingCategory.name}" to "${newName.trim()}"`);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rename category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">
          Categories are derived automatically from your products — add a new category by using it on a
          product, and it disappears once no products use it anymore.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No categories yet. Add a product to create one.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                {editingCategory?.name === cat.name ? (
                  <form onSubmit={handleRename} className="flex items-center gap-2 flex-1">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex-1 max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="text-sm text-gray-500 px-3 py-1.5 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FaTag size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startRename(cat)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Rename category"
                    >
                      <FaEdit />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
