export const getTestCredentials = () => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  
  if (baseURL.includes('localhost')) {
    return {
      admin: {
        username: process.env.TEST_ADMIN_USERNAME || 'TEST_ADMIN',
        password: process.env.TEST_ADMIN_PASSWORD || 'TEST_ADMIN'
      },
      user: {
        username: process.env.TEST_USER_USERNAME || 'TEST_USER', 
        password: process.env.TEST_USER_PASSWORD || 'TEST_USER'
      }
    };
  }
  
  if (baseURL.includes('test')) {
    return {
      admin: {
        username: process.env.STAGING_ADMIN_USERNAME || 'staging_admin',
        password: process.env.STAGING_ADMIN_PASSWORD || 'staging_password'
      },
      user: {
        username: process.env.STAGING_USER_USERNAME || 'staging_user',
        password: process.env.STAGING_USER_PASSWORD || 'staging_password'
      }
    };
  }
  
  // Production - read-only user only
  return {
    readOnly: {
      username: process.env.PROD_TEST_USERNAME || 'prod_readonly_user',
      password: process.env.PROD_TEST_PASSWORD || 'prod_readonly_password'
    }
  };
};

export const testUrls = {
  login: '/en/login',
  dashboard: '/task-management/processes',
  changePassword: '/me/change-password'
};