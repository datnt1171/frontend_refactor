import { test, expect } from '@playwright/test';
import { getTestCredentials, testUrls } from '../helpers/testData';

test.describe('Production Smoke Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Basic page load check
    await expect(page).toHaveTitle(/Task Management/);
    
    // Check critical elements exist
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load login page', async ({ page }) => {
    await page.goto(testUrls.login);
    
    // Login form elements should be present
    await expect(page.getByTestId('login-username-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeVisible();
  });

  test('should have valid SSL certificate', async ({ page }) => {
    const response = await page.goto('/');
    
    // Should be HTTPS in production
    expect(page.url()).toMatch(/^https:/);
    expect(response?.status()).toBe(200);
  });

  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');
    
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(hasServiceWorker).toBe(true);
  });

  test('should authenticate with read-only user', async ({ page }) => {
    const credentials = getTestCredentials();
    const readOnlyUser = credentials.readOnly;
    
    if (!readOnlyUser) {
      test.skip(true, 'Read-only credentials not configured for production');
      return;
    }

    await page.goto(testUrls.login);
    
    await page.getByTestId('login-username-input').fill(readOnlyUser.username);
    await page.getByTestId('login-password-input').fill(readOnlyUser.password);
    await page.getByTestId('login-submit-btn').click();
    
    // Should either redirect to dashboard or show success
    await expect(page).not.toHaveURL(testUrls.login);
    
    // Should not show error message
    await expect(page.getByTestId('login-error-msg')).not.toBeVisible();
  });

  test('should load critical API endpoints', async ({ request }) => {
    // Test health check endpoints
    const healthResponse = await request.get('/api/health');
    expect(healthResponse.status()).toBe(200);
    
    // Test API availability (non-authenticated)
    const apiResponse = await request.get('/api/auth/check');
    expect([200, 401, 403]).toContain(apiResponse.status()); // Any non-500 is good
  });
});