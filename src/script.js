/**
 * Learn Node API Explorer - Interactive UI
 * Enhanced with modern JavaScript features, error handling, and persistence
 */

class APIExplorer {
    constructor() {
        this.apiUrl = '';
        this.isOnline = navigator.onLine;
        this.requestTimeout = 10000; // 10 seconds
        this.retryAttempts = 3;
        this.endpoints = [
            { path: '/', name: 'root', description: 'Welcome message and API information' },
            {
                path: '/ping',
                name: 'ping',
                description: 'Simple ping-pong response for connectivity test'
            },
            {
                path: '/healthz',
                name: 'healthz',
                description: 'Health check endpoint with system metrics'
            },
            {
                path: '/info',
                name: 'info',
                description: 'Detailed application and system information'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredApiUrl();
        this.checkOnlineStatus();

        // Auto-test connection if API URL is pre-configured
        if (this.apiUrl && this.apiUrl !== 'FIXME_API_URL') {
            setTimeout(() => this.testConnection(), 1000);
        }
    }

    setupEventListeners() {
        // Test connection button
        const testBtn = document.getElementById('test-connection');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testConnection());
        }

        // API URL input
        const apiUrlInput = document.getElementById('api-url');
        if (apiUrlInput) {
            // Enter key to test connection
            apiUrlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.testConnection();
                }
            });

            // Save URL to localStorage on input
            apiUrlInput.addEventListener(
                'input',
                debounce(() => {
                    this.saveApiUrl();
                }, 500)
            );

            // Validate URL format on blur
            apiUrlInput.addEventListener('blur', () => {
                this.validateApiUrl();
            });
        }

        // Online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('📶 Back online', true);
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('📶 You are offline', false);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.testConnection();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.fetchAllEndpoints();
                        break;
                }
            }
        });
    }

    getApiUrl() {
        const input = document.getElementById('api-url');
        return input ? input.value.trim() : '';
    }

    validateApiUrl() {
        const url = this.getApiUrl();
        const input = document.getElementById('api-url');

        if (!url) {
            this.setInputError(input, 'API URL is required');
            return false;
        }

        try {
            new URL(url);
            this.clearInputError(input);
            return true;
        } catch {
            this.setInputError(input, 'Please enter a valid URL');
            return false;
        }
    }

    setInputError(input, message) {
        if (!input) {
            console.warn('setInputError called with null/undefined input');
            return;
        }

        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearInputError(input) {
        if (!input) {
            console.warn('clearInputError called with null/undefined input');
            return;
        }

        input.classList.remove('error');
        input.removeAttribute('aria-invalid');

        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    loadStoredApiUrl() {
        try {
            const stored = localStorage.getItem('learnNodeApiUrl');
            if (stored) {
                this.apiUrl = stored;
                const input = document.getElementById('api-url');
                if (input && input.value === 'FIXME_API_URL') {
                    input.value = stored;
                }
            }
        } catch (error) {
            console.warn('Could not load stored API URL:', error);
        }
    }

    saveApiUrl() {
        try {
            const apiUrl = this.getApiUrl();
            if (apiUrl) {
                localStorage.setItem('learnNodeApiUrl', apiUrl);
            }
        } catch (error) {
            // Handle QuotaExceededError or other localStorage errors
            console.warn('Could not save API URL to localStorage:', error);
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Please clear browser storage.');
            }
        }
    }

    checkOnlineStatus() {
        if (!this.isOnline) {
            this.showConnectionStatus('📶 You are offline', false);
        }
    }

    showConnectionStatus(message, isSuccess) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message;
        statusElement.className = 'status ' + (isSuccess ? 'success' : 'error');

        // Clear status after 5 seconds
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'status';
        }, 5000);
    }

    async testConnection() {
        if (!this.isOnline) {
            this.showConnectionStatus('📶 No internet connection', false);
            return;
        }

        if (!this.validateApiUrl()) {
            return;
        }

        const apiUrl = this.getApiUrl();
        const statusElement = document.getElementById('connection-status');
        const testBtn = document.getElementById('test-connection');

        if (statusElement) {
            statusElement.textContent = 'Testing...';
            statusElement.className = 'status loading';
        }

        if (testBtn) {
            testBtn.disabled = true;
            testBtn.textContent = 'Testing...';
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

            const response = await fetch(`${apiUrl}/ping`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    Accept: 'application/json, text/plain'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                this.showConnectionStatus('✓ Connection successful', true);
                this.saveApiUrl();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            let message = '✗ Connection failed';

            if (error.name === 'AbortError') {
                message += ': Request timeout';
            } else if (error.message.includes('Failed to fetch')) {
                message += ': Network error or CORS issue';
            } else {
                message += `: ${error.message}`;
            }

            this.showConnectionStatus(message, false);
        } finally {
            if (testBtn) {
                testBtn.disabled = false;
                testBtn.textContent = 'Test Connection';
            }
        }
    }

    formatResponse(data, contentType) {
        if (contentType && contentType.includes('application/json')) {
            try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                return JSON.stringify(parsed, null, 2);
            } catch (e) {
                console.warn('Failed to parse JSON response:', e);
                return data;
            }
        }
        return data;
    }

    displayResponse(
        endpoint,
        data,
        isError = false,
        contentType = 'application/json',
        duration = null
    ) {
        const endpointName = endpoint === '/' ? 'root' : endpoint.replace('/', '');
        const responseId = `response-${endpointName}`;
        const responseContainer = document.getElementById(responseId);

        if (!responseContainer) {
            console.error(`Response container not found for endpoint: ${endpoint}`);
            return;
        }

        responseContainer.innerHTML = '';

        // Determine response type class
        let responseClass = 'active';
        if (isError) {
            responseClass += ' error';
        } else if (contentType && contentType.includes('application/json')) {
            responseClass += ' success';
        } else {
            responseClass += ' text';
        }

        responseContainer.className = `response-container ${responseClass}`;

        // Create response header with metadata
        const header = document.createElement('div');
        header.className = 'response-header';

        const statusInfo = document.createElement('div');
        statusInfo.className = 'response-status';
        statusInfo.innerHTML = `
            <span class="content-type">${contentType || 'text/plain'}</span>
            ${duration ? `<span class="duration">${duration}ms</span>` : ''}
        `;
        header.appendChild(statusInfo);

        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-small copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy response to clipboard');
        copyBtn.onclick = () => this.copyToClipboard(data, copyBtn);
        header.appendChild(copyBtn);

        responseContainer.appendChild(header);

        // Create response content
        const pre = document.createElement('pre');
        pre.textContent = this.formatResponse(data, contentType);
        responseContainer.appendChild(pre);

        // Announce to screen readers
        this.announceResponse(endpoint, isError);
    }

    announceResponse(endpoint, isError) {
        const message = isError
            ? `Error response received for ${endpoint}`
            : `Response received for ${endpoint}`;

        // Create temporary announcement element
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Clean up announcement element safely
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    async copyToClipboard(text, button) {
        // Check if Clipboard API is available
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available');
            button.textContent = 'Not supported';
            button.classList.add('error');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('error');
            }, 2000);
            return;
        }

        // Prevent multiple simultaneous copy operations
        if (button.disabled) {
            return;
        }

        const originalText = 'Copy'; // Always restore to default state
        button.disabled = true;

        try {
            // Convert objects to JSON string, otherwise use as-is
            let textToCopy = text;
            if (typeof text === 'object' && text !== null) {
                try {
                    textToCopy = JSON.stringify(text, null, 2);
                } catch (circularError) {
                    // Handle circular references
                    console.warn(
                        'Circular reference detected, using simplified output:',
                        circularError
                    );
                    textToCopy = JSON.stringify(
                        text,
                        (key, value) => {
                            return typeof value === 'object' && value !== null
                                ? '[Circular]'
                                : value;
                        },
                        2
                    );
                }
            } else if (typeof text !== 'string') {
                textToCopy = String(text);
            }

            await navigator.clipboard.writeText(textToCopy);
            button.textContent = 'Copied!';
            button.classList.remove('error');
            button.classList.add('success');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('success');
                button.disabled = false;
            }, 2000);
        } catch (error) {
            console.warn('Could not copy to clipboard:', error);
            button.textContent = 'Copy failed';
            button.classList.remove('success');
            button.classList.add('error');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('error');
                button.disabled = false;
            }, 2000);
        }
    }

    async fetchEndpoint(endpoint, retryCount = 0) {
        if (!this.isOnline) {
            this.displayResponse(endpoint, 'No internet connection', true);
            return;
        }

        if (!this.validateApiUrl()) {
            return;
        }

        const apiUrl = this.getApiUrl();
        const fullUrl = `${apiUrl}${endpoint}`;
        const startTime = performance.now();

        // Show loading state
        const endpointName = endpoint === '/' ? 'root' : endpoint.replace('/', '');
        const responseId = `response-${endpointName}`;
        const responseContainer = document.getElementById(responseId);

        if (responseContainer) {
            responseContainer.className = 'response-container active loading';
            responseContainer.innerHTML = '<div class="loading-spinner"></div> Loading...';
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

            const response = await fetch(fullUrl, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    Accept: 'application/json, text/plain'
                }
            });

            clearTimeout(timeoutId);
            const duration = Math.round(performance.now() - startTime);
            const contentType = response.headers.get('content-type');

            if (response.ok) {
                let data;
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                this.displayResponse(endpoint, data, false, contentType, duration);
            } else {
                const errorText = await response.text();
                this.displayResponse(
                    endpoint,
                    `Error ${response.status}: ${errorText}`,
                    true,
                    null,
                    duration
                );
            }
        } catch (error) {
            const duration = Math.round(performance.now() - startTime);

            if (error.name === 'AbortError') {
                if (retryCount < this.retryAttempts) {
                    // eslint-disable-next-line no-console
                    console.log(`Retrying ${endpoint} (attempt ${retryCount + 1})`);
                    await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return this.fetchEndpoint(endpoint, retryCount + 1);
                }
                this.displayResponse(endpoint, 'Request timeout', true, null, duration);
            } else {
                let message = `Network Error: ${error.message}`;
                if (error.message.includes('Failed to fetch')) {
                    message += ' (Check CORS settings or network connectivity)';
                }
                this.displayResponse(endpoint, message, true, null, duration);
            }
        }
    }

    async fetchAllEndpoints() {
        if (!this.isOnline) {
            this.showConnectionStatus('📶 No internet connection', false);
            return;
        }

        if (!this.validateApiUrl()) {
            return;
        }

        const fetchAllBtn = document.querySelector('.btn-large');
        if (fetchAllBtn) {
            fetchAllBtn.disabled = true;
            fetchAllBtn.textContent = '⏳ Fetching...';
        }

        try {
            for (const endpoint of this.endpoints) {
                await this.fetchEndpoint(endpoint.path);
                // Small delay between requests to avoid overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 300));
            }
        } finally {
            if (fetchAllBtn) {
                fetchAllBtn.disabled = false;
                fetchAllBtn.textContent = '🔄 Fetch All Endpoints';
            }
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global functions for inline event handlers (backward compatibility)
let apiExplorer;

// eslint-disable-next-line no-unused-vars
function fetchEndpoint(endpoint) {
    if (apiExplorer) {
        apiExplorer.fetchEndpoint(endpoint);
    }
}

// eslint-disable-next-line no-unused-vars
function fetchAllEndpoints() {
    if (apiExplorer) {
        apiExplorer.fetchAllEndpoints();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    apiExplorer = new APIExplorer();
});
