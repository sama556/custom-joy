// profile.js

// Store original values for cancel functionality (global scope)
let originalStoreValues = {};
let originalUserValues = {};

document.addEventListener('DOMContentLoaded', function() {
    // Store form functionality
    const storeForm = document.getElementById('storeForm');
    const editStoreBtn = document.getElementById('editStoreBtn');
    const cancelStoreEdit = document.getElementById('cancelStoreEdit');
    const storeFormActions = document.getElementById('storeFormActions');
    
    // User form functionality
    const userForm = document.getElementById('userForm');
    const editUserBtn = document.getElementById('editUserBtn');
    const cancelUserEdit = document.getElementById('cancelUserEdit');
    const userFormActions = document.getElementById('userFormActions');
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    
    // Logo upload
    const logoPreview = document.getElementById('logoPreview');
    const logoUpload = document.getElementById('logoUpload');
    const logoOverlay = document.querySelector('.logo-overlay');
    
    // Initialize forms
    initForms();
    
    // Store form edit mode
    editStoreBtn.addEventListener('click', function() {
        enableFormEditing(storeForm, storeFormActions, originalStoreValues);
    });
    
    cancelStoreEdit.addEventListener('click', function() {
        disableFormEditing(storeForm, storeFormActions, originalStoreValues);
    });
    
    // User form edit mode
    editUserBtn.addEventListener('click', function() {
        enableFormEditing(userForm, userFormActions, originalUserValues);
    });
    
    cancelUserEdit.addEventListener('click', function() {
        disableFormEditing(userForm, userFormActions, originalUserValues);
    });
    
    // Form submissions
    storeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleStoreUpdate();
    });
    
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleUserUpdate();
    });
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordUpdate();
    });
    
    // Logo upload functionality
    logoPreview.addEventListener('click', function() {
        logoUpload.click();
    });
    
    logoOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
        logoUpload.click();
    });
    
    logoUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                logoPreview.src = e.target.result;
                showToast('Logo Updated', 'Store logo has been updated successfully.', 'success');
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Password strength indicator
    const newPassword = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    newPassword.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    
    // Sign out modal functionality
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');
    
    openSignOutBtn.addEventListener('click', function() {
        signOutModal.classList.add('open');
    });
    
    cancelSignOutBtn.addEventListener('click', function() {
        signOutModal.classList.remove('open');
    });
    
    confirmSignOutBtn.addEventListener('click', function() {
        showToast('Signed out successfully', 'You have been signed out of your account.', 'success');
        signOutModal.classList.remove('open');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    // Close modal when clicking outside
    signOutModal.addEventListener('click', function(e) {
        if (e.target === signOutModal) {
            signOutModal.classList.remove('open');
        }
    });
});

function initForms() {
    // Store original values for store form
    const storeForm = document.getElementById('storeForm');
    storeForm.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type !== 'file') {
            originalStoreValues[field.name] = field.value;
        }
    });
    
    // Store original values for user form
    const userForm = document.getElementById('userForm');
    userForm.querySelectorAll('input, select, textarea').forEach(field => {
        originalUserValues[field.name] = field.value;
    });
}

function enableFormEditing(form, actions, originalValues) {
    // Store current values before enabling
    form.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type !== 'file' && field.id !== 'userType' && field.id !== 'joinDate') {
            originalValues[field.name] = field.value;
            field.disabled = false;
        }
    });
    
    actions.style.display = 'flex';
}

function disableFormEditing(form, actions, originalValues) {
    // Restore original values
    form.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.name in originalValues) {
            field.value = originalValues[field.name];
            field.disabled = true;
        }
    });
    
    actions.style.display = 'none';
}

function handleStoreUpdate() {
    const formData = new FormData(document.getElementById('storeForm'));
    
    // Simulate API call
    showToast('Updating Store...', 'Please wait while we update your store information.', 'info');
    
    setTimeout(() => {
        // In real application, you would send this to your backend
        console.log('Store update data:', Object.fromEntries(formData));
        
        showToast('Store Updated', 'Your store information has been updated successfully.', 'success');
        disableFormEditing(document.getElementById('storeForm'), document.getElementById('storeFormActions'), originalStoreValues);
    }, 1500);
}

function handleUserUpdate() {
    const formData = new FormData(document.getElementById('userForm'));
    
    // Simulate API call
    showToast('Updating Profile...', 'Please wait while we update your profile information.', 'info');
    
    setTimeout(() => {
        // In real application, you would send this to your backend
        console.log('User update data:', Object.fromEntries(formData));
        
        showToast('Profile Updated', 'Your profile information has been updated successfully.', 'success');
        disableFormEditing(document.getElementById('userForm'), document.getElementById('userFormActions'), originalUserValues);
    }, 1500);
}

function handlePasswordUpdate() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (newPassword !== confirmPassword) {
        showToast('Password Mismatch', 'New password and confirm password do not match.', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Weak Password', 'Password must be at least 8 characters long.', 'error');
        return;
    }
    
    // Simulate API call
    showToast('Updating Password...', 'Please wait while we update your password.', 'info');
    
    setTimeout(() => {
        // In real application, you would send this to your backend
        console.log('Password update requested');
        
        showToast('Password Updated', 'Your password has been updated successfully.', 'success');
        document.getElementById('passwordForm').reset();
        updatePasswordStrength('');
    }, 1500);
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let color = '#e74c3c';
    let text = 'Very Weak';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    if (strength >= 75) {
        color = '#2ecc71';
        text = 'Strong';
    } else if (strength >= 50) {
        color = '#f39c12';
        text = 'Medium';
    } else if (strength >= 25) {
        color = '#e67e22';
        text = 'Weak';
    }
    
    strengthBar.style.width = strength + '%';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// Toast notification function
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toastTemplate = document.getElementById('toast-template');
    const toastClone = toastTemplate.content.cloneNode(true);
    const toast = toastClone.querySelector('.toast');
    const toastIcon = toast.querySelector('.toast-icon i');
    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set toast content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    let iconClass, bgColor;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            bgColor = '#2ecc71';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            bgColor = '#f39c12';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            bgColor = '#e74c3c';
            break;
        default:
            iconClass = 'fas fa-info-circle';
            bgColor = 'var(--bright-blue)';
    }
    
    toastIcon.className = iconClass;
    toast.querySelector('.toast-icon').style.backgroundColor = bgColor;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Add slideOut animation for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);