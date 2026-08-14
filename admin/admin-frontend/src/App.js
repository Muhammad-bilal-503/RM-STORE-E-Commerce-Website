import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getDefaultRouteForRole } from './config/permissions';

// Layout Components
import AdminLayout from './components/layout/AdminLayout';
import PermissionRoute from './components/routes/PermissionRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import AddProduct from './pages/products/AddProduct';
import OrdersPage from './pages/orders/OrdersPage';
import RecipesPage from './pages/recipe/RecipesPage';
import AddRecipe from './pages/recipe/AddRecipe';
import InventoryPage from './pages/inventory/InventoryPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import UsersPage from './pages/users/UsersPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import StaffPage from './pages/staff/StaffPage';
import RolesPage from './pages/staff/RolesPage';
import ProfilePage from './pages/profile/ProfilePage';

function getStoredRole() {
  try {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    return adminInfo?.role || (adminInfo?.isAdmin ? 'super_admin' : 'customer');
  } catch {
    return 'customer';
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check for authentication token on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // Function to handle login
  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return null;
  }

  const defaultRoute = getDefaultRouteForRole(getStoredRole());

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to={defaultRoute} replace />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AdminLayout onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Navigate to={defaultRoute} replace />} />

            <Route element={<PermissionRoute permission="analytics.read" />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            <Route element={<PermissionRoute permission="products.read" />}>
              <Route path="products" element={<ProductsPage />} />
            </Route>
            <Route element={<PermissionRoute permission="products.create" />}>
              <Route path="add-product" element={<AddProduct />} />
            </Route>
            <Route element={<PermissionRoute permission="products.update" />}>
              <Route path="products/:id/edit" element={<AddProduct />} />
            </Route>
            <Route element={<PermissionRoute permission="inventory.read" />}>
              <Route path="inventory" element={<InventoryPage />} />
            </Route>

            <Route element={<PermissionRoute permission="orders.read" />}>
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            <Route element={<PermissionRoute permission="recipes.read" />}>
              <Route path="recipes" element={<RecipesPage />} />
            </Route>
            <Route element={<PermissionRoute permission="recipes.create" />}>
              <Route path="add-recipe" element={<AddRecipe />} />
            </Route>
            <Route element={<PermissionRoute permission="recipes.update" />}>
              <Route path="recipes/:id/edit" element={<AddRecipe />} />
            </Route>

            <Route element={<PermissionRoute permission="categories.read" />}>
              <Route path="categories" element={<CategoriesPage />} />
            </Route>

            <Route element={<PermissionRoute permission="users.read" />}>
              <Route path="users" element={<UsersPage />} />
            </Route>

            <Route element={<PermissionRoute requireSuperAdmin />}>
              <Route path="staff" element={<StaffPage />} />
              <Route path="roles" element={<RolesPage />} />
            </Route>

            {/* Profile is available to any authenticated staff member */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 404 / fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
