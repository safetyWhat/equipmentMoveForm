// Equipment Move Form with Authentication
// Configuration
const CONFIG = {
    // Azure Function URLs will be set based on authentication
    AZURE_FUNCTION_URL: window.APP_CONFIG.API_URL,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
};

// Global auth manager instance
let authManager;

// DOM Elements
const form = document.getElementById('equipmentForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Authentication UI elements
const authStatus = document.getElementById('authStatus');
const authLoading = document.getElementById('authLoading');
const userInfo = document.getElementById('userInfo');
const logoutButton = document.getElementById('logoutButton');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize auth manager
    authManager = new AuthManager();
    
    // Check authentication status
    await checkAuthStatus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Listen for auth state changes
    window.addEventListener('authStateChanged', handleAuthStateChange);
});

// Check authentication status
async function checkAuthStatus() {
    if (authLoading) {
        authLoading.style.display = 'block';
    }
    
    // EXPLICITLY await validation before proceeding
    const isValid = await authManager.validateToken();
    
    if (authLoading) {
        authLoading.style.display = 'none';
    }
    
    if (!isValid) {
        window.location.href = 'auth.html';
        return;
    }
    
    updateAuthUI(authManager.getCurrentUser());
}

// Handle auth state changes
function handleAuthStateChange(event) {
    const { authenticated, user } = event.detail;
    
    if (!authenticated) {
        // Redirect to auth page
        window.location.href = 'auth.html';
    } else {
        updateAuthUI(user);
    }
}

// Update authentication UI
function updateAuthUI(user) {
	console.log('Authenticated user:', user);
    if (user && userInfo && authStatus && authLoading) {
        userInfo.textContent = `Welcome, ${user.name}`;
        authStatus.style.display = 'flex';
        authLoading.style.display = 'none';
        
        // Show admin button for admin users
        const adminButton = document.getElementById('adminButton');
        if (adminButton && user.type === 'admin') {
            adminButton.style.display = 'block';
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Add real-time validation for file inputs
    const fileInput = document.getElementById('photos');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            const files = Array.from(event.target.files);
            let hasErrors = false;
            
            files.forEach(file => {
                if (file.size > CONFIG.MAX_FILE_SIZE) {
                    alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                    hasErrors = true;
                }
                
                if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
                    alert(`File ${file.name} is not a valid image format. Please select JPEG, PNG, or GIF files.`);
                    hasErrors = true;
                }
            });
            
            if (hasErrors) {
                event.target.value = ''; // Clear the input
            }
        });
    }
    
    // Set today's date as default for move date
    const moveDateInput = document.getElementById('moveDate');
    if (moveDateInput) {
        const today = new Date().toISOString().split('T')[0];
        moveDateInput.value = today;
    }
}

// Handle logout
function handleLogout() {
    authManager.logout();
    // Auth state change event will handle redirect
}

// Submit form data using AuthManager
async function submitFormWithAuth(formData) {
    try {
        // Convert FormData to plain object
        const dataObject = {};
        
        // Extract form fields
        for (const [key, value] of formData.entries()) {
            if (key !== 'photos') {
                dataObject[key] = value.trim ? value.trim() : value;
            }
        }
        
        // Inject authenticated user's name
        const currentUser = authManager.getCurrentUser();
        if (currentUser && currentUser.name) {
            dataObject.userName = currentUser.name;
        } else {
            throw new Error('User authentication required - no user name available');
        }
        
        // Convert files to base64
        const files = formData.getAll('photos');
        if (files && files.length > 0) {
            dataObject.photos = await convertFilesToBase64(files);
        }
        
        // Parse numeric fields
        if (dataObject.equipmentHours) {
            dataObject.equipmentHours = parseFloat(dataObject.equipmentHours);
        }
        
        // Add debug logging
        console.log('Submitting data:', {
            ...dataObject,
            photos: dataObject.photos ? `${dataObject.photos.length} photos` : 'no photos'
        });
        
        // Submit using auth manager
        const result = await authManager.submitEquipmentMove(dataObject);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Form submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        throw error;
    }
}

// Form validation (updated to not check for userName since it's injected)
function validateForm(formData) {
    const errors = [];
    
    // userName is no longer required from form since it's injected
    
    if (!formData.get('unitNumber').trim()) {
        errors.push('Unit number is required');
    }
    
    if (!formData.get('moveDate')) {
        errors.push('Move date is required');
    }
    
    if (!formData.get('equipmentHours') || formData.get('equipmentHours') < 0) {
        errors.push('Valid equipment hours are required');
    }
    
    // Validate files
    const files = formData.getAll('photos');
    if (files.length > 0) {
        for (let file of files) {
            if (file.size === 0) continue; // Skip empty files
            
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                errors.push(`File ${file.name} is too large. Maximum size is 10MB.`);
            }
            
            if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
                errors.push(`File ${file.name} is not a valid image format.`);
            }
        }
    }
    
    return errors;
}

// Convert files to base64
async function convertFilesToBase64(files) {
    const base64Files = [];
    
    for (let file of files) {
        if (file.size === 0) continue; // Skip empty files
        
        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Remove the data URL prefix to get just the base64 string
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            base64Files.push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64
            });
        } catch (error) {
            console.error(`Error converting file ${file.name} to base64:`, error);
            throw new Error(`Failed to process file ${file.name}`);
        }
    }
    
    return base64Files;
}

// Show/hide elements
function showElement(element) {
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function hideAllMessages() {
    hideElement(loadingSpinner);
    hideElement(successMessage);
    hideElement(errorMessage);
}

// Handle form submission (updated to use authentication)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Check authentication first
    if (!authManager.isAuthenticated()) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Hide all messages and show loading
    hideAllMessages();
    showElement(loadingSpinner);
    
    // Disable form
    const submitButton = form.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        const formData = new FormData(form);
        
        // Validate form
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
        }
        
        // Submit to Azure Function with authentication
        const result = await submitFormWithAuth(formData);
        
        // Show success message
        hideElement(loadingSpinner);
        showElement(successMessage);
        
        // Update success message with submission details
        if (result && result.submissionId) {
            const successText = successMessage.querySelector('p');
            if (successText) {
                successText.textContent = `Form submitted successfully! Submission ID: ${result.submissionId}`;
            }
        }
        
        // Reset form
        form.reset();
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('moveDate').value = today;
        
        console.log('Form submitted successfully:', result);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Handle authentication errors
        if (error.message.includes('Session expired') || error.message.includes('Not authenticated')) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Show error message
        hideElement(loadingSpinner);
        if (errorText) {
            errorText.textContent = error.message || 'An unexpected error occurred. Please try again.';
        }
        showElement(errorMessage);
        
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Add global error handler for authentication errors
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('Session expired') || 
         event.reason.message.includes('Not authenticated'))) {
        event.preventDefault();
        window.location.href = 'auth.html';
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        convertFilesToBase64,
        submitFormWithAuth
    };
}
