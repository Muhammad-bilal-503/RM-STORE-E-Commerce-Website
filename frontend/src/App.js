import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import {
  HomePage,
  ProductPage,
  CartPage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ShippingPage,
  PaymentPage,
  PlaceOrderPage,
  PaymentProcessingPage,
  OrderPage,
  OrderSuccessPage,
  ProductsPage,
  RecipesPage,
  RecipePage,
  VerifyEmailPage,
  ForgotPasswordPage,
  AboutPage,
  ContactPage,
  WishlistPage,
  NotFoundPage,
} from './pages';

// Routes
import PrivateRoute from './components/routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Header />
      <main className="min-h-screen py-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/:id" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ForgotPasswordPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/category/:category" element={<ProductsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes (logged-in customers) */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/payment-processing/:orderId" element={<PaymentProcessingPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
