# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-22

### Added

#### HTML Improvements
- Semantic HTML5 elements (`header`, `main`, `section`, `article`, `footer`)
- Comprehensive ARIA labels and accessibility attributes
- Meta tags for SEO and social media (Open Graph, Twitter Cards)
- Theme color meta tag for mobile browsers
- Inline SVG favicon support
- Preload hints for critical resources
- Service Worker registration scaffold (commented out)

#### JavaScript Enhancements
- Object-oriented architecture with `APIExplorer` class
- LocalStorage persistence for API URL
- Input validation with error messaging
- Auto-retry mechanism for failed requests (up to 3 attempts)
- Request timeout handling (10 seconds)
- Online/offline status detection
- Keyboard shortcuts (Ctrl+Enter, Ctrl+R)
- Copy to clipboard functionality for responses
- Debounced input handling
- Performance timing for request duration
- Screen reader announcements for responses
- Comprehensive error handling with user-friendly messages

#### CSS Features
- CSS custom properties (variables) for theming
- Dark mode support via `prefers-color-scheme`
- Responsive design with mobile-first approach
- High contrast mode support
- Reduced motion support for accessibility
- Print-friendly styles
- Smooth animations and transitions
- Enhanced focus indicators
- Loading spinners and states
- Better scrollbar styling
- Gradient backgrounds and modern UI elements

#### Docker & Deployment
- Multi-stage Dockerfile for optimized builds
- Non-root user for security
- Health check endpoint
- Comprehensive environment variable support
- Enhanced nginx configuration with:
  - Security headers (CSP, X-Frame-Options, etc.)
  - Gzip compression
  - Browser caching strategies
  - CORS configuration
  - Custom error pages
- Improved deployment script with:
  - Colored output
  - Better error handling
  - Backup creation before file modifications
  - Comprehensive logging
  - Debug modes (normal and verbose)

#### Development Tooling
- `package.json` with comprehensive scripts
- ESLint configuration for JavaScript linting
- Stylelint configuration for CSS linting
- HTMLHint configuration for HTML validation
- Prettier configuration for code formatting
- EditorConfig for consistent coding styles
- `.dockerignore` for optimized Docker builds
- Makefile with 30+ development commands
- GitHub Actions CI/CD pipeline with:
  - Linting and validation
  - Accessibility testing
  - Docker image building
  - Security scanning with Trivy
  - Automated publishing to GHCR

#### Documentation
- Comprehensive `README.md` with badges and examples
- `CONTRIBUTING.md` with contribution guidelines
- `LICENSE` file (Apache 2.0)
- `CHANGELOG.md` (this file)
- Inline code documentation and comments

### Changed

#### Improvements
- API URL input changed from `text` to `url` type for better validation
- Response containers now show metadata (content-type, duration)
- Button states now properly disabled during operations
- Endpoint cards have staggered fade-in animations
- File structure reorganized with proper separation of concerns
- Enhanced error messages with actionable information

#### Refactoring
- Converted functional JavaScript to class-based architecture
- Improved code organization and modularity
- Better separation of concerns
- Removed inline event handlers (moved to class methods)
- Standardized naming conventions
- Enhanced code comments and documentation

### Fixed

- CORS handling for cross-origin API requests
- Request timeout issues on slow connections
- URL validation edge cases
- Focus management for accessibility
- Mobile responsiveness issues
- Input sanitization vulnerabilities
- Docker security issues (now runs as non-root)
- Deployment script bash compatibility issues

### Security

- Added Content Security Policy headers
- Implemented security headers in nginx
- Container runs as non-root user
- Input validation and sanitization
- Removed potential XSS vulnerabilities
- Added `.dockerignore` to prevent sensitive file leaks
- Implemented proper CORS handling

## [0.1.0] - Initial Release

### Added
- Basic HTML structure
- Simple CSS styling
- JavaScript for API calls
- Docker support
- Basic README

---

## Version History

- **1.0.0** - Major improvements across all aspects (October 22, 2025)
- **0.1.0** - Initial release (Previous)

## Upgrade Notes

### From 0.1.0 to 1.0.0

**Breaking Changes:**
- HTML structure changed to use semantic elements
- JavaScript refactored to class-based architecture
- CSS class names may have changed

**Migration Steps:**
1. Pull latest changes
2. If using Docker, rebuild the image: `docker build -t learn-node-ui:latest .`
3. Update environment variables if needed
4. Test all functionality
5. API URL will be preserved in localStorage

**New Features to Explore:**
- Try keyboard shortcuts (Ctrl+Enter, Ctrl+R)
- Test dark mode in your browser
- Use the copy-to-clipboard feature
- Check out the new development tools (`make help`)

## Future Plans

- [ ] Add WebSocket support for real-time updates
- [ ] Implement request history
- [ ] Add export functionality (JSON, CSV)
- [ ] Create browser extension version
- [ ] Add theme customization
- [ ] Implement rate limiting visualization
- [ ] Add request/response diff viewer
- [ ] Support for POST/PUT/DELETE methods
- [ ] Request builder with body/headers editor
- [ ] Collection management for saved requests

---

For more details on any release, see the [commit history](https://github.com/dxas90/learn-node-ui/commits/main).
