# Authentication Setup Guide

This application uses a custom JWT (JSON Web Token) authentication system with Prisma ORM and PostgreSQL for user management.

## Overview

The authentication system includes:

- Custom JWT token generation and verification
- User registration and login functionality
- Admin user management
- Role-based access control (admin/user types)
- Database-backed user storage with Prisma

## Database Schema

The application uses PostgreSQL with the following user schema:

```prisma
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  password      String
  name          String
  type          UserType        @default(user)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  equipmentMoves EquipmentMove[]
}

enum UserType {
  user
  admin
  system
}
```

## Setup Instructions

### 1. Database Configuration

1. **Set up PostgreSQL database** (locally or cloud-hosted)
2. **Update your connection string** in `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Set DATABASE_URL** in your environment variables or `backend/local.settings.json`:
   ```json
   {
     "Values": {
       "DATABASE_URL": "postgresql://username:password@localhost:5432/equipment_move_db"
     }
   }
   ```

### 2. JWT Configuration

Set up your JWT secret in `backend/local.settings.json`:

```json
{
  "Values": {
    "JWT_SECRET": "your-super-secure-secret-key-here",
    "DATABASE_URL": "your-database-connection-string"
  }
}
```

⚠️ **Important**: In production, use a strong, randomly generated secret and store it securely.

### 3. Database Migration

Run the Prisma migrations to set up your database:

```bash
cd backend
npx prisma migrate dev
```

### 4. Create Admin User

Use the provided script to create your first admin user:

```bash
cd backend
node create-admin.js
```

This will prompt you for:

- Admin email
- Admin password
- Admin name

## Authentication Flow

### User Registration

1. User submits registration form with email, password, and name
2. Password is hashed using bcrypt
3. User record is created in database with default 'user' type
4. JWT token is generated and returned

### User Login

1. User submits email and password
2. System verifies credentials against database
3. If valid, JWT token is generated and returned
4. Token includes user ID and expiration time

### Token Verification

1. Frontend includes JWT token in Authorization header: `Bearer <token>`
2. Backend middleware verifies token signature and expiration
3. User information is retrieved from database
4. Request proceeds with authenticated user context

## API Endpoints

### Authentication Endpoints

- **POST** `/api/register` - User registration
- **POST** `/api/login` - User login
- **GET** `/api/validateToken` - Token validation

### Admin Endpoints (Require Admin Role)

- **GET** `/api/getUsers` - Retrieve all users
- **PUT** `/api/updateUser` - Update user information
- **DELETE** `/api/deleteUser` - Delete user account

## Frontend Integration

### Login Flow

```javascript
// Example login function
async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem("authToken", data.token);
    return data;
  }
  throw new Error(data.error);
}
```

### Making Authenticated Requests

```javascript
// Include token in requests
const token = localStorage.getItem("authToken");
const response = await fetch("/api/getUsers", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## Security Best Practices

1. **Strong JWT Secret**: Use a cryptographically strong secret key
2. **Token Expiration**: Tokens expire after 24 hours by default
3. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
4. **CORS Configuration**: Properly configure CORS for your domains
5. **HTTPS Only**: Use HTTPS in production
6. **Input Validation**: All inputs are validated before processing

## Environment Variables

### Development (`backend/local.settings.json`)

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_URL": "postgresql://username:password@localhost:5432/dbname",
    "JWT_SECRET": "your-jwt-secret-key"
  }
}
```

### Production (Azure Function App Settings)

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret key for JWT signing
- `NODE_ENV`: Set to "production"

## Troubleshooting

### Common Issues

1. **JWT Malformed Error**

   - Check that the token is properly formatted
   - Ensure the Authorization header uses "Bearer " prefix
   - Verify the JWT secret is correctly set

2. **Database Connection Issues**

   - Verify DATABASE_URL is correct
   - Check database server is running
   - Ensure network connectivity

3. **Authentication Failures**

   - Check user exists in database
   - Verify password is correct
   - Ensure token hasn't expired

4. **Admin Access Denied**
   - Verify user has 'admin' type in database
   - Check token is valid and belongs to admin user

### Debugging

Enable debug logging by setting `NODE_ENV=development` and check:

- Azure Function logs for backend errors
- Browser console for frontend errors
- Database logs for connection issues

## Migration from Auth0

If migrating from Auth0:

1. ✅ Remove `frontend/test-connection.html` (Auth0 test file)
2. ✅ Remove `SETUP_INSTRUCTIONS.md` (Auth0 setup guide)
3. ✅ Update any Auth0 references in documentation
4. ✅ Ensure all functions use custom JWT middleware
5. Update frontend to use custom login/register forms instead of Auth0 Lock

Your current implementation already uses the custom JWT system, so no code changes are needed for the migration.
