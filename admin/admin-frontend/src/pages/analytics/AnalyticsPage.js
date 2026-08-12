import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [dashboardRes, categoriesRes, customersRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/categories'),
          api.get('/analytics/customers'),
        ]);
        setDashboard(dashboardRes.data);
        setCategories(categoriesRes.data.categoryPerformance);
        setCustomers(customersRes.data.customerMetrics);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">{error}</div>;
  }

  const maxCategorySales = Math.max(1, ...categories.map((c) => c.sales));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{dashboard.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">New Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers?.newCustomers ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Returning Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers?.returningCustomers ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No sales recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium text-gray-700">{cat.category}</span>
                  <span className="text-gray-500">{formatCurrency(cat.sales)} ({cat.orders} orders)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(cat.sales / maxCategorySales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
        {dashboard.topProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboard.topProducts.map((p) => (
                <tr key={p._id}>
                  <td className="px-2 py-2 text-sm text-gray-900">{p.name}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{p.sales}</td>
                  <td className="px-2 py-2 text-sm font-medium text-gray-900">{formatCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
