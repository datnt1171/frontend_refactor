import { test, expect } from '@playwright/test';
import { getTestCredentials, testUrls } from '../helpers/testData';

test.describe('Login Error Cases', () => {
  test('should show error for empty form submission', async ({ page }) => {
    await page.goto(testUrls.login);
    
    await page.getByTestId('login-submit-btn').click();
    
    await expect(page.getByTestId('login-error-msg')).toBeVisible();
    await expect(page.getByTestId('login-error-msg')).toContainText('Username and Password are required');
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto(testUrls.login);
    
    await page.getByTestId('login-username-input').fill('wrong_username');
    await page.getByTestId('login-password-input').fill('wrong_password');
    await page.getByTestId('login-submit-btn').click();
    
    await expect(page.getByTestId('login-error-msg')).toBeVisible();
    await expect(page.getByTestId('login-error-msg')).toContainText('No active account found with the given credentials');
  });

  test('should show error for nextjs backend failure', async ({ page }) => {
    const credentials = getTestCredentials();
    const testUser = credentials.admin || credentials.readOnly;
    
    if (!testUser) {
      test.skip(true, 'Test user credentials not available for this environment');
    }

    // Mock BFF failure
    await page.route('/api/**', route => route.abort());
    
    await page.goto(testUrls.login);
    
    await page.getByTestId('login-username-input').fill(testUser.username);
    await page.getByTestId('login-password-input').fill(testUser.password);
    await page.getByTestId('login-submit-btn').click();
    
    await expect(page.getByTestId('login-error-msg')).toBeVisible();
    await expect(page.getByTestId('login-error-msg')).toContainText('Unexpected error when login, please retry later');
  });
});

test.describe('Login Success Cases', () => {
  test('should redirect to change password on first login', async ({ page }) => {
    const credentials = getTestCredentials();
    const testUser = credentials.user;
    
    if (!testUser) {
      test.skip(true, 'User credentials not available for this environment');
      return;
    }

    // // Mock successful login requiring password change
    // await page.route('/api/auth/login', route => {
    //   route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify({
    //       success: true,
    //       requiresPasswordChange: true
    //     })
    //   });
    // });
    
    await page.goto(testUrls.login);
    
    await page.getByTestId('login-username-input').fill(testUser.username);
    await page.getByTestId('login-password-input').fill(testUser.password);
    await page.getByTestId('login-submit-btn').click();
    
    // Should redirect to password change
    await expect(page).toHaveURL(/.*\/me\/change-password/);
  });

  test('should redirect to task management on normal login', async ({ page }) => {
    const credentials = getTestCredentials();
    const testUser = credentials.admin || credentials.readOnly;
    
    if (!testUser) {
      test.skip(true, 'Test user credentials not available for this environment');
    }

    // // Mock successful login without password change
    // await page.route('/api/auth/login', route => {
    //   route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify({
    //       success: true,
    //       requiresPasswordChange: false
    //     })
    //   });
    // });
    
    await page.goto(testUrls.login);
    
    await page.getByTestId('login-username-input').fill(testUser.username);
    await page.getByTestId('login-password-input').fill(testUser.password);
    await page.getByTestId('login-submit-btn').click();
    
    // Should redirect to task management
    await expect(page).toHaveURL(/.*\/task-management\/processes/);
  });
});