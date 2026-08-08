import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - RM STORE</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-md mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full font-medium shadow-md transition duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage; 