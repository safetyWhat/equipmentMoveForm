// Configuration
const AUTH_CONFIG = {
    API_BASE_URL: 'http://localhost:7071/api', // Update for production
    TOKEN_KEY: 'equipmentMoveAuthToken',
    USER_KEY: 'equipmentMoveUser'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
const adminSection = document.getElementById('adminSection');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const createUserForm = document.getElementById('createUserForm');
const usersList = document.getElementById('usersList');

// Show/hide elements
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    showElement(errorMessage);
    hideElement(successMessage);
}

function showSuccess(message) {
    successMessage.textContent = message;
    showElement(successMessage);
    hideElement(errorMessage);
}

function hideMessages() {
    hideElement(errorMessage);
    hideElement(successMessage);
}

// Authentication functions
function getAuthToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
}

function setAuthToken(token) {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
}

function removeAuthToken() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
}

function getUser() {
    const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

function setUser(user) {
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
}

function isAuthenticated() {
    const token = getAuthToken();
    const user = getUser();
    
    if (!token || !user) {
        console.log('Authentication check failed: No token or user found');
        return false;
    }
    
    try {
        // Basic JWT expiration check
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        console.log('Token debug info:', {
            issuedAt: payload.iat,
            expiresAt: payload.exp,
            currentTime: currentTime,
            timeUntilExpiry: payload.exp - currentTime,
            tokenAge: currentTime - payload.iat
        });
        
        if (payload.exp < currentTime) {
            console.log('Token expired, removing from storage');
            removeAuthToken();
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Token validation error:', error);
        removeAuthToken();
        return false;
    }
}

// API functions
async function makeAuthenticatedRequest(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            removeAuthToken();
            updateUI();
            throw new Error('Session expired. Please log in again.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        if (data.success) {
            setAuthToken(data.data.token);
            setUser(data.data.user);
            return data.data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function getCurrentUser() {
    try {
        const data = await makeAuthenticatedRequest('/me');
        return data.data.user;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
}

async function createNewUser(email, password, role) {
    try {
        const data = await makeAuthenticatedRequest('/createUser', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        return data.data.user;
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
}

async function getAllUsers() {
    try {
        const data = await makeAuthenticatedRequest('/listUsers');
        return data.data.users;
    } catch (error) {
        console.error('Get users error:', error);
        throw error;
    }
}

// UI functions
function updateUI() {
    if (isAuthenticated()) {
        const user = getUser();
        hideElement(loginForm);
        showElement(userInfo);
        
        // Update user info
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userRole').textContent = user.role;
        document.getElementById('loginTime').textContent = new Date().toLocaleString();
        
        // Show admin section if user is admin
        if (user.role === 'ADMIN') {
            showElement(adminSection);
        } else {
            hideElement(adminSection);
        }
    } else {
        showElement(loginForm);
        hideElement(userInfo);
        hideElement(adminSection);
    }
}

function logout() {
    removeAuthToken();
    updateUI();
    showSuccess('Logged out successfully');
}

function goToMainApp() {
    window.location.href = 'index.html';
}

// Admin functions
function showCreateUserForm() {
    showElement(createUserForm);
}

function hideCreateUserForm() {
    hideElement(createUserForm);
    // Clear form
    document.getElementById('newUserEmail').value = '';
    document.getElementById('newUserPassword').value = '';
    document.getElementById('newUserRole').value = 'USER';
}

async function createUser() {
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        const user = await createNewUser(email, password, role);
        showSuccess(`User created successfully: ${user.email}`);
        hideCreateUserForm();
        
        // Refresh users list if it's visible
        if (!usersList.classList.contains('hidden')) {
            await loadUsers();
        }
    } catch (error) {
        showError(error.message);
    }
}

async function loadUsers() {
    try {
        const users = await getAllUsers();
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found</p>';
        } else {
            usersList.innerHTML = users.map(user => `
                <div class="user-item">
                    <strong>${user.email}</strong>
                    <span class="user-role ${user.role.toLowerCase()}">${user.role}</span>
                    <br>
                    <small>Created: ${new Date(user.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
        
        showElement(usersList);
    } catch (error) {
        showError(error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        hideMessages();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await login(email, password);
            updateUI();
            showSuccess('Login successful!');
        } catch (error) {
            showError(error.message);
        }
    });
    
    // Check authentication status on page load
    if (isAuthenticated()) {
        // Verify token is still valid by making an API call
        getCurrentUser().catch(error => {
            console.error('Token validation failed:', error);
            logout();
        });
    }
});

// Export for use in other files
window.AuthUtils = {
    isAuthenticated,
    getAuthToken,
    getUser,
    makeAuthenticatedRequest,
    logout
};
