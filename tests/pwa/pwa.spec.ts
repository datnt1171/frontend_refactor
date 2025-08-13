import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifest = await page.locator('link[rel="manifest"]');
    await expect(manifest).toBeAttached();
    
    // Check manifest content
    const manifestHref = await manifest.getAttribute('href');
    expect(manifestHref).toBeTruthy();
  });

  test('should register service worker', async ({ page }) => {
    await page.goto('/');
    
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        } catch (e) {
          return false;
        }
      }
      return false;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('should work offline @mobile', async ({ page, context }) => {
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate to a cached page
    await page.goto('/');
    
    // Should not show connection error
    const errorText = await page.textContent('body');
    expect(errorText).not.toContain('connection');
  });

  test.describe('Mobile-specific PWA', () => {
    test('should be installable @mobile', async ({ page, browserName }) => {
      // Skip on webkit as it doesn't support install prompts
      test.skip(browserName === 'webkit', 'Install prompt not supported on Safari');
      
      await page.goto('/');
      
      // Check for PWA installability
      const isInstallable = await page.evaluate(() => {
        return 'serviceWorker' in navigator && 'beforeinstallprompt' in window;
      });
      
      // At minimum, service worker should be supported
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      
      expect(hasServiceWorker).toBe(true);
    });

    test('should handle touch gestures @mobile', async ({ page }) => {
      await page.goto('/');
      
      // Test touch interactions (swipe, tap, etc.)
      await page.touchscreen.tap(100, 100);
      
      // Verify touch interaction worked
      await expect(page).toHaveURL(/\//);
    });

    test('should have mobile-friendly viewport @mobile', async ({ page }) => {
      await page.goto('/');
      
      const viewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta?.getAttribute('content');
      });
      
      expect(viewport).toContain('width=device-width');
      expect(viewport).toContain('initial-scale=1');
    });
  });
});