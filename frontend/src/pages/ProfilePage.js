import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FaUser,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaHeart,
  FaCheckCircle,
  FaCalendarAlt,
} from 'react-icons/fa';
import { updateUserProfile, resetUpdateSuccess, fetchUserProfile } from '../slices/userSlice';
import axiosInstance from '../utils/axios';
import { formatCurrency } from '../utils/formatCurrency';
import OrderStatusBadge from '../components/ui/OrderStatusBadge';
import Loader from '../components/ui/Loader';

const personalInfoSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string().when('password', {
    is: (password) => password && password.length > 0,
    then: () =>
      Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm password'),
    otherwise: () => Yup.string(),
  }),
});

const addressSchema = Yup.object().shape({
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  postalCode: Yup.string(),
  country: Yup.string(),
});

const TABS = [
  { key: 'personal', label: 'Personal Info', icon: FaUser },
  { key: 'address', label: 'Address', icon: FaMapMarkerAlt },
  { key: 'orders', label: 'Recent Orders', icon: FaBoxOpen },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('personal');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success) {
      toast.success('Profile updated successfully!');
      dispatch(resetUpdateSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (activeTab !== 'orders' || orders.length > 0) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await axiosInstance.get('/orders/myorders');
        setOrders(data);
        setOrdersError('');
      } catch (err) {
        setOrdersError(
          err.response && err.response.data.message ? err.response.data.message : err.message
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to access your profile</h2>
        </div>
      </div>
    );
  }

  const submitPersonalInfo = (values) => {
    const updateData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
    };
    if (values.password) {
      updateData.password = values.password;
    }
    dispatch(updateUserProfile(updateData));
  };

  const submitAddress = (values) => {
    dispatch(updateUserProfile({ address: values }));
  };

  const initials = userInfo.name
    ? userInfo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const memberSince = userInfo.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Overview */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 mb-6 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white text-green-700 flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold">{userInfo.name}</h1>
              {userInfo.isVerified && (
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                  <FaCheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            <p className="text-green-100">{userInfo.email}</p>
            {userInfo.phone && <p className="text-green-100">{userInfo.phone}</p>}
            <p className="text-green-100 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1">
              <FaCalendarAlt size={12} /> Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <FaHeart />
          </div>
          <div>
            <p className="text-sm text-gray-500">Wishlist</p>
            <p className="text-xl font-bold text-gray-900">{userInfo.wishlistCount ?? 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <FaBoxOpen />
          </div>
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-xl font-bold text-gray-900">{orders.length || (ordersLoading ? '…' : 0)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-xl font-bold text-gray-900">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs (sidebar on desktop, top on mobile) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
            <Link
              to="/wishlist"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FaHeart size={14} />
              My Wishlist
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'personal' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
                <Formik
                  initialValues={{
                    name: userInfo.name || '',
                    email: userInfo.email || '',
                    phone: userInfo.phone || '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={personalInfoSchema}
                  onSubmit={submitPersonalInfo}
                  enableReinitialize
                >
                  {({ errors, touched, values }) => (
                    <Form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                            Name
                          </label>
                          <Field
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {errors.name && touched.name && (
                            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                            Phone
                          </label>
                          <Field
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="+92 3XX XXXXXXX"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                          Email Address
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                            New Password
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Leave blank to keep current"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {errors.password && touched.password && (
                            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                          )}
                        </div>
                        {values.password && (
                          <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                              Confirm New Password
                            </label>
                            <Field
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            )}

            {activeTab === 'address' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                <Formik
                  initialValues={{
                    street: userInfo.address?.street || '',
                    city: userInfo.address?.city || '',
                    state: userInfo.address?.state || '',
                    postalCode: userInfo.address?.postalCode || '',
                    country: userInfo.address?.country || '',
                  }}
                  validationSchema={addressSchema}
                  onSubmit={submitAddress}
                  enableReinitialize
                >
                  {() => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="street" className="block text-gray-700 text-sm font-medium mb-1">
                          Street Address
                        </label>
                        <Field
                          type="text"
                          id="street"
                          name="street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">
                            City
                          </label>
                          <Field
                            type="text"
                            id="city"
                            name="city"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-1">
                            State / Province
                          </label>
                          <Field
                            type="text"
                            id="state"
                            name="state"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-1">
                            Postal Code
                          </label>
                          <Field
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-gray-700 text-sm font-medium mb-1">
                            Country
                          </label>
                          <Field
                            type="text"
                            id="country"
                            name="country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Address'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                {ordersLoading ? (
                  <Loader />
                ) : ordersError ? (
                  <p className="text-red-600">{ordersError}</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBoxOpen className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Link
                      to="/products"
                      className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Link
                        to={`/order/${order._id}`}
                        key={order._id}
                        className="flex flex-wrap items-center justify-between gap-3 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-mono text-sm text-gray-500">#{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</p>
                        <OrderStatusBadge status={order.status} />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
