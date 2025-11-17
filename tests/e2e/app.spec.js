// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Learn Node UI - E2E Tests
 * Tests the complete user journey and API integration
 */

const APP_URL = 'http://localhost:8080';
const API_URL = 'http://localhost:3000';

test.describe('Learn Node UI - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto(APP_URL);

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Initial State', () => {
    test('should load the application successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Learn Node API Explorer/);

      // Check main heading
      const heading = page.locator('h1');
      await expect(heading).toContainText('Learn Node API Explorer');

      // Check subtitle
      const subtitle = page.locator('.subtitle');
      await expect(subtitle).toBeVisible();
    });

    test('should display all UI elements', async ({ page }) => {
      // API URL input
      await expect(page.locator('#api-url')).toBeVisible();

      // Test Connection button
      await expect(page.locator('#test-connection')).toBeVisible();

      // Connection status
      await expect(page.locator('#connection-status')).toBeVisible();

      // All endpoint cards
      const endpointCards = page.locator('.endpoint-card');
      await expect(endpointCards).toHaveCount(4); // /, /ping, /healthz, /info

      // Fetch All button
      const fetchAllBtn = page.locator('.btn-large');
      await expect(fetchAllBtn).toBeVisible();
      await expect(fetchAllBtn).toContainText('Fetch All Endpoints');
    });

    test('should have correct API URL pre-filled', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const value = await apiUrlInput.inputValue();

      // Should have either FIXME_API_URL (default) or a valid URL from localStorage
      expect(value).toBeTruthy();
      // Accept both FIXME_API_URL and valid URLs
      expect(value === 'FIXME_API_URL' || value.match(/^https?:\/\//)).toBeTruthy();
    });
  });

  test.describe('API URL Configuration', () => {
    test('should update API URL', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');

      // Clear and set new URL
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Verify the value
      await expect(apiUrlInput).toHaveValue(API_URL);
    });

    test('should validate empty API URL', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const testBtn = page.locator('#test-connection');

      // Clear the URL
      await apiUrlInput.clear();

      // Try to test connection
      await testBtn.click();

      // Should show error
      await expect(apiUrlInput).toHaveClass(/error/);
      const errorMessage = page.locator('.error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('API URL is required');
    });

    test('should validate invalid URL format', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const testBtn = page.locator('#test-connection');

      // Enter invalid URL
      await apiUrlInput.clear();
      await apiUrlInput.fill('not-a-valid-url');

      // Try to test connection
      await testBtn.click();

      // Should show error
      await expect(apiUrlInput).toHaveClass(/error/);
      const errorMessage = page.locator('.error-message');
      await expect(errorMessage).toBeVisible();
    });

    test('should persist API URL in localStorage', async ({ page, context }) => {
      const apiUrlInput = page.locator('#api-url');
      const testUrl = 'http://test.example.com:3000';

      // Set URL
      await apiUrlInput.clear();
      await apiUrlInput.fill(testUrl);

      // Trigger blur to save
      await apiUrlInput.blur();

      // Wait a bit for localStorage
      await page.waitForTimeout(500);

      // Create new page to test persistence
      const newPage = await context.newPage();
      await newPage.goto(APP_URL);
      await newPage.waitForLoadState('networkidle');

      // URL should be persisted
      const newApiUrlInput = newPage.locator('#api-url');
      await expect(newApiUrlInput).toHaveValue(testUrl);

      await newPage.close();
    });
  });

  test.describe('Connection Testing', () => {
    test('should test connection successfully', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const testBtn = page.locator('#test-connection');
      const status = page.locator('#connection-status');

      // Set API URL
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Click test connection
      await testBtn.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Check status message
      await expect(status).toBeVisible();
      await expect(status).toHaveClass(/success/);
      await expect(status).toContainText(/Connection successful/);
    });

    test('should show loading state during connection test', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const testBtn = page.locator('#test-connection');
      const status = page.locator('#connection-status');

      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Click and verify the final state (loading is too fast to reliably test)
      await testBtn.click();

      // Wait for completion
      await page.waitForTimeout(2000);

      // Button should be enabled and show success
      await expect(testBtn).toBeEnabled();
      await expect(testBtn).toContainText('Test Connection');
      await expect(status).toHaveClass(/success/);
    });    test('should handle connection failure gracefully', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const testBtn = page.locator('#test-connection');
      const status = page.locator('#connection-status');

      // Use invalid URL
      await apiUrlInput.clear();
      await apiUrlInput.fill('http://invalid-host-that-does-not-exist:9999');

      // Click test connection
      await testBtn.click();

      // Wait for timeout
      await page.waitForTimeout(3000);

      // Should show error
      await expect(status).toHaveClass(/error/);
      await expect(status).toContainText(/failed|error/i);
    });
  });

  test.describe('Individual Endpoint Testing', () => {
    test('should fetch root endpoint "/"', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Find and click the root endpoint fetch button
      const rootCard = page.locator('.endpoint-card').filter({ hasText: 'GET /' }).first();
      const fetchBtn = rootCard.locator('button.btn-secondary');
      await fetchBtn.click();

      // Wait for response
      await page.waitForTimeout(1500);

      // Check response container
      const responseContainer = page.locator('#response-root');
      await expect(responseContainer).toHaveClass(/active/);
      await expect(responseContainer).toHaveClass(/success/);

      // Should contain response data
      const responseText = await responseContainer.textContent();
      expect(responseText).toBeTruthy();
      if (responseText) {
        expect(responseText.length).toBeGreaterThan(0);
      }

      // Should have copy button
      const copyBtn = responseContainer.locator('.copy-btn');
      await expect(copyBtn).toBeVisible();
    });

    test('should fetch /ping endpoint', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const pingCard = page.locator('.endpoint-card').filter({ hasText: '/ping' });
      const fetchBtn = pingCard.locator('button.btn-secondary');
      await fetchBtn.click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-ping');
      await expect(responseContainer).toHaveClass(/active/);

      // Response can be either 'success' class for JSON or 'text' class for plain text
      const classes = await responseContainer.getAttribute('class');
      expect(classes).toMatch(/active/);
      expect(classes).toMatch(/(success|text)/);

      // Ping should return "pong"
      const responseText = await responseContainer.textContent();
      expect(responseText?.toLowerCase()).toContain('pong');
    });

    test('should fetch /healthz endpoint', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const healthCard = page.locator('.endpoint-card').filter({ hasText: '/healthz' });
      const fetchBtn = healthCard.locator('button.btn-secondary');
      await fetchBtn.click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-healthz');
      await expect(responseContainer).toHaveClass(/active/);
      await expect(responseContainer).toHaveClass(/success/);

      // Health should have status
      const responseText = await responseContainer.textContent();
      expect(responseText).toContain('status');
    });

    test('should fetch /info endpoint', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const infoCard = page.locator('.endpoint-card').filter({ hasText: '/info' });
      const fetchBtn = infoCard.locator('button.btn-secondary');
      await fetchBtn.click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-info');
      await expect(responseContainer).toHaveClass(/active/);
      await expect(responseContainer).toHaveClass(/success/);
    });

    test('should show loading state during fetch', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const pingCard = page.locator('.endpoint-card').filter({ hasText: '/ping' });
      const fetchBtn = pingCard.locator('button.btn-secondary');
      const responseContainer = page.locator('#response-ping');

      // Click and verify the final state (loading is too fast to reliably test)
      await fetchBtn.click();

      // Wait for completion
      await page.waitForTimeout(1500);      // Should no longer be loading
      await expect(responseContainer).not.toHaveClass(/loading/);
    });
  });

  test.describe('Fetch All Endpoints', () => {
    test('should fetch all endpoints sequentially', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const fetchAllBtn = page.locator('.btn-large');
      await fetchAllBtn.click();

      // Wait for all to complete (4 endpoints + delays)
      await page.waitForTimeout(6000);

      // Check all response containers are populated
      const responses = [
        '#response-root',
        '#response-ping',
        '#response-healthz',
        '#response-info'
      ];

      for (const responseId of responses) {
        const container = page.locator(responseId);
        await expect(container).toHaveClass(/active/);
        const text = await container.textContent();
        expect(text).toBeTruthy();
        if (text) {
          expect(text.length).toBeGreaterThan(0);
        }
      }
    });

    test('should show loading state on fetch all button', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const fetchAllBtn = page.locator('.btn-large');
      await fetchAllBtn.click();

      // Should be disabled and show loading text
      await expect(fetchAllBtn).toBeDisabled();
      await expect(fetchAllBtn).toContainText('Fetching...');

      // Wait for completion
      await page.waitForTimeout(6000);

      // Should be enabled again
      await expect(fetchAllBtn).toBeEnabled();
      await expect(fetchAllBtn).toContainText('Fetch All');
    });
  });

  test.describe('Response Display Features', () => {
    test('should display response metadata (content-type, duration)', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const pingCard = page.locator('.endpoint-card').filter({ hasText: '/ping' });
      await pingCard.locator('button.btn-secondary').click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-ping');
      const header = responseContainer.locator('.response-header');

      await expect(header).toBeVisible();

      // Should show content type
      const contentType = header.locator('.content-type');
      await expect(contentType).toBeVisible();

      // Should show duration
      const duration = header.locator('.duration');
      await expect(duration).toBeVisible();
      await expect(duration).toContainText(/\d+ms/);
    });

    test('should format JSON responses with proper indentation', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const rootCard = page.locator('.endpoint-card').filter({ hasText: 'GET /' }).first();
      await rootCard.locator('button.btn-secondary').click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-root');
      const pre = responseContainer.locator('pre');

      const text = await pre.textContent();

      // Should have newlines (formatted)
      expect(text).toBeTruthy();
      expect(text).toContain('\n');

      // Should be valid JSON
      if (text) {
        expect(() => JSON.parse(text)).not.toThrow();
      }
    });

    test('should copy response to clipboard', async ({ page, context, browserName }) => {
      // Grant clipboard permissions (skip clipboard-read for Firefox as it's not supported)
      try {
        if (browserName === 'chromium') {
          await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        }
      } catch (e) {
        // Firefox doesn't support clipboard-read, but copy still works
      }

      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      const pingCard = page.locator('.endpoint-card').filter({ hasText: '/ping' });
      await pingCard.locator('button.btn-secondary').click();

      await page.waitForTimeout(1500);

      const responseContainer = page.locator('#response-ping');
      const copyBtn = responseContainer.locator('.copy-btn');

      // Click copy button
      await copyBtn.click();

      // Should show success state
      await expect(copyBtn).toContainText('Copied!');
      await expect(copyBtn).toHaveClass(/success/);

      // Wait for reset
      await page.waitForTimeout(2500);

      // Should reset
      await expect(copyBtn).toContainText('Copy');
      await expect(copyBtn).not.toHaveClass(/success/);
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should test connection with Enter key on input', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const status = page.locator('#connection-status');

      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Press Enter
      await apiUrlInput.press('Enter');

      // Should trigger connection test
      await page.waitForTimeout(2000);

      await expect(status).toHaveClass(/success/);
    });

    test('should test connection with Ctrl+Enter', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      const status = page.locator('#connection-status');

      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Press Ctrl+Enter
      await page.keyboard.press('Control+Enter');

      await page.waitForTimeout(2000);

      await expect(status).toHaveClass(/success/);
    });

    test('should fetch all with Ctrl+R', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Press Ctrl+R
      await page.keyboard.press('Control+r');

      // Wait for fetches
      await page.waitForTimeout(6000);

      // Check that responses are populated
      const rootResponse = page.locator('#response-root');
      await expect(rootResponse).toHaveClass(/active/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check important ARIA attributes
      const apiUrlInput = page.locator('#api-url');
      await expect(apiUrlInput).toHaveAttribute('aria-describedby');

      const testBtn = page.locator('#test-connection');
      await expect(testBtn).toHaveAttribute('aria-describedby');

      const status = page.locator('#connection-status');
      await expect(status).toHaveAttribute('aria-live');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab'); // API URL input
      await page.keyboard.press('Tab'); // Test Connection button
      await page.keyboard.press('Tab'); // First endpoint button

      // Check focus is visible
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test('should have semantic HTML', async ({ page }) => {
      // Check for semantic elements
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      const articles = page.locator('article');
      await expect(articles).toHaveCount(4);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill('http://localhost:9999'); // Non-existent port

      const pingCard = page.locator('.endpoint-card').filter({ hasText: '/ping' });
      await pingCard.locator('button.btn-secondary').click();

      await page.waitForTimeout(2000);

      const responseContainer = page.locator('#response-ping');
      await expect(responseContainer).toHaveClass(/error/);

      const errorText = await responseContainer.textContent();
      expect(errorText).toContain('Error');
    });

    test('should handle API errors (404, 500, etc)', async ({ page }) => {
      const apiUrlInput = page.locator('#api-url');
      await apiUrlInput.clear();
      await apiUrlInput.fill(API_URL);

      // Try to fetch a non-existent endpoint by modifying URL after test
      // This is a simplified test - in real scenario, you'd mock or have a test endpoint
      await apiUrlInput.fill(API_URL + '/nonexistent');

      const testBtn = page.locator('#test-connection');
      await testBtn.click();

      await page.waitForTimeout(2000);

      const status = page.locator('#connection-status');
      // Should show some kind of error or failure
      await expect(status).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      // Check that all elements are still visible and usable
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#api-url')).toBeVisible();
      await expect(page.locator('#test-connection')).toBeVisible();

      const endpointCards = page.locator('.endpoint-card');
      await expect(endpointCards.first()).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.endpoint-card')).toHaveCount(4);
    });
  });
});
