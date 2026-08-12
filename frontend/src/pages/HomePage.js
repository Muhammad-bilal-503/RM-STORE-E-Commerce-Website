import axiosInstance from '../utils/axios';
import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaShoppingBasket, FaLeaf, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';
import RecipeCard from '../components/recipes/RecipeCard';

const HomePage = () => {
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setSubscribeEmail('');
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Recipes,setRecipes]= useState([]);
  const [Products, setProducts] = useState([]);
    
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get('/products');
          setProducts(data);
          setError(null);
        } catch (err) {
           setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
      
        const { data } = await axiosInstance.get('/recipes');
        setRecipes(data);
       
      } catch (err) {
        console.log(err);
        
      }
    };

    fetchRecipes();
  }, []);
  return (
    <>
      <Helmet>
        <title>RM STORE - Premium Food Products</title>
        <meta
          name="description"
          content="RM STORE offers high-quality food products including flours, rice, honey, dry fruits, dates, and spices."
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white overflow-hidden flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between py-20 lg:py-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 mb-12 lg:mb-0 z-10"
          >
            <div className="inline-block bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🌟 Premium Quality Since 2020
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium <span className="text-yellow-400">Food Products</span> for Healthy Living
            </h1>
            <p className="text-xl mb-8 text-green-100 leading-relaxed">
              Discover our curated collection of premium flours, rice, honey, dry fruits, dates, and spices. 
              Sourced directly from the finest farms and producers.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-green-700 bg-opacity-50 px-4 py-2 rounded-full text-sm flex items-center">
                <FaLeaf className="mr-2" /> 100% Organic
              </span>
              <span className="bg-green-700 bg-opacity-50 px-4 py-2 rounded-full text-sm flex items-center">
                🚚 Free Shipping
              </span>
              <span className="bg-green-700 bg-opacity-50 px-4 py-2 rounded-full text-sm flex items-center">
                ⭐ Premium Quality
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-green-900 font-bold py-4 px-8 rounded-xl inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaShoppingBasket className="mr-3" />
                Explore Products
              </Link>
              <Link
                to="/about"
                className="bg-transparent hover:bg-white hover:text-green-900 text-white font-bold py-4 px-8 rounded-xl border-2 border-white inline-flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <FaLeaf className="mr-3" />
                Our Story
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="RM STORE Premium Products"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Product <span className="text-green-700">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated selection of premium food products, each category chosen for quality and freshness.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from(
              Products.reduce((map, product) => {
                if (product.category && !map.has(product.category)) {
                  map.set(product.category, product);
                }
                return map;
              }, new Map())
            ).map(([categoryName, representativeProduct], index) => (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Link
                  to={`/products/category/${categoryName}`}
                  className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={representativeProduct.image}
                      alt={categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-1 capitalize">
                      {categoryName}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured <span className="text-green-700">Products</span>
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked premium products that our customers love most
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Products <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Products</div>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {Products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-green-700">RM STORE</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the highest quality products and exceptional service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: "Premium Quality",
                description: "Sourced directly from the finest farms and producers worldwide, ensuring exceptional quality in every product.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: (
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: "Fast Delivery",
                description: "Quick and reliable delivery to your doorstep with real-time tracking and secure packaging.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: (
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "100% Satisfaction",
                description: "Your satisfaction is our guarantee. If you're not happy, we'll make it right with our hassle-free returns.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured <span className="text-green-700">Recipes</span>
              </h2>
              <p className="text-xl text-gray-600">
                Delicious recipes using our premium ingredients
              </p>
            </div>
            <Link
              to="/recipes"
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Recipes <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {Recipes.slice(0, 4).map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm-30 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              📧 Stay Updated
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our <span className="text-yellow-400">Newsletter</span>
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-green-100">
              Subscribe to receive updates on new products, special offers, exclusive recipes, and health tips delivered directly to your inbox.
            </p>
            
            <motion.form 
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row max-w-md mx-auto gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-4 py-2.5 flex-1 rounded-lg outline-none text-sm text-gray-700 shadow-md focus:shadow-lg focus:ring-2 focus:ring-yellow-400 transition-all placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-green-900 font-semibold text-sm py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Subscribe Now
              </button>
            </motion.form>
            
            <p className="text-sm text-green-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 