import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaHeart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../slices/userSlice';
import { clearCartItems } from '../../slices/cartSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCartItems());
    navigate('/login');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm}`);
      setSearchTerm('');
    }
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">RM STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Shop
            </Link>
            <Link
              to="/recipes"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Recipes
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 transition duration-300"
            >
              <FaSearch />
            </button>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-green-600 transition duration-300"
            >
              <FaHeart size={20} />
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-green-600 transition duration-300 relative"
            >
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {userInfo ? (
              <div className="relative group">
                <button className="text-gray-700 hover:text-green-600 transition duration-300">
                  <FaUser size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 transition duration-300"
              >
                <FaUser size={20} />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-green-600 transition duration-300"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 transition duration-300"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 font-medium py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-green-600 font-medium py-2"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link
                to="/recipes"
                className="text-gray-700 hover:text-green-600 font-medium py-2"
                onClick={toggleMenu}
              >
                Recipes
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-600 font-medium py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-green-600 font-medium py-2"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-green-600 font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-green-600 font-medium py-2"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logoutHandler();
                      toggleMenu();
                    }}
                    className="text-left text-gray-700 hover:text-green-600 font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 