import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FaFilter, FaEye, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-2">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-3 border border-gray-100 rounded-lg p-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.variant?.size ? `${item.variant.size} · ` : ''}Qty: {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="text-sm text-gray-900">
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-gray-900">{formatCurrency(order.totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders', {
        params: { pageNumber: page, status: statusFilter },
      });
      setOrders(data.orders);
      setPages(data.pages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white"
          >
            <option value="All">Filter by Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 font-mono">{order._id.slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.isPaid ? (
                        <span className="text-green-700">Paid</span>
                      ) : (
                        <span className="text-red-600">Unpaid</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                        title="View order details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
    </div>
  );
}

export default OrdersPage;
