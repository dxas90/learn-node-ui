# E2E Tests - Playwright

Comprehensive end-to-end tests for the Learn Node UI application.

## 🎯 Test Coverage

- **Page Load & Initial State** - Application loading, UI elements, default values
- **API Configuration** - URL updates, validation, localStorage persistence
- **Connection Testing** - Successful connections, error handling, loading states
- **Endpoint Testing** - Individual endpoint fetching (/, /ping, /healthz, /info)
- **Bulk Operations** - Fetch all endpoints functionality
- **Response Display** - Metadata, JSON formatting, clipboard copy
- **Keyboard Shortcuts** - Enter, Ctrl+Enter, Ctrl+R
- **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- **Error Handling** - Network errors, API errors (404, 500)
- **Responsive Design** - Mobile and tablet viewports

## 🚀 Running Tests

### Prerequisites

Make sure the backend API is running at `http://localhost:3000`:

```bash
# Clone and run the backend API
git clone https://github.com/dxas90/learn-node.git
cd learn-node
npm install
npm start
```

### Run All Tests

```bash
npm run test:e2e
```

### Run in Headed Mode (see browser)

```bash
npm run test:e2e:headed
```

### Run with Playwright UI (interactive mode)

```bash
npm run test:e2e:ui
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### Run Specific Browser

```bash
# Chromium only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox
```

### View HTML Report

```bash
npm run test:e2e:report
```

## 📊 Test Results

Test results are saved to:
- **HTML Report**: `tests/e2e/report/index.html`
- **JSON Results**: `tests/e2e/results.json`
- **Screenshots**: `test-results/` (on failures only)
- **Videos**: `test-results/` (on failures only)

## 🔧 Configuration

Test configuration is in `playwright.config.js`:

- **Browsers**: Chromium, Firefox
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: On failure only
- **Parallel**: Yes (6 workers locally, 1 on CI)

## 🌐 CI/CD Integration

The E2E tests run automatically in the GitHub Actions CI/CD pipeline:

1. **Triggers**: On push to `main`/`develop`, and on pull requests
2. **Backend Setup**: Automatically clones and starts the `learn-node` API
3. **Browser Installation**: Installs Chromium and Firefox browsers
4. **Test Execution**: Runs all 60 tests (30 scenarios × 2 browsers)
5. **Reporting**:
   - Uploads HTML report as artifact (30 day retention)
   - Generates test summary in GitHub Actions UI
   - Comments on PRs with test results

### Viewing Results in GitHub Actions

1. Go to the **Actions** tab in your repository
2. Click on the workflow run
3. Click on the **E2E Tests (Playwright)** job
4. View the test summary in the job summary
5. Download the `playwright-report` artifact to view the full HTML report

## 📝 Writing New Tests

Add new tests in `tests/e2e/app.spec.js`:

```javascript
test('should do something', async ({ page }) => {
  // Navigate to page (already done in beforeEach)

  // Interact with elements
  const button = page.locator('#my-button');
  await button.click();

  // Assert results
  await expect(page.locator('#result')).toContainText('Success');
});
```

## 🐛 Troubleshooting

### Tests Fail Locally

1. Make sure the backend API is running at `http://localhost:3000`
2. Check that `npm run dev` starts the frontend on port 8080
3. Verify browsers are installed: `npx playwright install chromium firefox`

### Tests Fail in CI

1. Check the backend logs in the GitHub Actions output
2. Download the test artifacts to see screenshots/videos
3. Review the test summary in the job output

### Flaky Tests

- Tests with timing issues should use `waitForTimeout` sparingly
- Prefer `waitForLoadState`, `waitForSelector`, or `expect` with built-in retries
- Use `{ timeout: X }` options for specific assertions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Integration](https://playwright.dev/docs/ci-intro)
