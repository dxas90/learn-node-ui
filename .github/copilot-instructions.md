# AI Coding Assistant — learn-node-ui

## Project Overview
Frontend UI application for testing and exploring the learn-node backend API. Built with vanilla HTML, CSS, and JavaScript using ES modules. Single-page application that makes HTTP requests to test API endpoints interactively.

## Architecture & Code Organization

### Core Structure
- **`src/index.html`**: Single HTML file with semantic structure, accessibility features, and meta tags
- **`src/script.js`**: Main application logic using ES6 class `APIExplorer` with modular functions
- **`src/styles.css`**: Responsive CSS with modern features (CSS Grid, custom properties, dark mode)

### Key Architectural Patterns
1. **Class-based Architecture**: Single `APIExplorer` class manages all state and interactions
2. **Event-driven Design**: DOM event listeners for user interactions, keyboard shortcuts
3. **Async/Await Pattern**: All API calls use modern async/await with proper error handling
4. **State Management**: API URL persisted in localStorage, connection status tracking
5. **Progressive Enhancement**: Works without JavaScript but enhanced with it

### Component Communication
- **Direct DOM Manipulation**: No framework - direct querySelector/getElementById access
- **Event Delegation**: Single event listeners on container elements where appropriate
- **Callback Pattern**: Success/error callbacks for API operations
- **Real-time Updates**: Live status updates during API calls with loading states

## Critical Developer Workflows

### Local Development
```bash
npm run dev                    # Start dev server on port 8080 with CORS
npm run start                  # Same as dev but opens browser automatically
```

### Testing Strategy
```bash
npm run test:e2e              # Run Playwright E2E tests (requires backend API)
npm run test:accessibility    # Basic accessibility validation
npm run test:lighthouse       # Performance audit with Lighthouse
```

**E2E Testing Notes:**
- Requires learn-node backend running on port 3000
- Tests run against both Chromium and Firefox
- Web server auto-starts via Playwright config
- Full test suite covers all user interactions and API flows

### Build & Deployment
```bash
npm run docker:build          # Build production Docker image
npm run docker:run            # Run container with API_URL env var
npm run docker:logs           # View container logs
```

**Docker Notes:**
- Multi-stage build (Node.js builder → nginx production)
- Nginx serves static files on port 80
- Environment variables: `API_URL`, `ENVIRONMENT`
- Health checks and security hardening included

## Project-Specific Conventions

### Code Style & Patterns
- **ES6+ Features**: Arrow functions, template literals, destructuring, async/await
- **Modular Functions**: Break down class methods into focused, single-responsibility functions
- **Error Handling**: Try/catch blocks with user-friendly error messages
- **Accessibility First**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Debounced inputs, request timeouts, retry logic

### API Integration Patterns
```javascript
// Standard API call pattern
async function fetchEndpoint(endpoint) {
    const response = await fetch(`${this.apiUrl}${endpoint.path}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(this.requestTimeout)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}
```

### UI State Management
- **CSS Classes**: `success`, `error`, `loading` classes for visual feedback
- **ARIA Live Regions**: Screen reader announcements for status updates
- **Progressive Disclosure**: Show/hide response containers dynamically
- **Persistent State**: API URL survives page refreshes via localStorage

### Testing Patterns
- **Page Object Model**: Direct DOM selectors in tests (no abstraction layer)
- **Data-driven Tests**: Test all endpoints programmatically
- **Visual Regression**: Screenshots on failure for debugging
- **Cross-browser**: Parallel execution on Chromium and Firefox

## Integration Points & Dependencies

### External API Requirements
- **Backend API**: learn-node service on port 3000 (configurable)
- **CORS Support**: Backend must allow cross-origin requests
- **JSON Responses**: All endpoints return JSON with consistent structure

### CI/CD Pipeline Stages
1. **Lint & Validate**: HTMLHint, Stylelint, ESLint, Prettier checks
2. **Accessibility**: Basic WCAG compliance validation
3. **E2E Tests**: Playwright with backend API setup
4. **Docker Build**: Multi-stage build with nginx
5. **Security Scan**: Trivy vulnerability scanning
6. **Publish**: Push to GitHub Container Registry

### Environment Variables
- **API_URL**: Backend API endpoint (default: http://localhost:3000)
- **ENVIRONMENT**: Runtime environment (development/production)
- **CI**: Enables stricter test settings when true

## Common Pitfalls & Gotchas

1. **Backend Dependency**: E2E tests fail without running backend API first
2. **CORS Issues**: Ensure backend allows requests from localhost:8080
3. **ES Modules**: All imports use .js extensions (required for ES modules)
4. **Static Serving**: No build step - files served directly from src/
5. **Browser Security**: Some features may be restricted in file:// protocol
6. **Timing Issues**: API calls have timeouts and retries built-in

## Key Files Reference

**Must-understand for contributions:**
- `src/script.js`: Main application logic and API integration
- `src/index.html`: HTML structure and accessibility features
- `src/styles.css`: Responsive design and visual states
- `playwright.config.js`: E2E test configuration and browser setup
- `tests/e2e/app.spec.js`: Comprehensive test suite (60+ tests)
- `Dockerfile`: Production containerization setup
- `.github/workflows/ci-cd.yml`: Complete CI/CD pipeline

**Quick patterns to follow:**
- Use `document.getElementById()` for DOM access (no querySelector chains)
- Handle all promise rejections with try/catch
- Update both CSS classes and ARIA attributes for state changes
- Test keyboard navigation for new interactive elements
- Add new endpoints to both `this.endpoints` array and test suite</content>
<parameter name="filePath">/home/daniel/C0D3/Hobby/learn-node-ui/.github/copilot-instructions.md
