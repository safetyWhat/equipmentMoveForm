// Admin Dashboard Script

// Global variables
let auth;
let users = [];
let editingUserId = null;
let deletingUserId = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize auth manager
        auth = new AuthManager();
        
        // Wait for token validation to complete
        const isValid = await auth.validateToken();
        
        if (!isValid) {
            alert('Authentication required. Please login.');
            window.location.href = 'auth.html';
            return;
        }
        console.log('Token is valid');
        // Check if user is admin after validation
        if (!auth.isAdmin()) {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return;
        }
        console.log('User is admin');
        // Display admin info
        const user = auth.getCurrentUser();
        if (user) {
            const adminInfoElement = document.getElementById('adminInfo');
            if (adminInfoElement) {
                adminInfoElement.textContent = `Welcome, ${user.name}`;
            }
        }
        
        // Load users
        await loadUsers();
        console.log('Users loaded:', users);
        // Set up form handler
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', handleUserSubmit);
        }
		console.log('User form event listener set up');
        
    } catch (error) {
        console.error('Admin dashboard initialization error:', error);
        alert('Error initializing admin dashboard. Please try again.');
        window.location.href = 'auth.html';
    }
});

// Navigation functions
function showSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Get the button that was clicked (use event.target if available, otherwise find by data attribute)
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by section name
        const targetButton = document.querySelector(`[onclick*="${sectionName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }
    
    // Show section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function goToMainApp() {
    window.location.href = 'index.html';
}

function logout() {
    if (auth) {
        auth.logout();
    }
    window.location.href = 'auth.html';
}

// Message helpers
function showError(message) {
    hideMessages();
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showSuccess(message) {
    hideMessages();
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

function hideMessages() {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    if (errorElement) errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
}

function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// User management functions
async function loadUsers() {
    if (!auth) {
        showError('Authentication not initialized');
        return;
    }
    
    showLoading();
    try {
        const result = await auth.getUsers();
        hideLoading();
        
        if (result.success) {
            users = result.users;
            renderUsersTable();
        } else {
            showError(result.error || 'Failed to load users');
        }
    } catch (error) {
        hideLoading();
        console.error('Load users error:', error);
        showError('Network error: ' + error.message);
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.warn('Users table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No users found</td></tr>';
        return;
    }
    
    // Get current user ID for comparison
    const currentUser = auth.getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : null;
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Check if this is the current user
        const isCurrentUser = currentUserId && user.id === currentUserId;
        
        // Create delete button - disable if current user
        const deleteButton = isCurrentUser 
            ? '<button class="btn-small btn-delete" disabled title="Cannot delete your own account">Delete</button>'
            : `<button class="btn-small btn-delete" onclick="showDeleteModal('${user.id}')">Delete</button>`;
        
        row.innerHTML = `
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.username)}</td>
            <td><span class="user-type-badge badge-${user.type}">${user.type.toUpperCase()}</span></td>
            <td>${user.equipmentMoveCount || 0}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="user-actions">
                    <button class="btn-small btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    ${deleteButton}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal functions
function showAddUserModal() {
    editingUserId = null;
    const modalTitle = document.getElementById('modalTitle');
    const submitButton = document.getElementById('submitUserButton');
    const passwordHelp = document.getElementById('passwordHelp');
    const passwordField = document.getElementById('userPassword');
    const userForm = document.getElementById('userForm');
    const userModal = document.getElementById('userModal');
    
    if (modalTitle) modalTitle.textContent = 'Add New User';
    if (submitButton) submitButton.textContent = 'Add User';
    if (passwordHelp) passwordHelp.style.display = 'none';
    if (passwordField) passwordField.required = true;
    if (userForm) userForm.reset();
    if (userModal) userModal.style.display = 'block';
    
    hideMessages();
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError('User not found');
        return;
    }
    
    editingUserId = userId;
    const modalTitle = document.getElementById('modalTitle');
    const submitButton = document.getElementById('submitUserButton');
    const passwordHelp = document.getElementById('passwordHelp');
    const passwordField = document.getElementById('userPassword');
    const userModal = document.getElementById('userModal');
    
    if (modalTitle) modalTitle.textContent = 'Edit User';
    if (submitButton) submitButton.textContent = 'Update User';
    if (passwordHelp) passwordHelp.style.display = 'block';
    if (passwordField) passwordField.required = false;
    
    // Populate form
    const userIdField = document.getElementById('userId');
    const userNameField = document.getElementById('userName');
    const userUsernameField = document.getElementById('userUsername');
    const userTypeField = document.getElementById('userType');
    
    if (userIdField) userIdField.value = user.id;
    if (userNameField) userNameField.value = user.name;
    if (userUsernameField) userUsernameField.value = user.username;
    if (userTypeField) userTypeField.value = user.type;
    if (passwordField) passwordField.value = '';
    
    if (userModal) userModal.style.display = 'block';
    
    hideMessages();
}

function closeUserModal() {
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.style.display = 'none';
    }
    editingUserId = null;
}

function showDeleteModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError('User not found');
        return;
    }
    
    // Check if trying to delete current user
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        showError('You cannot delete your own account');
        return;
    }
    
    deletingUserId = userId;
    const deleteUserInfo = document.getElementById('deleteUserInfo');
    const deleteUserSubmissions = document.getElementById('deleteUserSubmissions');
    const deleteModal = document.getElementById('deleteModal');
    
    if (deleteUserInfo) deleteUserInfo.textContent = `${user.name} (${user.username})`;
    if (deleteUserSubmissions) deleteUserSubmissions.textContent = user.equipmentMoveCount || 0;
    if (deleteModal) deleteModal.style.display = 'block';
    
    hideMessages();
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
    deletingUserId = null;
}

// Form handlers
async function handleUserSubmit(event) {
    event.preventDefault();
    
    if (!auth) {
        showError('Authentication not initialized');
        return;
    }
    
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        username: formData.get('username'),
        type: formData.get('type'),
        password: formData.get('password')
    };
    
    // Validate required fields
    if (!userData.name || !userData.username || !userData.type) {
        showError('Name, username, and type are required');
        return;
    }
    
    // Validate password for new users
    if (!editingUserId && !userData.password) {
        showError('Password is required for new users');
        return;
    }
    
    // Remove empty password for edits
    if (editingUserId && !userData.password) {
        delete userData.password;
    }
    
    showLoading();
    hideMessages();
    
    try {
        let result;
        if (editingUserId) {
            result = await auth.updateUser(editingUserId, userData);
        } else {
            // For new users, use the registerUser method from AuthManager
            result = await auth.registerUser(userData.username, userData.password, userData.name, userData.type);
        }
        
        hideLoading();
        
        if (result.success) {
            showSuccess(editingUserId ? 'User updated successfully' : 'User created successfully');
            closeUserModal();
            await loadUsers(); // Reload users table
        } else {
            showError(result.error || 'Operation failed');
        }
    } catch (error) {
        hideLoading();
        console.error('User form submission error:', error);
        showError('Network error: ' + error.message);
    }
}

async function confirmDelete() {
    if (!deletingUserId || !auth) return;
    
    // Double-check: prevent self-deletion
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.id === deletingUserId) {
        showError('You cannot delete your own account');
        closeDeleteModal();
        return;
    }
    
    showLoading();
    hideMessages();
    
    try {
		console.log('Deleting user with ID:', deletingUserId);
        const result = await auth.deleteUser(deletingUserId);
        hideLoading();
        
        if (result.success) {
            showSuccess('User deleted successfully');
            closeDeleteModal();
            await loadUsers(); // Reload users table
        } else {
            showError(result.error || 'Delete failed');
        }
    } catch (error) {
        hideLoading();
        console.error('Delete user error:', error);
        showError('Network error: ' + error.message);
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const userModal = document.getElementById('userModal');
    const deleteModal = document.getElementById('deleteModal');
    if (event.target === userModal) {
        closeUserModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}
