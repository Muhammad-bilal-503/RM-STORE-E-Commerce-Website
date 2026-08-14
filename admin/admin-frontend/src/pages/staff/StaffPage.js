import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus, FaUserShield, FaBan, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import { ROLE_LABELS, STAFF_ROLES } from '../../config/permissions';

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  suspended: 'bg-red-100 text-red-800',
};

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'product_manager' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/staff');
      setStaff(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/staff', form);
      toast.success(`${form.name} added as ${ROLE_LABELS[form.role]}`);
      setShowCreateModal(false);
      setForm({ name: '', email: '', password: '', role: 'product_manager' });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create staff account');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (staffMember, newRole) => {
    setUpdatingId(staffMember._id);
    try {
      await api.put(`/staff/${staffMember._id}`, { role: newRole });
      toast.success(`${staffMember.name}'s role updated to ${ROLE_LABELS[newRole]}`);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (staffMember, status) => {
    setUpdatingId(staffMember._id);
    try {
      await api.put(`/staff/${staffMember._id}`, { status });
      toast.success(`${staffMember.name} is now ${status}`);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivate = async (staffMember) => {
    if (!window.confirm(`Deactivate ${staffMember.name}? They'll lose admin access, but their account and history are preserved.`)) {
      return;
    }
    try {
      await api.delete(`/staff/${staffMember._id}`);
      toast.success(`${staffMember.name} deactivated`);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate staff account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create staff accounts and assign roles. Only Super Admins can manage staff.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <FaPlus size={12} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading staff...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : staff.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No staff accounts yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                      <FaUserShield className="text-blue-400" size={14} /> {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{member.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={member.role}
                        disabled={updatingId === member._id}
                        onChange={(e) => handleRoleChange(member, e.target.value)}
                        className="text-xs font-medium border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {STAFF_ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[member.status] || STATUS_STYLES.active}`}>
                        {member.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {member.status === 'active' ? (
                          <button
                            onClick={() => handleDeactivate(member)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Deactivate"
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(member, 'active')}
                            disabled={updatingId === member._id}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                            title="Reactivate"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Staff Member</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffPage;
