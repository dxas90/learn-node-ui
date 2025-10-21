# Contributing to Learn Node UI

Thank you for your interest in contributing to Learn Node UI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/learn-node-ui.git
   cd learn-node-ui
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/dxas90/learn-node-ui.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for container testing)
- Git

### Installation

```bash
# Install dependencies
npm install

# Or using make
make install
```

### Running Locally

```bash
# Start development server
npm start

# Or using make
make start
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
learn-node-ui/
├── src/               # Source files
│   ├── index.html    # Main HTML file
│   ├── script.js     # JavaScript functionality
│   └── styles.css    # CSS styles
├── deploy/           # Deployment scripts and configs
│   ├── 99-fix-access.sh
│   └── default.conf
├── .github/          # GitHub Actions workflows
├── Dockerfile        # Docker image configuration
├── package.json      # Node.js dependencies and scripts
├── Makefile          # Common development tasks
└── README.md         # Project documentation
```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   ```bash
   make validate
   make test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### HTML

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Maintain valid HTML structure
- Use double quotes for attributes

### CSS

- Use CSS custom properties for colors and repeated values
- Follow BEM or similar naming convention for classes
- Write mobile-first responsive styles
- Support dark mode with `prefers-color-scheme`
- Include accessibility features (focus styles, reduced motion)

### JavaScript

- Use modern ES6+ features
- Follow functional programming principles where possible
- Add JSDoc comments for complex functions
- Handle errors gracefully
- Use meaningful variable and function names
- Avoid global variables

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add copy to clipboard functionality
fix: resolve CORS issue with API requests
docs: update README with new features
```

## Testing

### Linting

```bash
# Run all linters
make lint

# Individual linters
npm run lint:html
npm run lint:css
npm run lint:js
```

### Formatting

```bash
# Format all files
make format

# Check formatting without changes
npm run format -- --check
```

### Accessibility Testing

```bash
make test-accessibility
```

### Manual Testing Checklist

- [ ] Test in Chrome, Firefox, Safari, and Edge
- [ ] Test responsive design on mobile, tablet, and desktop
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test dark mode (if applicable)
- [ ] Test with slow network connection
- [ ] Test error scenarios (API down, network error, etc.)

## Pull Request Process

1. **Ensure all tests pass** before submitting
2. **Update documentation** if needed
3. **Add/update tests** for new features
4. **Keep PRs focused** - one feature/fix per PR
5. **Write a clear PR description**:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Before and after screenshots

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Reporting Bugs

When reporting bugs, please include:

1. **Clear title** and description
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details**:
   - Browser and version
   - Operating system
   - Node.js version (if applicable)
6. **Screenshots or error messages**
7. **Possible solution** (if you have ideas)

Use the GitHub issue template when available.

## Suggesting Enhancements

We welcome enhancement suggestions! Please include:

1. **Clear title** and description
2. **Use case** - why is this needed?
3. **Proposed solution**
4. **Alternative solutions** considered
5. **Additional context** (mockups, examples, etc.)

## Docker Development

### Build and test Docker image

```bash
# Build image
make docker-build

# Run container
make docker-run

# View logs
make docker-logs

# Stop container
make docker-stop
```

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

---

Thank you for contributing to Learn Node UI! 🚀
