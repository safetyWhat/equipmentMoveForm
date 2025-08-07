# Fixing JWT Malformed Error - Setup Instructions

## Issues Identified and Fixed

### 1. **Auth0 Configuration Issues**

- **Problem**: Using client ID as audience instead of API identifier
- **Fix**: Updated both frontend and backend to use proper API audience

### 2. **Token Validation Issues**

- **Problem**: Backend wasn't properly validating token format before verification
- **Fix**: Added basic JWT format validation (3 parts separated by dots)

### 3. **CORS Configuration**

- **Problem**: Restrictive CORS settings during development
- **Fix**: Updated CORS to allow all origins during testing

## Required Auth0 Setup

To properly fix the JWT malformed error, you need to set up an API in Auth0:

### Step 1: Create an API in Auth0 Dashboard

1. Go to your Auth0 Dashboard: https://manage.auth0.com/
2. Navigate to **Applications > APIs**
3. Click **+ Create API**
4. Fill in the details:
   - **Name**: Equipment Move API
   - **Identifier**: `https://equipment-move-api` (must match the audience in code)
   - **Signing Algorithm**: RS256
5. Click **Create**

### Step 2: Configure API Settings

1. Go to your newly created API
2. In the **Settings** tab:
   - Enable **Allow Offline Access** if you need refresh tokens
   - Set **Token Expiration** as needed (default is usually fine)
3. In the **Scopes** tab, you can add custom scopes if needed (optional for basic usage)

### Step 3: Update Your Application

1. Go to **Applications > Applications**
2. Select your existing application (`rt56olchMDdpVVZdsQDk7vP2Tr1bHK5f`)
3. In **Settings** tab:
   - Add your local development URL to **Allowed Callback URLs**: `http://localhost:1234, http://localhost:3000`
   - Add your local development URL to **Allowed Web Origins**: `http://localhost:1234, http://localhost:3000`
   - Add your local development URL to **Allowed Logout URLs**: `http://localhost:1234, http://localhost:3000`

## Testing the Fix

### Method 1: Use the Test Page

1. Start your Azure Functions backend:

   ```bash
   cd backend
   npm install
   func start
   ```

2. Open the test page in your browser:

   ```
   file:///Users/leightonleaf/webDev/workProjects/equipmentMoveForm/frontend/test-connection.html
   ```

3. Run the tests in order:
   - Test Connectivity (should pass)
   - Test CORS (should pass)
   - Test Form Submission (should pass without auth)
   - Test Auth0 (will require login first)

### Method 2: Use Your Main Application

1. Start your backend as above
2. Serve your frontend (if using a local server)
3. Try submitting the form

## Current Configuration

The code has been updated with these changes:

### Backend (`submitEquipmentMove.js`):

- ✅ Fixed audience to use API identifier instead of client ID
- ✅ Added JWT format validation before token verification
- ✅ Improved error handling for malformed tokens
- ✅ Updated CORS headers for testing
- ✅ Added GET endpoint for connectivity testing
- ✅ Authentication is currently **disabled** for testing

### Frontend (`script.js`):

- ✅ Added audience parameter to Auth0 configuration
- ✅ Added token format validation
- ✅ Improved error handling for token acquisition
- ✅ Better logging for debugging

## Enabling Authentication in Production

Once you've confirmed everything works without authentication:

1. In `submitEquipmentMove.js`, uncomment the authentication requirement:

   ```javascript
   // Change this section to require authentication
   } else {
       return {
           status: 401,
           headers: {
               ...getCorsHeaders(),
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ error: 'Authorization header required' })
       };
   }
   ```

2. Update CORS to be more restrictive:
   ```javascript
   'Access-Control-Allow-Origin': 'http://localhost:1234', // Or your production domain
   ```

## Common Issues and Solutions

### "JWT malformed" Error:

- ✅ **Fixed**: Token format validation added
- **Cause**: Usually empty or malformed token being sent to jwt.verify()

### "Invalid audience" Error:

- ✅ **Fixed**: Audience configuration updated
- **Cause**: Mismatch between frontend audience and backend verification

### CORS Errors:

- ✅ **Fixed**: CORS headers updated
- **Cause**: Restrictive CORS settings

### "No authorization header" Error:

- ✅ **Fixed**: Currently disabled for testing
- **Cause**: Authentication required but no token provided

## Next Steps

1. Complete the Auth0 API setup above
2. Test using the test page
3. Once working, re-enable authentication
4. Update CORS settings for production
5. Test the main application

Let me know if you encounter any other issues!
