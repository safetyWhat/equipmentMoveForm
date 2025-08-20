const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
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
    
    // Add validation for location fields
    if (!data.locationFrom || typeof data.locationFrom !== 'string' || !data.locationFrom.trim()) {
        errors.push('locationFrom is required and must be a non-empty string');
    }
    
    if (!data.locationTo || typeof data.locationTo !== 'string' || !data.locationTo.trim()) {
        errors.push('locationTo is required and must be a non-empty string');
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
			locationFrom: data.locationFrom.trim(),
			locationTo: data.locationTo.trim(),
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
        'Access-Control-Allow-Origin': '*', // For testing - restrict this in production
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    };
}

const AUTH0_DOMAIN = 'dev-35fa67pf2b1sd6co.us.auth0.com'; // Replace with your Auth0 domain
const AUTH0_AUDIENCE = 'https://equipment-move-api'; // Replace with your Auth0 API identifier (not client ID)

// Create JWKS client for Auth0
const jwks = jwksClient({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            {
                audience: AUTH0_AUDIENCE,
                issuer: `https://${AUTH0_DOMAIN}/`,
                algorithms: ['RS256']
            },
            (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            }
        );
    });
}

app.http('submitEquipmentMove', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Equipment Move Form submission received');
        
        // Handle CORS preflight request FIRST
        if (request.method === 'OPTIONS') {
            context.log('CORS preflight request received');
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }
        
        // Handle GET requests for testing connectivity
        if (request.method === 'GET') {
            context.log('GET request received - returning status');
            return {
                status: 200,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'Azure Function is running',
                    timestamp: new Date().toISOString(),
                    authRequired: true // Set to true when auth is enabled
                })
            };
        }
        
        // Authentication check (now optional for testing)
        context.log('All Headers:', request.headers);
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        context.log('Authorization Header:', authHeader ? 'Present' : 'Not present');
        
        let authenticatedUser = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            
            // Basic token format validation
            if (!token || token.split('.').length !== 3) {
                context.log('Invalid token format - not a valid JWT structure');
                return { 
                    status: 401, 
                    headers: {
                        ...getCorsHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Invalid token format' })
                };
            }
            
            try {
                const decoded = await verifyToken(token);
                context.log('Authenticated user:', decoded);
                authenticatedUser = decoded;
            } catch (err) {
                context.log('Token verification failed:', err.message);
                return { 
                    status: 401, 
                    headers: {
                        ...getCorsHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        error: 'Invalid or expired token', 
                        details: process.env.NODE_ENV === 'development' ? err.message : 'Please log in again'
                    })
                };
            }
        } else if (authHeader) {
            // Invalid authorization header format
            context.log('Invalid authorization header format');
            return { 
                status: 401, 
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid authorization header format. Expected: Bearer <token>' })
            };
        } else {
            context.log('No authorization header provided - proceeding without authentication');
            // For production, uncomment the next lines to require authentication:
            return { 
                status: 401, 
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Authorization header required' })
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
                context.log('Failed to parse request body:', parseError);
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
				locationFrom: requestData.locationFrom,
				locationTo: requestData.locationTo,
                photosCount: requestData.photos?.length || 0
            });
            
            // Validate the request data
            const validationErrors = validateRequestData(requestData);
            if (validationErrors.length > 0) {
                context.log('Validation errors:', validationErrors);
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
                    context.log('Power Automate error:', powerAutomateError);
                    // Continue processing even if Power Automate fails
                    // You might want to store this in a queue for retry
                }
            } else {
                context.log('Power Automate URL not configured - skipping webhook call');
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
            context.log('Unexpected error:', error);
            
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
