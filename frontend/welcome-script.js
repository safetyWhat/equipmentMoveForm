// Welcome Page Script

// Initialize auth manager
const auth = new AuthManager();

// Check if already authenticated and redirect
document.addEventListener('DOMContentLoaded', async () => {
    if (auth.token) {
        const isValid = await auth.validateToken();
        if (isValid) {
            window.location.href = 'index.html';
        }
    }
});
