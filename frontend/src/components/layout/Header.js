import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaHeart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../slices/userSlice';
import { clearCartItems } from '../../slices/cartSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the profile dropdown on outside click, so it never gets stuck open
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    setIsProfileMenuOpen(false);
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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-105 transition-transform duration-200">
              R
            </span>
            <span className="text-2xl font-bold text-green-700">RM STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Shop' },
              { to: '/recipes', label: 'Recipes' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-medium transition-colors duration-200 pb-1 ${
                    isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-green-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-56 lg:w-72 border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full p-2 transition-colors duration-200"
            >
              <FaSearch size={14} />
            </button>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-1">
            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full p-2.5 transition-colors duration-200"
            >
              <FaHeart size={18} />
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full p-2.5 transition-colors duration-200 relative"
            >
              <FaShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {userInfo ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full p-2.5 transition-colors duration-200"
                >
                  <FaUser size={18} />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {userInfo.isAdmin && process.env.REACT_APP_ADMIN_URL && (
                      <a
                        href={process.env.REACT_APP_ADMIN_URL}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </a>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full p-2.5 transition-colors duration-200"
              >
                <FaUser size={18} />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full p-2.5 transition-colors duration-200"
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
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
                  {userInfo.isAdmin && process.env.REACT_APP_ADMIN_URL && (
                    <a
                      href={process.env.REACT_APP_ADMIN_URL}
                      className="text-gray-700 hover:text-green-600 font-medium py-2"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </a>
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