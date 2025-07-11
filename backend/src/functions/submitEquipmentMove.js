const { app } = require('@azure/functions');

// Configuration
const CONFIG = {
    POWER_AUTOMATE_WEBHOOK_URL: process.env.POWER_AUTOMATE_WEBHOOK_URL || '',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
};

// Validation functions
function validateRequestData(data) {
    const errors = [];
    
    // Check required fields
    if (!data.userName || typeof data.userName !== 'string' || !data.userName.trim()) {
        errors.push('userName is required and must be a non-empty string');
    }
    
    if (!data.unitNumber || typeof data.unitNumber !== 'string' || !data.unitNumber.trim()) {
        errors.push('unitNumber is required and must be a non-empty string');
    }
    
    if (!data.moveDate) {
        errors.push('moveDate is required');
    } else {
        const date = new Date(data.moveDate);
        if (isNaN(date.getTime())) {
            errors.push('moveDate must be a valid date');
        }
    }
    
    if (data.equipmentHours === undefined || data.equipmentHours === null) {
        errors.push('equipmentHours is required');
    } else if (typeof data.equipmentHours !== 'number' || data.equipmentHours < 0) {
        errors.push('equipmentHours must be a non-negative number');
    }
    
    // Validate photos array if present
    if (data.photos && Array.isArray(data.photos)) {
        data.photos.forEach((photo, index) => {
            if (!photo.name || !photo.type || !photo.data) {
                errors.push(`Photo ${index + 1} is missing required fields (name, type, data)`);
            }
            
            if (photo.size && photo.size > CONFIG.MAX_FILE_SIZE) {
                errors.push(`Photo ${photo.name} exceeds maximum file size (10MB)`);
            }
            
            if (photo.type && !CONFIG.ALLOWED_FILE_TYPES.includes(photo.type)) {
                errors.push(`Photo ${photo.name} has invalid file type. Allowed types: ${CONFIG.ALLOWED_FILE_TYPES.join(', ')}`);
            }
        });
    }
    
    return errors;
}

// Format data for Power Automate
function formatDataForPowerAutomate(data) {
    return {
        submissionId: generateSubmissionId(),
        timestamp: new Date().toISOString(),
        userDetails: {
            name: data.userName.trim(),
        },
        equipmentDetails: {
            unitNumber: data.unitNumber.trim(),
            moveDate: data.moveDate,
            hours: data.equipmentHours,
            notes: data.notes?.trim() || ''
        },
        photos: data.photos || [],
        metadata: {
            submittedAt: data.submittedAt || new Date().toISOString(),
            source: 'Equipment Move Form',
            version: '1.0'
        }
    };
}

// Generate unique submission ID
function generateSubmissionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `EM-${timestamp}-${random}`.toUpperCase();
}

// Send data to Power Automate
async function sendToPowerAutomate(formattedData) {
    if (!CONFIG.POWER_AUTOMATE_WEBHOOK_URL || CONFIG.POWER_AUTOMATE_WEBHOOK_URL === 'https://your-power-automate-flow-url-here') {
        throw new Error('Power Automate webhook URL is not configured');
    }
    
    try {
        const response = await fetch(CONFIG.POWER_AUTOMATE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Power Automate request failed: ${response.status} ${errorText}`);
        }
        
        const result = await response.text();
        return result;
        
    } catch (error) {
        console.error('Error sending to Power Automate:', error);
        throw new Error(`Failed to send data to Power Automate: ${error.message}`);
    }
}

// CORS headers
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    };
}

app.http('submitEquipmentMove', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Equipment Move Form submission received');
        
        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }
        
        // Only allow POST for actual submissions
        if (request.method !== 'POST') {
            return {
                status: 405,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Method not allowed. Use POST to submit form data.'
                })
            };
        }
        
        try {
            // Parse request body
            let requestData;
            try {
                const rawBody = await request.text();
                requestData = JSON.parse(rawBody);
            } catch (parseError) {
                context.log.error('Failed to parse request body:', parseError);
                return {
                    status: 400,
                    headers: {
                        ...getCorsHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        error: 'Invalid JSON in request body',
                        details: parseError.message
                    })
                };
            }
            
            context.log('Parsed request data:', {
                userName: requestData.userName,
                unitNumber: requestData.unitNumber,
                moveDate: requestData.moveDate,
                equipmentHours: requestData.equipmentHours,
                photosCount: requestData.photos?.length || 0
            });
            
            // Validate the request data
            const validationErrors = validateRequestData(requestData);
            if (validationErrors.length > 0) {
                context.log.error('Validation errors:', validationErrors);
                return {
                    status: 400,
                    headers: {
                        ...getCorsHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        error: 'Validation failed',
                        details: validationErrors
                    })
                };
            }
            
            // Format data for Power Automate
            const formattedData = formatDataForPowerAutomate(requestData);
            context.log('Formatted data for Power Automate:', {
                submissionId: formattedData.submissionId,
                timestamp: formattedData.timestamp
            });
            
            // Send to Power Automate (if URL is configured)
            let powerAutomateResult = null;
            if (CONFIG.POWER_AUTOMATE_WEBHOOK_URL && CONFIG.POWER_AUTOMATE_WEBHOOK_URL !== 'https://your-power-automate-flow-url-here') {
                try {
                    powerAutomateResult = await sendToPowerAutomate(formattedData);
                    context.log('Successfully sent to Power Automate');
                } catch (powerAutomateError) {
                    context.log.error('Power Automate error:', powerAutomateError);
                    // Continue processing even if Power Automate fails
                    // You might want to store this in a queue for retry
                }
            } else {
                context.log.warn('Power Automate URL not configured - skipping webhook call');
            }
            
            // Return success response
            const response = {
                success: true,
                submissionId: formattedData.submissionId,
                timestamp: formattedData.timestamp,
                message: 'Equipment move form submitted successfully',
                powerAutomateStatus: powerAutomateResult ? 'sent' : 'skipped'
            };
            
            context.log('Form submission completed successfully:', response);
            
            return {
                status: 200,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(response)
            };
            
        } catch (error) {
            context.log.error('Unexpected error:', error);
            
            return {
                status: 500,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Internal server error',
                    message: 'An unexpected error occurred while processing your request',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        }
    }
});
