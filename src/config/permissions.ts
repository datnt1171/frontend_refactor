// config/permissions.ts

// Path required auth not authz
export const authPaths = [
  '/task-management/dashboard',
  '/task-management/processes',
  '/task-management/tasks',

  '/me'

];

type RouteConfig = {
 roles: string[];
 allDepartments?: boolean;
 departments?: string[];
}

export const routePermissions: Record<string, RouteConfig> = {
 // Users
 '/user': {
   roles: ['admin', 'assistant'],
   departments: ['admin', 'TT']
 },

 // CRM
 '/crm': {
   roles: ['admin', 'assistant'],
   departments: ['admin', 'TT']
 },

 // Dashboard route
 '/dashboard': {
   roles: ['manager', 'admin', 'assistant'],
   allDepartments: true
 },

 // Task report
 '/dashboard/task-management/sample-request': {
  roles: ['manager', 'admin', 'assistant'],
  departments: ['TT', 'admin']
 },

 // Warehouse report
 '/dashboard/warehouse/data': { // warehouse manager only
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/overall': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/customer': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/product': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/plan': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/compare': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/conclusion': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/ratio': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
 '/dashboard/warehouse/aging': {
   roles: ['manager', 'admin'],
   departments: ['KHO', 'admin']
 },
}

/**
* Check if user has permission to access a route
* @param userRole - User's role
* @param userDept - User's department
* @param route - Route path to check
* @returns boolean - Has permission
*/
export function hasPermission(userRole: string, userDept: string, route: string): boolean {
 // Find the most specific matching route (longest path first)
 const matchedRoute = Object.keys(routePermissions)
   .sort((a, b) => b.length - a.length)
   .find(r => route.startsWith(r));

 // If no route restrictions found, allow access
 if (!matchedRoute) return true;

 const config = routePermissions[matchedRoute];
 if (!config) return false;
 
 // Check role permission
 const hasRoleAccess = config.roles.includes(userRole);
 
 // Check department permission
 const hasDeptAccess = !!config.allDepartments || 
   (Array.isArray(config.departments) && config.departments.includes(userDept));
 
 return hasRoleAccess && hasDeptAccess;
}

/**
* Get all accessible routes for a user (useful for navigation)
* @param userRole - User's role
* @param userDept - User's department
* @returns string[] - Array of accessible route patterns
*/
export function getAccessibleRoutes(userRole: string, userDept: string): string[] {
 return Object.keys(routePermissions).filter(route => 
   hasPermission(userRole, userDept, route)
 );
}