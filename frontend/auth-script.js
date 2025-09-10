// Authentication Page Script

// Initialize auth manager
const auth = new AuthManager();

// DOM elements
let loginForm, registerForm, errorMessage, successMessage, loading, authTabs;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
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
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle tab switching
function handleTabSwitch(event) {
    const targetTab = event.target.dataset.tab;
    
    // Update active tab
    authTabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show corresponding form
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${targetTab}Form`).classList.add('active');
    
    // Clear messages
    hideMessages();
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
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    // Basic validation
    if (!email || !password) {
        showError('Email and password are required');
        return;
    }
    
    showLoading();
    hideMessages();
    
    try {
        const result = await auth.login(email, password, rememberMe);
        
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

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(registerForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showError('All fields are required');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    showLoading();
    hideMessages();
    
    try {
        const result = await auth.register(email, password, name, rememberMe);
        
        hideLoading();
        
        if (result.success) {
            showSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError(result.error || 'Registration failed');
        }
    } catch (error) {
        hideLoading();
        console.error('Registration error:', error);
        showError('Network error: ' + error.message);
    }
}
