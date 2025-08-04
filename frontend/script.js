import { createAuth0Client } from '@auth0/auth0-spa-js';

// Configuration
const CONFIG = {
    // Replace this with your Azure Function URL when deployed
    AZURE_FUNCTION_URL: 'http://localhost:7071/api/submitEquipmentMove',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
};

// DOM Elements
const form = document.getElementById('equipmentForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Form validation
function validateForm(formData) {
    const errors = [];
    
    // Check required fields
    if (!formData.get('userName').trim()) {
        errors.push('Name is required');
    }
    
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
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function hideAllMessages() {
    hideElement(loadingSpinner);
    hideElement(successMessage);
    hideElement(errorMessage);
}

// Submit form data to Azure Function
async function submitToAzureFunction(formData) {
	console.log('Submitting form data to Azure Function:', formData);
    try {
        let token = null;
        
        // Try to get token if user is authenticated
        if (auth0) {
            try {
                const isAuthenticated = await auth0.isAuthenticated();
                if (isAuthenticated) {
                    token = await auth0.getTokenSilently();
                }
            } catch (error) {
                console.warn('Could not get auth token:', error);
            }
        } else {
			console.warn('Auth0 client is not initialized.');
		}

        const files = formData.getAll('photos');
        const base64Files = await convertFilesToBase64(files);

        const data = {
            userName: formData.get('userName').trim(),
            unitNumber: formData.get('unitNumber').trim(),
            moveDate: formData.get('moveDate'),
            equipmentHours: parseFloat(formData.get('equipmentHours')),
            locationFrom: formData.get('locationFrom').trim(),
            locationTo: formData.get('locationTo').trim(),
            notes: formData.get('notes').trim() || '',
            photos: base64Files,
            submittedAt: new Date().toISOString()
        };

        const headers = {
            'Content-Type': 'application/json'
        };
		console.log('Headers:', headers);

        // Only add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(CONFIG.AZURE_FUNCTION_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error submitting to Azure Function:', error);
        throw error;
    }
}

// Handle form submission
async function handleFormSubmit(event) {
	console.log('Form submitted:', event);
    event.preventDefault();
    
    // Hide all messages and show loading
    hideAllMessages();
    showElement(loadingSpinner);
    
    // Disable form
    const submitButton = form.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        const formData = new FormData(form);
        
        // Validate form
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
        }
        
        // Submit to Azure Function
		console.log('Form data before submission:', Object.fromEntries(formData.entries()));
        const result = await submitToAzureFunction(formData);
        
        // Show success message
        hideElement(loadingSpinner);
        showElement(successMessage);
        
        // Reset form
        form.reset();
        
        console.log('Form submitted successfully:', result);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        hideElement(loadingSpinner);
        errorText.textContent = error.message || 'An unexpected error occurred. Please try again.';
        showElement(errorMessage);
        
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Equipment Move';
    }
}

// Auth0 configuration
let auth0 = null;

async function configureAuth0() {
    auth0 = await createAuth0Client({
        domain: 'dev-35fa67pf2b1sd6co.us.auth0.com', // Replace with your Auth0 domain
        clientId: 'rt56olchMDdpVVZdsQDk7vP2Tr1bHK5f', // Replace with your Auth0 client ID
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });

    // Check if the user is returning from Auth0 login
    const query = window.location.search;
	console.log('Query params:', query);
    if (query.includes('code=') && query.includes('state=')) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, '/'); // Remove query params
    }

    // Check if the user is authenticated
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        console.log('User:', user);
        document.getElementById('userEmail').textContent = `Logged in as: ${user.email}`;
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        return;
    }

    // Show login button if not authenticated
    document.getElementById('loginButton').style.display = 'block';
}

async function login() {
    await auth0.loginWithRedirect();
}

async function logout() {
    await auth0.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
}

document.getElementById('loginButton').addEventListener('click', () => {
	login();
	console.log('Login button clicked');
});
document.getElementById('logoutButton').addEventListener('click', logout);

// Initialize Auth0 on page load
window.onload = configureAuth0;

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation for file inputs
    const fileInput = document.getElementById('photos');
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
    
    // Set today's date as default for move date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('moveDate').value = today;
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        convertFilesToBase64,
        submitToAzureFunction
    };
}
console.log(typeof createAuth0Client); // Should log "function"
