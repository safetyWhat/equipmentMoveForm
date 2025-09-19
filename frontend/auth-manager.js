// Frontend Authentication Manager for Equipment Move Form
class AuthManager {
    constructor(baseUrl = window.APP_CONFIG.API_URL) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('authToken');
        this.user = null;
        
        // Auto-validate token on initialization
        if (this.token) {
            this.validateToken();
        }
    }
    
    // Register new user (Admin only)
    async registerUser(username, password, name, type = 'user') {
        if (!this.isAdmin()) {
            throw new Error('Access denied. Admin privileges required.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    type
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('User registration error:', error);
            return { success: false, error: 'Network error during user registration' };
        }
    }
    
    // Login user
    async login(username, password, rememberMe = false) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    rememberMe
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Debug log to check user data
                console.log('User from login:', data.user);
                this.setAuthData(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error during login' };
        }
    }
    
    // Validate current token
    async validateToken() {
        if (!this.token) return false;
        
        try {
            const response = await fetch(`${this.baseUrl}/validateToken`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok && data.valid) {
				// Check if user object has all required fields
            	console.log('User from validateToken:', data.user); // Debug log
                this.user = data.user;
                return true;
            } else {
                this.logout(); // Clear invalid token
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.logout();
            return false;
        }
    }
    
    // Submit equipment move form
    async submitEquipmentMove(formData) {
        if (!this.token) {
            throw new Error('Not authenticated. Please login first.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/submitEquipmentMove`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.status === 401) {
                // Token expired or invalid
                this.logout();
                throw new Error('Session expired. Please login again.');
            }
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error, details: data.details };
            }
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }
    
    // Set authentication data
    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { authenticated: true, user }
        }));
    }
    
    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { authenticated: false, user: null }
        }));
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }
    
    // Get current user
    getCurrentUser() {
        return this.user;
    }
    
    // Check if current user is admin
    isAdmin() {
        return this.user && this.user.type === 'admin';
    }
    
    // Get all users (Admin only)
    async getUsers() {
        if (!this.isAdmin()) {
            throw new Error('Access denied. Admin privileges required.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/getUsers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, users: data.users };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: 'Network error while fetching users' };
        }
    }
    
    // Update user (Admin only)
    async updateUser(userId, updates) {
        if (!this.isAdmin()) {
            throw new Error('Access denied. Admin privileges required.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    userId,
                    ...updates
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Network error while updating user' };
        }
    }
    
    // Delete user (Admin only)
    async deleteUser(userId) {
        if (!this.isAdmin()) {
            throw new Error('Access denied. Admin privileges required.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/deleteUser?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, deletedUser: data.deletedUser };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Delete user error:', error);
            return { success: false, error: 'Network error while deleting user' };
        }
    }
    
    // Get auth headers for manual requests
    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Usage Examples:
/*
// Initialize auth manager
const auth = new AuthManager();

// Register
const registerResult = await auth.register('user@example.com', 'password123', 'John Doe');
if (registerResult.success) {
    console.log('Registration successful:', registerResult.user);
} else {
    console.error('Registration failed:', registerResult.error);
}

// Login
const loginResult = await auth.login('user@example.com', 'password123', true); // rememberMe = true
if (loginResult.success) {
    console.log('Login successful:', loginResult.user);
} else {
    console.error('Login failed:', loginResult.error);
}

// Submit form
try {
    const result = await auth.submitEquipmentMove({
        userName: 'John Doe',
        unitNumber: 'EQ-001',
        moveDate: '2025-09-10',
        equipmentHours: 100,
        locationFrom: 'Warehouse A',
        locationTo: 'Job Site B',
        notes: 'Regular maintenance move'
    });
    
    if (result.success) {
        console.log('Form submitted successfully:', result.data);
    } else {
        console.error('Form submission failed:', result.error);
    }
} catch (error) {
    console.error('Error:', error.message);
}

// Listen for auth state changes
window.addEventListener('authStateChanged', (event) => {
    const { authenticated, user } = event.detail;
    if (authenticated) {
        console.log('User logged in:', user);
        // Update UI to show authenticated state
    } else {
        console.log('User logged out');
        // Update UI to show login form
    }
});
*/

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
