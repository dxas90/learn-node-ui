# Learn Node UI 🚀

A modern, interactive web UI to explore and test all endpoints from the [learn-node](https://github.com/dxas90/learn-node) backend API. Built with vanilla HTML, CSS, and JavaScript with a focus on accessibility, performance, and developer experience.

[![CI/CD Pipeline](https://github.com/dxas90/learn-node-ui/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/dxas90/learn-node-ui/actions/workflows/ci-cd.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## ✨ Features

### User Features
- **🎨 Modern Interface**: Responsive design with gradient backgrounds and smooth animations
- **🔄 Interactive Testing**: Test all API endpoints with a single click
- **📊 Real-time Responses**: View formatted JSON and text responses with syntax highlighting
- **🔌 Connection Testing**: Verify API connectivity before making requests
- **⚙️ Configurable**: Easy to point to different backend instances with persistent storage
- **📋 Copy to Clipboard**: Quick copy functionality for API responses
- **⌨️ Keyboard Shortcuts**: Ctrl+Enter to test connection, Ctrl+R to fetch all endpoints
- **📱 Fully Responsive**: Works seamlessly on mobile, tablet, and desktop

### Technical Features
- **♿ Accessible**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
- **🌓 Dark Mode**: Automatic dark mode support based on system preferences
- **🔒 Secure**: Security headers, CORS handling, and CSP policies
- **⚡ Performance**: Optimized with caching, compression, and minimal dependencies
- **🐳 Docker Ready**: Production-ready Docker image with health checks
- **🔄 Auto-retry**: Automatic retry logic for failed requests
- **💾 Persistent State**: API URL saved to localStorage
- **🎯 Error Handling**: Comprehensive error handling and user feedback

## 📋 Endpoints Supported

- `GET /` - Welcome message and API information
- `GET /ping` - Simple ping-pong connectivity test
- `GET /healthz` - Health check with system metrics
- `GET /info` - Detailed application and system information

## 🚀 Quick Start

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- The [learn-node](https://github.com/dxas90/learn-node) backend running (default: http://localhost:3000)
- Node.js >= 18 (for development)

### Option 1: Simple File Access

Simply open `src/index.html` in your web browser - no server required!

### Option 2: Using npm (Recommended)

```bash
# Clone the repository
git clone https://github.com/dxas90/learn-node-ui.git
cd learn-node-ui

# Install dependencies
npm install

# Start development server
npm start
```

The application will open automatically at `http://localhost:8080`.

### Option 3: Using Make

```bash
# Install dependencies and start server
make install
make start
```

### Option 4: Using Docker
### Option 4: Using Docker

```bash
# Build the image
docker build -t learn-node-ui:latest .

# Run the container
docker run -d \
  --name learn-node-ui \
  -p 8080:80 \
  -e API_URL=http://localhost:3000 \
  -e ENVIRONMENT=production \
  learn-node-ui:latest

# Or using make
make docker-build
make docker-run
```

Visit `http://localhost:8080` in your browser.

## 🎯 Usage

1. **Configure API URL**: Enter your backend API URL (default: `http://localhost:3000`)
2. **Test Connection**: Click "Test Connection" to verify the backend is accessible
3. **Fetch Endpoints**: Click "Fetch" on individual endpoints or use "Fetch All Endpoints"
4. **View Responses**: Responses appear below each endpoint with:
   - Formatted JSON or text
   - Response time
   - Content type
   - Copy to clipboard button

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Test connection
- `Ctrl/Cmd + R` - Fetch all endpoints
- `Tab` - Navigate between interactive elements

## 🔧 Configuration

### Environment Variables (Docker)

- `API_URL` - Backend API URL (default: `http://localhost:3000`)
- `ENVIRONMENT` - Environment name: `localdev` or `production` (default: `production`)
- `MY_DEBUG` - Debug mode: `false`, `true`, or `verbose` (default: `false`)
- `SHOW_END_RESULT` - Show configuration results (default: `false`)

### Browser Configuration

The API URL is saved to `localStorage` and persists across sessions.

## 🛠️ Development

### Project Structure

```
learn-node-ui/
├── src/                    # Source files
│   ├── index.html         # Main HTML with semantic structure
│   ├── script.js          # JavaScript with ES6+ features
│   └── styles.css         # Modern CSS with custom properties
├── deploy/                # Deployment configurations
│   ├── 99-fix-access.sh  # Environment setup script
│   └── default.conf      # Nginx configuration
├── .github/               # GitHub Actions workflows
│   └── workflows/
│       └── ci-cd.yml     # CI/CD pipeline
├── Dockerfile            # Multi-stage Docker build
├── Makefile              # Development tasks
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

### Available Scripts

```bash
# Development
npm start              # Start dev server (opens browser)
npm run dev            # Start dev server (no browser)

# Code Quality
npm run lint           # Run all linters
npm run format         # Format all code
npm run validate       # Lint and format

# Docker
npm run docker:build  # Build Docker image
npm run docker:run    # Run Docker container
npm run docker:stop   # Stop and remove container

# Testing
npm run test:accessibility  # Run accessibility tests
npm run test:lighthouse    # Run Lighthouse audit
```

### Using Make

```bash
make help              # Show all available commands
make install           # Install dependencies
make dev               # Start development server
make lint              # Run linters
make format            # Format code
make validate          # Validate and format
make test              # Run tests
make docker-build      # Build Docker image
make docker-run        # Run Docker container
make ci                # Run CI pipeline locally
```

### Code Quality Tools

- **ESLint** - JavaScript linting
- **Stylelint** - CSS linting
- **HTMLHint** - HTML validation
- **Prettier** - Code formatting
- **Pa11y** - Accessibility testing
- **Lighthouse** - Performance auditing

## 🧪 Testing

### Automated Tests

```bash
# Run all tests
make test

# Individual tests
make test-accessibility
make test-lighthouse
```

### Manual Testing

1. Start the development server: `npm start`
2. Start the backend API: [learn-node](https://github.com/dxas90/learn-node)
3. Test all endpoints and verify responses
4. Test responsive design at different viewport sizes
5. Test keyboard navigation and screen reader compatibility
6. Test error scenarios (API down, network errors, etc.)

## 🐳 Docker Deployment

### Build and Run

```bash
# Build production image
docker build -t learn-node-ui:latest .

# Run with custom API URL
docker run -d \
  --name learn-node-ui \
  -p 8080:80 \
  -e API_URL=https://your-api.com \
  -e ENVIRONMENT=production \
  learn-node-ui:latest

# View logs
docker logs -f learn-node-ui

# Health check
curl http://localhost:8080/health
```

### Docker Compose

```yaml
version: '3.8'
services:
  ui:
    build: .
    ports:
      - "8080:80"
    environment:
      - API_URL=http://localhost:3000
      - ENVIRONMENT=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔒 Security

- **Security Headers**: X-Frame-Options, CSP, X-Content-Type-Options
- **CORS Configuration**: Properly configured for API communication
- **Input Validation**: URL validation and sanitization
- **No Secrets**: No hardcoded secrets or API keys
- **Non-root User**: Docker container runs as non-root user
- **Health Checks**: Built-in health check endpoint

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Semantic HTML5 structure
- ARIA labels and live regions
- Keyboard navigation support
- Screen reader compatible
- Focus management
- High contrast mode support
- Reduced motion support

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance

- Lighthouse Score: 95+
- Gzip compression enabled
- Optimized caching strategy
- Minimal JavaScript footprint
- No external dependencies
- Fast initial load time

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [learn-node](https://github.com/dxas90/learn-node) - The backend API this UI consumes

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/dxas90/learn-node-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dxas90/learn-node-ui/discussions)
- **Backend Issues**: [learn-node Issues](https://github.com/dxas90/learn-node/issues)

## 🙏 Acknowledgments

- Built with modern web standards
- Inspired by API testing tools like Postman and Insomnia
- Thanks to all contributors

---

**Made with ❤️ for learning Node.js** | [Report Bug](https://github.com/dxas90/learn-node-ui/issues) | [Request Feature](https://github.com/dxas90/learn-node-ui/issues)
