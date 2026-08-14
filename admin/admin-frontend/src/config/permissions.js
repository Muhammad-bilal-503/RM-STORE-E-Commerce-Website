// Mirrors backend/src/config/permissions.js — this copy is for UI purposes
// ONLY (deciding what to show/hide in the sidebar and pages). The backend's
// authorize() middleware is what actually enforces access; this file must
// never be treated as a security boundary on its own.

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRODUCT_MANAGER: 'product_manager',
  RECIPE_MANAGER: 'recipe_manager',
  ORDER_MANAGER: 'order_manager',
  CONTENT_MANAGER: 'content_manager',
  ANALYTICS_VIEWER: 'analytics_viewer',
  CUSTOMER: 'customer',
};

export const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.PRODUCT_MANAGER,
  ROLES.RECIPE_MANAGER,
  ROLES.ORDER_MANAGER,
  ROLES.CONTENT_MANAGER,
  ROLES.ANALYTICS_VIEWER,
];

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.PRODUCT_MANAGER]: 'Product Manager',
  [ROLES.RECIPE_MANAGER]: 'Recipe Manager',
  [ROLES.ORDER_MANAGER]: 'Order Manager',
  [ROLES.CONTENT_MANAGER]: 'Content Manager',
  [ROLES.ANALYTICS_VIEWER]: 'Analytics Viewer',
  [ROLES.CUSTOMER]: 'Customer',
};

export const PERMISSIONS = [
  'products.read', 'products.create', 'products.update', 'products.delete',
  'recipes.read', 'recipes.create', 'recipes.update', 'recipes.delete',
  'categories.read', 'categories.create', 'categories.update', 'categories.delete',
  'orders.read', 'orders.update',
  'users.read', 'users.update',
  'staff.read', 'staff.create', 'staff.update', 'staff.delete',
  'analytics.read',
  'inventory.read', 'inventory.update',
];

const ROLE_PERMISSIONS = {
  [ROLES.PRODUCT_MANAGER]: [
    'products.read', 'products.create', 'products.update', 'products.delete',
    'inventory.read', 'inventory.update',
  ],
  [ROLES.RECIPE_MANAGER]: [
    'recipes.read', 'recipes.create', 'recipes.update', 'recipes.delete',
    'categories.read',
  ],
  [ROLES.ORDER_MANAGER]: [
    'orders.read', 'orders.update', 'users.read',
  ],
  [ROLES.CONTENT_MANAGER]: [
    'categories.read', 'categories.create', 'categories.update', 'categories.delete',
    'recipes.read',
  ],
  [ROLES.ANALYTICS_VIEWER]: [
    'analytics.read', 'inventory.read', 'orders.read', 'products.read',
  ],
};

export function getPermissionsForRole(role) {
  if (role === ROLES.SUPER_ADMIN) return [...PERMISSIONS];
  return ROLE_PERMISSIONS[role] || [];
}

export function roleHasPermission(role, permission) {
  return getPermissionsForRole(role).includes(permission);
}

// First page a role should land on after login - avoids sending someone to
// a page they'd immediately get a 403 from (e.g. Product Manager doesn't
// have analytics.read, so they shouldn't be forced onto /dashboard).
export function getDefaultRouteForRole(role) {
  if (role === ROLES.SUPER_ADMIN || roleHasPermission(role, 'analytics.read')) {
    return '/dashboard';
  }
  if (roleHasPermission(role, 'products.read')) return '/products';
  if (roleHasPermission(role, 'orders.read')) return '/orders';
  if (roleHasPermission(role, 'recipes.read')) return '/recipes';
  if (roleHasPermission(role, 'categories.read')) return '/categories';
  return '/profile';
}
