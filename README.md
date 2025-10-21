# Learn Node UI 🚀

A simple, interactive web UI to consume and display all endpoints from the [learn-node](https://github.com/dxas90/learn-node) backend API.

## 🌟 Features

- **Clean Interface**: Modern, responsive design with gradient background
- **Interactive Testing**: Test all API endpoints with a single click
- **Real-time Responses**: View formatted JSON and text responses
- **Connection Testing**: Verify API connectivity before making requests
- **Configurable**: Easy to point to different backend instances
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no build step required

## 📋 Endpoints Supported

- `GET /` - Welcome message and API information
- `GET /ping` - Simple ping-pong connectivity test
- `GET /healthz` - Health check with system metrics
- `GET /info` - Detailed application and system information

## 🚀 Quick Start

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- The [learn-node](https://github.com/dxas90/learn-node) backend running (default: http://localhost:3000)

### Running the UI

1. **Clone this repository**
   ```bash
   git clone https://github.com/dxas90/leaarn-node-ui.git
   cd leaarn-node-ui
   ```

2. **Open in browser**
   Simply open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

3. **Or use a local server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
   
   Then navigate to: `http://localhost:8080`

## 🎯 Usage

1. **Configure API URL**: Enter your backend API URL (default: http://localhost:3000)
2. **Test Connection**: Click "Test Connection" to verify the backend is accessible
3. **Fetch Endpoints**: Click "Fetch" on individual endpoints or use "Fetch All Endpoints"
4. **View Responses**: Responses appear below each endpoint with formatted JSON or text

## 🔧 Configuration

Change the API base URL in the input field at the top of the page. The default is `http://localhost:3000`.

For production deployments, update to your production URL:
- `https://your-domain.com`
- `https://api.your-domain.com`

## 🛠️ Development

### Project Structure

```
leaarn-node-ui/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling
├── script.js       # JavaScript logic
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

### Customization

- **Colors**: Edit the gradient and color scheme in `styles.css`
- **Layout**: Modify the grid layout in `styles.css` (`.endpoints-grid`)
- **Functionality**: Extend the JavaScript in `script.js` for additional features

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [Apache License 2.0](LICENSE).

## 🔗 Related Projects

- [learn-node](https://github.com/dxas90/learn-node) - The backend API this UI consumes

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/dxas90/leaarn-node-ui/issues)
- **Backend Issues**: [learn-node Issues](https://github.com/dxas90/learn-node/issues)

---

**Made with ❤️ for learning Node.js**