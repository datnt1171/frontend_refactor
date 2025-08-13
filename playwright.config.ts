import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    // ========== LOCALHOST TESTING ==========
    
    // Mobile - Primary PWA testing
    {
      name: 'localhost-mobile-chrome',
      testMatch: ['**/*.spec.ts', '**/*.mobile.spec.ts'],
      use: { 
        ...devices['Pixel 5'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'localhost-mobile-safari',
      testMatch: ['**/*.spec.ts', '**/*.mobile.spec.ts'],
      use: { 
        ...devices['iPhone 12'],
        baseURL: 'http://localhost:3000',
      },
    },
    
    // Tablet
    {
      name: 'localhost-tablet',
      testMatch: ['**/*.spec.ts'],
      use: { 
        ...devices['iPad Pro'],
        baseURL: 'http://localhost:3000',
      },
    },
    
    // Desktop - Mobile viewport for PWA consistency
    {
      name: 'localhost-desktop-chrome',
      testMatch: ['**/*.spec.ts', '**/*.desktop.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'localhost-desktop-firefox',
      testMatch: ['**/*.spec.ts'],
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'localhost-desktop-safari',
      testMatch: ['**/*.spec.ts'],
      use: { 
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3000',
      },
    },

    // ========== STAGING TESTING ==========
    
    // Mobile - Production-like testing
    {
      name: 'staging-mobile-chrome',
      testMatch: ['**/*.spec.ts', '**/*.mobile.spec.ts'],
      use: { 
        ...devices['Pixel 5'],
        baseURL: process.env.STAGING_URL,
      },
    },
    {
      name: 'staging-mobile-safari',
      testMatch: ['**/*.spec.ts', '**/*.mobile.spec.ts'],
      use: { 
        ...devices['iPhone 12'],
        baseURL: process.env.STAGING_URL,
      },
    },
    
    // Desktop
    {
      name: 'staging-desktop-chrome',
      testMatch: ['**/*.spec.ts', '**/*.desktop.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.STAGING_URL,
      },
    },

    // ========== PRODUCTION SMOKE TESTS ==========
    {
      name: 'prod-smoke',
      testMatch: ['**/*.smoke.spec.ts'],
      use: { 
        ...devices['Pixel 5'],
        baseURL: process.env.PROD_URL,
      },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});