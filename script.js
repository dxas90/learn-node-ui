// Get API URL from input
function getApiUrl() {
    return document.getElementById('apiUrl').value.trim();
}

// Show connection status
function showConnectionStatus(message, isSuccess) {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.textContent = message;
    statusElement.className = 'status ' + (isSuccess ? 'success' : 'error');
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'status';
    }, 5000);
}

// Test connection to API
async function testConnection() {
    const apiUrl = getApiUrl();
    const statusElement = document.getElementById('connectionStatus');
    
    statusElement.textContent = 'Testing...';
    statusElement.className = 'status loading';
    
    try {
        const response = await fetch(`${apiUrl}/ping`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            showConnectionStatus('✓ Connection successful', true);
        } else {
            showConnectionStatus(`✗ Connection failed (${response.status})`, false);
        }
    } catch (error) {
        showConnectionStatus(`✗ Connection failed: ${error.message}`, false);
    }
}

// Format response data
function formatResponse(data, contentType) {
    if (contentType && contentType.includes('application/json')) {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return data;
        }
    }
    return data;
}

// Display response in the UI
function displayResponse(endpoint, data, isError = false, contentType = 'application/json') {
    const responseId = `response-${endpoint.replace('/', '')}`;
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
    
    const pre = document.createElement('pre');
    pre.textContent = formatResponse(data, contentType);
    responseContainer.appendChild(pre);
}

// Fetch endpoint data
async function fetchEndpoint(endpoint) {
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${endpoint}`;
    
    // Show loading state
    const responseId = `response-${endpoint.replace('/', '')}`;
    const responseContainer = document.getElementById(responseId);
    responseContainer.className = 'response-container active loading';
    responseContainer.innerHTML = '<div class="loading-spinner"></div> Loading...';
    
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain'
            }
        });
        
        const contentType = response.headers.get('content-type');
        
        if (response.ok) {
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            displayResponse(endpoint, data, false, contentType);
        } else {
            const errorText = await response.text();
            displayResponse(endpoint, `Error ${response.status}: ${errorText}`, true);
        }
    } catch (error) {
        displayResponse(endpoint, `Network Error: ${error.message}`, true);
    }
}

// Fetch all endpoints sequentially
async function fetchAllEndpoints() {
    const endpoints = ['/', '/ping', '/healthz', '/info'];
    
    for (const endpoint of endpoints) {
        await fetchEndpoint(endpoint);
        // Small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Test connection button
    document.getElementById('testConnection').addEventListener('click', testConnection);
    
    // Enter key in API URL input
    document.getElementById('apiUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            testConnection();
        }
    });
    
    // Optional: Auto-test connection on page load
    // Uncomment the line below if you want to test connection automatically
    // testConnection();
});
