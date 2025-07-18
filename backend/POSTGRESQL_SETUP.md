# PostgreSQL Setup Guide

## Local Development Setup

### 1. Install PostgreSQL

#### On macOS (using Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On Windows:

Download and install from https://www.postgresql.org/download/windows/

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE equipmentMoveForm;

# Create user (replace with your preferred username/password)
CREATE USER equipmentuser WITH PASSWORD 'your_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE equipmentMoveForm TO equipmentuser;

# Exit psql
\q
```

### 3. Update Environment Variables

Update your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://equipmentuser:your_password_here@localhost:5432/equipmentMoveForm?schema=public"
```

### 4. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) View your data
npx prisma studio
```

## Azure PostgreSQL Setup

### 1. Create Azure Database for PostgreSQL

```bash
# Create resource group (if not exists)
az group create --name your-resource-group --location eastus

# Create PostgreSQL server
az postgres server create \
  --resource-group your-resource-group \
  --name your-postgres-server \
  --location eastus \
  --admin-user your-admin-username \
  --admin-password your-admin-password \
  --sku-name GP_Gen5_2 \
  --version 13

# Create database
az postgres db create \
  --resource-group your-resource-group \
  --server-name your-postgres-server \
  --name equipmentMoveForm

# Configure firewall (allow Azure services)
az postgres server firewall-rule create \
  --resource-group your-resource-group \
  --server your-postgres-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 2. Get Connection String

```bash
az postgres show-connection-string \
  --server-name your-postgres-server \
  --database-name equipmentMoveForm \
  --admin-user your-admin-username \
  --admin-password your-admin-password
```

### 3. Update Azure Function App Settings

```bash
az functionapp config appsettings set \
  --name your-function-app-name \
  --resource-group your-resource-group \
  --settings "DATABASE_URL=postgresql://your-admin-username:your-admin-password@your-postgres-server.postgres.database.azure.com:5432/equipmentMoveForm?sslmode=require"
```

## Connection String Formats

### Local Development

```
postgresql://username:password@localhost:5432/equipmentMoveForm?schema=public
```

### Azure PostgreSQL

```
postgresql://username:password@servername.postgres.database.azure.com:5432/equipmentMoveForm?sslmode=require
```

### Docker PostgreSQL

```
postgresql://username:password@host.docker.internal:5432/equipmentMoveForm?schema=public
```

## Common Issues and Solutions

### 1. Connection Refused

- Ensure PostgreSQL is running: `brew services start postgresql` (macOS)
- Check if PostgreSQL is listening on port 5432: `lsof -i :5432`

### 2. Authentication Failed

- Verify username and password in connection string
- Check if user has proper permissions on the database

### 3. Database Does Not Exist

- Create the database: `CREATE DATABASE equipmentMoveForm;`
- Verify database name in connection string

### 4. SSL Issues (Azure)

- Ensure `sslmode=require` is in your connection string for Azure PostgreSQL
- Download and use SSL certificates if needed

### 5. Prisma Migration Issues

- Reset database: `npx prisma migrate reset`
- Generate client: `npx prisma generate`
- Deploy migrations: `npx prisma migrate deploy`

## Testing Your Connection

Create a simple test script:

```javascript
// test-connection.js
const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log("📊 PostgreSQL version:", result[0].version);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

Run the test:

```bash
node test-connection.js
```
