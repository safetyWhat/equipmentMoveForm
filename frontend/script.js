// Equipment Move Form with Authentication
// Configuration
const CONFIG = {
    // Azure Function URLs will be set based on authentication
    AZURE_FUNCTION_URL: window.APP_CONFIG.API_URL,
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    MAX_PHOTOS: 10,
    // Photos are resized and re-encoded as JPEG before upload
    PHOTO_MAX_DIMENSION: 2000, // px, longest side
    PHOTO_JPEG_QUALITY: 0.8
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
            
            if (files.length > CONFIG.MAX_PHOTOS) {
                alert(`You can attach up to ${CONFIG.MAX_PHOTOS} photos. You selected ${files.length}.`);
                hasErrors = true;
            }
            
            files.forEach(file => {
                if (file.size > CONFIG.MAX_FILE_SIZE) {
                    alert(`File ${file.name} is too large. Maximum size is 20MB.`);
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
    const photoCount = files.filter(file => file.size > 0).length;
    if (photoCount > CONFIG.MAX_PHOTOS) {
        errors.push(`You can attach up to ${CONFIG.MAX_PHOTOS} photos`);
    }
    if (files.length > 0) {
        for (let file of files) {
            if (file.size === 0) continue; // Skip empty files
            
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                errors.push(`File ${file.name} is too large. Maximum size is 20MB.`);
            }
            
            if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
                errors.push(`File ${file.name} is not a valid image format.`);
            }
        }
    }
    
    return errors;
}

// Load an image file into an <img> element (browsers apply EXIF orientation when drawing it)
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Could not read image ${file.name}`));
        };
        img.src = url;
    });
}

// Resize to PHOTO_MAX_DIMENSION and re-encode as JPEG. Returns the original file
// if it is already a small enough JPEG that re-encoding wouldn't help.
async function compressImage(file) {
    const img = await loadImage(file);
    const scale = Math.min(1, CONFIG.PHOTO_MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // JPEG has no transparency, so fill with white instead of the default black
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    
    const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
            result => result ? resolve(result) : reject(new Error(`Could not compress image ${file.name}`)),
            'image/jpeg',
            CONFIG.PHOTO_JPEG_QUALITY
        );
    });
    
    if (scale === 1 && file.type === 'image/jpeg' && file.size <= blob.size) {
        return file;
    }

    // Canvas drops EXIF, so copy the original's metadata (date taken, GPS, camera) across
    let output = blob;
    if (file.type === 'image/jpeg') {
        try {
            const exifSegment = extractExifSegment(await file.arrayBuffer());
            if (exifSegment) {
                output = await insertExifSegment(blob, exifSegment);
            }
        } catch (error) {
            console.warn(`Could not copy photo metadata for ${file.name}:`, error);
        }
    }

    const jpegName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([output], jpegName, { type: 'image/jpeg' });
}

// Find the EXIF (APP1) segment in a JPEG, including its marker and length bytes.
// Returns a copy with the Orientation tag reset to 1, since the canvas has already
// applied the rotation to the pixels. Returns null if the JPEG has no EXIF.
function extractExifSegment(buffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) return null;

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
        if (view.getUint8(offset) !== 0xFF) return null;
        const marker = view.getUint8(offset + 1);
        if (marker === 0xDA || marker === 0xD9) return null; // Start of image data / end of image

        const length = view.getUint16(offset + 2);
        const isExif = marker === 0xE1 && offset + 10 <= view.byteLength &&
            view.getUint32(offset + 4) === 0x45786966 && view.getUint16(offset + 8) === 0x0000; // "Exif\0\0"
        if (isExif) {
            const segment = new Uint8Array(buffer.slice(offset, offset + 2 + length));
            resetExifOrientation(segment);
            return segment;
        }
        offset += 2 + length;
    }
    return null;
}

// Set the Orientation tag (0x0112) in IFD0 to 1 (normal) in place
function resetExifOrientation(segment) {
    const view = new DataView(segment.buffer, segment.byteOffset, segment.byteLength);
    const tiffStart = 10; // After marker (2), length (2) and "Exif\0\0" (6)
    if (view.byteLength < tiffStart + 8) return;

    const littleEndian = view.getUint16(tiffStart) === 0x4949; // "II"
    const ifd0 = tiffStart + view.getUint32(tiffStart + 4, littleEndian);
    if (ifd0 + 2 > view.byteLength) return;

    const entryCount = view.getUint16(ifd0, littleEndian);
    for (let i = 0; i < entryCount; i++) {
        const entry = ifd0 + 2 + i * 12;
        if (entry + 12 > view.byteLength) return;
        if (view.getUint16(entry, littleEndian) === 0x0112) {
            view.setUint16(entry + 8, 1, littleEndian);
            return;
        }
    }
}

// Insert an EXIF segment straight after the SOI marker of a JPEG blob,
// replacing the JFIF (APP0) header the canvas encoder adds
async function insertExifSegment(jpegBlob, exifSegment) {
    const bytes = new Uint8Array(await jpegBlob.arrayBuffer());
    let rest = 2; // Skip SOI
    if (bytes[2] === 0xFF && bytes[3] === 0xE0) {
        rest = 4 + ((bytes[4] << 8) | bytes[5]);
    }
    return new Blob([bytes.subarray(0, 2), exifSegment, bytes.subarray(rest)], { type: 'image/jpeg' });
}

// Compress files and convert to base64
async function convertFilesToBase64(files) {
    const base64Files = [];
    
    for (let originalFile of files) {
        if (originalFile.size === 0) continue; // Skip empty files
        
        try {
            const file = await compressImage(originalFile);
            console.log(`Photo ${originalFile.name}: ${(originalFile.size / 1024).toFixed(0)}KB -> ${(file.size / 1024).toFixed(0)}KB`);
            
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
            console.error(`Error processing file ${originalFile.name}:`, error);
            throw new Error(`Failed to process file ${originalFile.name}`);
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
            hideElement(loadingSpinner);
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
