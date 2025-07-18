#!/usr/bin/env node

const { createUser } = require('./src/utils/database');
const { hashPassword, validateEmail, validatePassword, validateRole } = require('./src/utils/auth');

/**
 * CLI script to create users
 */
async function createUserCli() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: node createUser.cli.js [options]

Options:
  --email <email>        User email address (required)
  --password <password>  User password (required)
  --role <role>         User role: USER or ADMIN (default: USER)
  --help, -h            Show this help message

Examples:
  node createUser.cli.js --email admin@example.com --password AdminPass123! --role ADMIN
  node createUser.cli.js --email user@example.com --password UserPass123!
        `);
        process.exit(0);
    }
    
    // Parse arguments
    const email = getArgValue(args, '--email');
    const password = getArgValue(args, '--password');
    const role = getArgValue(args, '--role') || 'USER';
    
    // Validate required arguments
    if (!email) {
        console.error('❌ Error: Email is required. Use --email <email>');
        process.exit(1);
    }
    
    if (!password) {
        console.error('❌ Error: Password is required. Use --password <password>');
        process.exit(1);
    }
    
    try {
        // Validate email format
        if (!validateEmail(email)) {
            console.error('❌ Error: Invalid email format');
            process.exit(1);
        }
        
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            console.error('❌ Error: Password validation failed:');
            passwordValidation.errors.forEach(error => {
                console.error(`  - ${error}`);
            });
            process.exit(1);
        }
        
        // Validate role
        if (!validateRole(role)) {
            console.error('❌ Error: Invalid role. Must be USER or ADMIN');
            process.exit(1);
        }
        
        console.log('🔄 Creating user...');
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const newUser = await createUser({
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role.toUpperCase()
        });
        
        console.log('✅ User created successfully!');
        console.log(`📧 Email: ${newUser.email}`);
        console.log(`👤 Role: ${newUser.role}`);
        console.log(`🆔 ID: ${newUser.id}`);
        console.log(`📅 Created: ${newUser.createdAt}`);
        
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
    }
}

/**
 * Get argument value from command line args
 * @param {Array} args - Command line arguments
 * @param {string} argName - Argument name to find
 * @returns {string|null} - Argument value or null if not found
 */
function getArgValue(args, argName) {
    const index = args.indexOf(argName);
    if (index !== -1 && index + 1 < args.length) {
        return args[index + 1];
    }
    return null;
}

// Run the CLI if this script is executed directly
if (require.main === module) {
    createUserCli();
}

module.exports = { createUserCli };
