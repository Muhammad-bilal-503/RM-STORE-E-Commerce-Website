import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const LOW_STOCK_THRESHOLD = 10;

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | low | out

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Total stock for a product = sum of all its variants' countInStock
  const totalStock = (product) =>
    (product.variants || []).reduce((sum, v) => sum + (v.countInStock || 0), 0);

  const filteredProducts = products.filter((p) => {
    const stock = totalStock(p);
    if (filter === 'low') return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
    if (filter === 'out') return stock === 0;
    return true;
  });

  const lowStockCount = products.filter((p) => {
    const s = totalStock(p);
    return s > 0 && s <= LOW_STOCK_THRESHOLD;
  }).length;
  const outOfStockCount = products.filter((p) => totalStock(p) === 0).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`text-left bg-white rounded-lg shadow p-4 border-2 ${filter === 'all' ? 'border-blue-500' : 'border-transparent'}`}
        >
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`text-left bg-white rounded-lg shadow p-4 border-2 ${filter === 'low' ? 'border-yellow-500' : 'border-transparent'}`}
        >
          <p className="text-sm text-gray-500">Low Stock (&le;{LOW_STOCK_THRESHOLD})</p>
          <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`text-left bg-white rounded-lg shadow p-4 border-2 ${filter === 'out' ? 'border-red-500' : 'border-transparent'}`}
        >
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading inventory...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No products match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stock = totalStock(product);
                  return (
                    <tr key={product._id}>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 capitalize">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {(product.variants || []).map((v) => `${v.size}: ${v.countInStock}`).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{stock}</td>
                      <td className="px-4 py-3">
                        {stock === 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of stock</span>
                        ) : stock <= LOW_STOCK_THRESHOLD ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low stock</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In stock</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryPage;
