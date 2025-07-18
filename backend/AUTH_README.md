# Authentication System Documentation

## Overview

This authentication system provides secure JWT-based authentication for the Equipment Move Form application. It includes user management, password hashing, and role-based authorization.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Role-Based Access**: USER and ADMIN roles
- **Admin-Only User Creation**: No public signup
- **Database Integration**: Prisma ORM with PostgreSQL
- **Azure Functions**: Serverless deployment ready

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. **Create Prisma configuration:**

   ```bash
   npx prisma init
   ```

2. **Update your `.env` file:**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/equipmentMoveForm?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-minimum-256-bits"
   JWT_EXPIRES_IN="7d"
   ```

3. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

### 3. Create First Admin User

Use the CLI script to create your first admin user:

```bash
node createUser.cli.js --email admin@example.com --password AdminPass123! --role ADMIN
```

## API Endpoints

### Authentication

#### POST /api/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "UserPass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET /api/me

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "tokenInfo": {
      "exp": 1672531200,
      "iat": 1672444800
    }
  }
}
```

### User Management (Admin Only)

#### POST /api/createUser

Create a new user (requires ADMIN role).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "NewUserPass123!",
  "role": "USER"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "new-user-id",
      "email": "newuser@example.com",
      "role": "USER",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET /api/listUsers

List all users (requires ADMIN role).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user-id-1",
        "email": "user1@example.com",
        "role": "USER",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

## Frontend Integration

### 1. Login Function

```javascript
async function login(email, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token in localStorage
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
```

### 2. Authenticated API Calls

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login.html";
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
```

### 3. Check Authentication Status

```javascript
function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return false;
  }

  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      // Token expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}
```

### 4. Logout Function

```javascript
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
```

## Security Considerations

### Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&\*)

### JWT Security

- Use strong, random secrets (minimum 256 bits)
- Set appropriate expiration times
- Store securely on client-side
- Validate on every request

### Database Security

- Use parameterized queries (handled by Prisma)
- Hash passwords with bcrypt
- Validate all inputs
- Use connection pooling

### Environment Variables

Never commit these values to version control:

```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret-key"
```

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Password validation failed",
  "errors": ["Password must be at least 8 characters long"]
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### 409 Conflict

```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Testing

### Manual Testing with curl

1. **Create a user:**

   ```bash
   curl -X POST https://your-app.azurewebsites.net/api/createUser \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{"email":"test@example.com","password":"TestPass123!","role":"USER"}'
   ```

2. **Login:**

   ```bash
   curl -X POST https://your-app.azurewebsites.net/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPass123!"}'
   ```

3. **Get user profile:**
   ```bash
   curl -X GET https://your-app.azurewebsites.net/api/me \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Deployment

### Azure Functions

1. **Update local.settings.json:**

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "DATABASE_URL": "your-postgresql-connection-string",
       "JWT_SECRET": "your-production-jwt-secret"
     }
   }
   ```

2. **Deploy to Azure:**

   ```bash
   func azure functionapp publish your-function-app-name
   ```

3. **Set application settings:**
   ```bash
   az functionapp config appsettings set --name your-function-app-name --resource-group your-resource-group --settings "DATABASE_URL=your-connection-string" "JWT_SECRET=your-secret"
   ```

### Database Migration

For production deployment:

```bash
npx prisma migrate deploy
```

## Monitoring

- Monitor failed login attempts
- Track token usage and expiration
- Log authentication errors
- Monitor database connection health

## Support

For issues or questions:

1. Check the error logs in Azure Functions
2. Verify database connectivity
3. Confirm JWT secret configuration
4. Review CORS settings
