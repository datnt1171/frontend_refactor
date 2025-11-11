type RoleDeptRoutes = {
  [department: string]: {
    [role: string]: string
  }
}

export const ROLE_DEPT_ROUTES: RoleDeptRoutes = {
  'TT': {
    'assistant': '/task-management/processes',
    'manager': '/dashboard/task-management/onsite-transfer-absence',
  },
  'KHO': {
    'manager': '/dashboard/warehouse/overall',
  },
  'TV': {
    'assistant': '/fleet/trip-logs',
    'driver': '/fleet/trips',
  },
}

export const DEFAULT_ROUTE = '/task-management/processes'

export function getDefaultRoute(department: string, role: string): string {
  const deptRoutes = ROLE_DEPT_ROUTES[department.toUpperCase()]
  if (!deptRoutes) return DEFAULT_ROUTE
  
  return deptRoutes[role.toLowerCase()] || DEFAULT_ROUTE
}