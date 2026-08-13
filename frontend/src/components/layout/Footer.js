import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO: replace the "#" hrefs below with the store's real social media URLs.
const Footer = () => {
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setSubscribeEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">RM STORE</h3>
            <p className="text-gray-400 mb-4">
              Premium quality food products sourced from trusted suppliers around the world.
              We bring exceptional flavor to your table with our curated selection of gourmet products.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaPinterest size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/category/olive-oils"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Olive Oils
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/spices"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Spices
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/gourmet-pastas"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Gourmet Pastas
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/organic-grains"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Organic Grains
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/specialty-teas"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Specialty Teas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic space-y-2">
              <p>1234 Gourmet Avenue</p>
              <p>Foodie City, FC 98765</p>
              <p>United States</p>
              <p className="mt-4">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Email:</strong> info@rmstore.com
              </p>
            </address>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-4 mb-4">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Get the latest recipes, promotions, and culinary tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
          <p>© {new Date().getFullYear()} RM STORE. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gray-300">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="hover:text-gray-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 