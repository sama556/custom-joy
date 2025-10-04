document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile Management System Initialized');

    // Sign Out Modal
    const openSignOut = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const closeSignOutModal = document.getElementById('closeSignOutModal');
    const cancelSignOut = document.getElementById('cancelSignOut');
    const confirmSignOut = document.getElementById('confirmSignOut');

    if (openSignOut && signOutModal) {
        openSignOut.addEventListener('click', function() {
            openModal(signOutModal);
        });
    }

    if (closeSignOutModal) {
        closeSignOutModal.addEventListener('click', function() {
            closeModal(signOutModal);
        });
    }

    if (cancelSignOut) {
        cancelSignOut.addEventListener('click', function() {
            closeModal(signOutModal);
        });
    }

    if (confirmSignOut) {
        confirmSignOut.addEventListener('click', function() {
            showToast('Success', 'You have been signed out successfully', 'success');
            setTimeout(() => {
                window.location.href = '../auth/login.html';
            }, 1500);
        });
    }

    // Profile Image Upload
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    const imageUploadModal = document.getElementById('imageUploadModal');
    const closeImageModal = document.getElementById('closeImageModal');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');
    const saveImageUpload = document.getElementById('saveImageUpload');
    const cancelImageUpload = document.getElementById('cancelImageUpload');
    const profileAvatar = document.getElementById('profileAvatar');

    let selectedImageFile = null;

    // Open image upload modal
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            openModal(imageUploadModal);
        });
    }

    // Close image upload modal
    if (closeImageModal) {
        closeImageModal.addEventListener('click', function() {
            closeModal(imageUploadModal);
        });
    }

    if (cancelImageUpload) {
        cancelImageUpload.addEventListener('click', function() {
            closeModal(imageUploadModal);
        });
    }

    // Image upload area click
    if (imageUploadArea) {
        imageUploadArea.addEventListener('click', function() {
            imageInput.click();
        });
    }

    // Handle file selection
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    showToast('Error', 'File size must be less than 10MB', 'error');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    showToast('Error', 'Please select an image file', 'error');
                    return;
                }
                
                selectedImageFile = file;
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    imageUploadArea.style.display = 'none';
                    imagePreview.style.display = 'block';
                    saveImageUpload.disabled = false;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove selected image
    if (removeImage) {
        removeImage.addEventListener('click', function() {
            selectedImageFile = null;
            imageInput.value = '';
            imageUploadArea.style.display = 'block';
            imagePreview.style.display = 'none';
            saveImageUpload.disabled = true;
        });
    }

    // Save image upload
    if (saveImageUpload) {
        saveImageUpload.addEventListener('click', function() {
            if (selectedImageFile) {
                // Simulate image upload
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileAvatar.src = e.target.result;
                    showToast('Success', 'Profile picture updated successfully', 'success');
                    closeModal(imageUploadModal);
                };
                reader.readAsDataURL(selectedImageFile);
            }
        });
    }

    // Personal Information Form
    const personalForm = document.getElementById('personalForm');
    const resetPersonal = document.getElementById('resetPersonal');
    
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate API call
            setTimeout(() => {
                showToast('Success', 'Personal information updated successfully', 'success');
                
                // Update profile display
                const profileName = document.getElementById('profileName');
                if (profileName) {
                    profileName.textContent = `${data.firstName} ${data.lastName}`;
                }
            }, 1000);
        });
    }

    if (resetPersonal) {
        resetPersonal.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all changes?')) {
                personalForm.reset();
                showToast('Info', 'Form reset to original values', 'info');
            }
        });
    }

    // Password Form
    const passwordForm = document.getElementById('passwordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = passwordStrength?.querySelector('.strength-fill');
    const strengthText = passwordStrength?.querySelector('.strength-text');

    // Password strength checker
    if (newPassword && strengthFill && strengthText) {
        newPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            strengthFill.className = 'strength-fill';
            if (password.length > 0) {
                strengthFill.classList.add(strength.class);
                strengthText.textContent = strength.text;
            } else {
                strengthText.textContent = 'Password strength';
            }
        });
    }

    // Password confirmation validation
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (this.value !== newPassword.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPasswordValue = newPassword.value;
            const confirmPasswordValue = confirmPassword.value;
            
            if (newPasswordValue !== confirmPasswordValue) {
                showToast('Error', 'Passwords do not match', 'error');
                return;
            }
            
            if (newPasswordValue.length < 8) {
                showToast('Error', 'Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Simulate API call
            setTimeout(() => {
                showToast('Success', 'Password changed successfully', 'success');
                passwordForm.reset();
                if (strengthFill && strengthText) {
                    strengthFill.className = 'strength-fill';
                    strengthText.textContent = 'Password strength';
                }
            }, 1000);
        });
    }

    // Modal Functions
    function openModal(modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Password Strength Checker
    function checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score++;
        else feedback.push('at least 8 characters');
        
        if (/[a-z]/.test(password)) score++;
        else feedback.push('lowercase letters');
        
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('uppercase letters');
        
        if (/[0-9]/.test(password)) score++;
        else feedback.push('numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score++;
        else feedback.push('special characters');
        
        if (password.length >= 12) score++;
        
        if (score < 2) {
            return { class: 'weak', text: 'Weak password' };
        } else if (score < 4) {
            return { class: 'fair', text: 'Fair password' };
        } else if (score < 5) {
            return { class: 'good', text: 'Good password' };
        } else {
            return { class: 'strong', text: 'Strong password' };
        }
    }

    // Toast Notification System
    function showToast(title, message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="${iconMap[type]}"></i>
                </div>
                <div class="toast-body">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease-out reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
});
