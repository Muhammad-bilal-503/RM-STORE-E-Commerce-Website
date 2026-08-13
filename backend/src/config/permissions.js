// Single source of truth for RBAC. The backend is what actually enforces
// these — the admin frontend also reads this shape (mirrored, see
// admin-frontend/src/config/permissions.js) purely to decide what to show
// in the UI. Hiding a button is never the security boundary; the
// `authorize()` middleware checking against this map on every request is.

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRODUCT_MANAGER: 'product_manager',
  RECIPE_MANAGER: 'recipe_manager',
  ORDER_MANAGER: 'order_manager',
  CONTENT_MANAGER: 'content_manager',
  ANALYTICS_VIEWER: 'analytics_viewer',
  CUSTOMER: 'customer',
};

const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.PRODUCT_MANAGER,
  ROLES.RECIPE_MANAGER,
  ROLES.ORDER_MANAGER,
  ROLES.CONTENT_MANAGER,
  ROLES.ANALYTICS_VIEWER,
];

const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.PRODUCT_MANAGER]: 'Product Manager',
  [ROLES.RECIPE_MANAGER]: 'Recipe Manager',
  [ROLES.ORDER_MANAGER]: 'Order Manager',
  [ROLES.CONTENT_MANAGER]: 'Content Manager',
  [ROLES.ANALYTICS_VIEWER]: 'Analytics Viewer',
  [ROLES.CUSTOMER]: 'Customer',
};

const PERMISSIONS = [
  'products.read', 'products.create', 'products.update', 'products.delete',
  'recipes.read', 'recipes.create', 'recipes.update', 'recipes.delete',
  'categories.read', 'categories.create', 'categories.update', 'categories.delete',
  'orders.read', 'orders.update',
  'users.read', 'users.update',
  'staff.read', 'staff.create', 'staff.update', 'staff.delete',
  'analytics.read',
  'inventory.read', 'inventory.update',
];

// What each role can do. Super Admin implicitly has everything (checked
// separately in authorize()) rather than listed out here.
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

// Returns the effective permission list for a role. Super Admin gets every
// permission there is; unknown/customer roles get none.
function getPermissionsForRole(role) {
  if (role === ROLES.SUPER_ADMIN) return [...PERMISSIONS];
  return ROLE_PERMISSIONS[role] || [];
}

function roleHasPermission(role, permission) {
  return getPermissionsForRole(role).includes(permission);
}

module.exports = {
  ROLES,
  STAFF_ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  roleHasPermission,
};
