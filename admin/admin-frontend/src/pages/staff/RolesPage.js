import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { STAFF_ROLES, ROLE_LABELS, PERMISSIONS, getPermissionsForRole } from '../../config/permissions';

const GROUP_LABELS = {
  products: 'Products',
  recipes: 'Recipes',
  categories: 'Categories',
  orders: 'Orders',
  users: 'Customers',
  staff: 'Staff',
  analytics: 'Analytics',
  inventory: 'Inventory',
};

function groupPermissions() {
  const groups = {};
  for (const perm of PERMISSIONS) {
    const [group] = perm.split('.');
    if (!groups[group]) groups[group] = [];
    groups[group].push(perm);
  }
  return groups;
}

function RolesPage() {
  const groups = groupPermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Roles &amp; Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          What each role can do. Super Admin has full access to everything and isn't shown separately below.
          Roles are assigned per staff member from the Staff Management page.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Permission</th>
              {STAFF_ROLES.filter((r) => r !== 'super_admin').map((role) => (
                <th key={role} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(groups).map(([group, perms]) => (
              <React.Fragment key={group}>
                <tr className="bg-gray-50/60">
                  <td colSpan={STAFF_ROLES.length} className="px-4 py-2 text-xs font-semibold text-gray-700 uppercase sticky left-0 bg-gray-50/60">
                    {GROUP_LABELS[group] || group}
                  </td>
                </tr>
                {perms.map((perm) => (
                  <tr key={perm}>
                    <td className="px-4 py-2 text-sm text-gray-700 sticky left-0 bg-white">{perm}</td>
                    {STAFF_ROLES.filter((r) => r !== 'super_admin').map((role) => {
                      const has = getPermissionsForRole(role).includes(perm);
                      return (
                        <td key={role} className="px-4 py-2 text-center">
                          {has ? (
                            <FaCheck className="text-green-600 inline" size={13} />
                          ) : (
                            <FaTimes className="text-gray-300 inline" size={13} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RolesPage;
