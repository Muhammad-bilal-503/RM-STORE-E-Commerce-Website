import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { roleHasPermission, getDefaultRouteForRole } from '../../config/permissions';

// Frontend route gating — purely a UX convenience so staff never even see a
// page they can't use. The backend's authorize() middleware is the actual
// security boundary; this component does not replace it.
function PermissionRoute({ permission, requireSuperAdmin = false }) {
  const adminInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem('adminInfo')) || {};
    } catch {
      return {};
    }
  })();

  const role = adminInfo.role || (adminInfo.isAdmin ? 'super_admin' : 'customer');

  const allowed = requireSuperAdmin
    ? role === 'super_admin'
    : roleHasPermission(role, permission);

  if (!allowed) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
}

export default PermissionRoute;
