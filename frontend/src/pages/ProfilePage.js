import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { updateUserProfile, resetUpdateSuccess, fetchUserProfile } from '../slices/userSlice';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string().when('password', {
    is: (password) => password && password.length > 0,
    then: () => Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm password'),
    otherwise: () => Yup.string()
  }),
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

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

  const submitHandler = (values) => {
    const updateData = {
      name: values.name,
      email: values.email,
    };

    if (values.password) {
      updateData.password = values.password;
    }

    dispatch(updateUserProfile(updateData));
  };

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to access your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
        
        <Formik
          initialValues={{
            name: userInfo.name || '',
            email: userInfo.email || '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={profileSchema}
          onSubmit={submitHandler}
          enableReinitialize
        >
          {({ errors, touched, values }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  New Password (leave blank to keep current)
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                )}
              </div>

              {values.password && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;