// Authentication Page Script

// Initialize auth manager
const auth = new AuthManager();

// DOM elements
let loginForm, errorMessage, successMessage, loading, authTabs;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    loginForm = document.getElementById('loginForm');
    errorMessage = document.getElementById('errorMessage');
    successMessage = document.getElementById('successMessage');
    loading = document.getElementById('loading');
    authTabs = document.querySelectorAll('.auth-tab');
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if already authenticated
    checkExistingAuth();
});

// Set up event listeners
function setupEventListeners() {
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Message helpers
function showError(message) {
    hideMessages();
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function showSuccess(message) {
    hideMessages();
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

// Check if already authenticated
async function checkExistingAuth() {
    if (auth.token) {
        const isValid = await auth.validateToken();
        if (isValid) {
            window.location.href = 'index.html';
        }
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    // Basic validation
    if (!username || !password) {
        showError('Username and password are required');
        return;
    }
    
    showLoading();
    hideMessages();
    
    try {
        const result = await auth.login(username, password, rememberMe);
        
        hideLoading();
        
        if (result.success) {
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError(result.error || 'Login failed');
        }
    } catch (error) {
        hideLoading();
        console.error('Login error:', error);
        showError('Network error: ' + error.message);
    }
}


