import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

function ProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/profile');
        setForm((prev) => ({ ...prev, name: data.name, email: data.email }));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const { data } = await api.put('/users/profile', payload);

      // Keep the admin identity shown across the app (sidebar/header) in sync
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      localStorage.setItem('adminInfo', JSON.stringify({ ...adminInfo, name: data.name, email: data.email }));
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }

      toast.success('Profile updated successfully');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">{error}</div>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        {form.password && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
