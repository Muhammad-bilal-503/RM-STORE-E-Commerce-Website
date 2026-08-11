import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaUser, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../../services/api';

function ProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/profile');
        setProfile(data);
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
      setProfile(data);

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

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-white text-blue-700 flex items-center justify-center text-2xl font-bold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                <FaShieldAlt size={12} /> Administrator
              </span>
            </div>
            <p className="text-blue-100">{profile?.email}</p>
            <p className="text-blue-100 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1">
              <FaCalendarAlt size={12} /> Admin since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-gray-400" /> Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
