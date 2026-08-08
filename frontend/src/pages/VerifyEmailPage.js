import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/verify/${token}`);
        setVerificationStatus('success');
        setMessage(data.message);
        toast.success('Email verified successfully!');
      } catch (error) {
        setVerificationStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Email verification failed. The link may be expired or invalid.'
        );
        toast.error('Email verification failed.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
        
        {verificationStatus === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <p className="text-green-600 font-medium mb-4">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </Link>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <p className="text-red-600 font-medium mb-4">{message}</p>
            <div className="space-y-2">
              <Link
                to="/register"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
              >
                Register Again
              </Link>
              <Link
                to="/login"
                className="inline-block bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;