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
    try {
        // Convert form data to JSON object
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
        
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Add authentication header if available
        if (window.AuthUtils && window.AuthUtils.getAuthToken()) {
            headers['Authorization'] = `Bearer ${window.AuthUtils.getAuthToken()}`;
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
