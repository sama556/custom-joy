// cake-catalog.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Select2 for multi-select dropdowns
    $('.select2-multiple').select2({
        placeholder: 'Select options',
        allowClear: true,
        width: '100%'
    });

    // Modal elements
    const cakeModal = document.getElementById('cakeModal');
    const addCakeBtn = document.getElementById('addCakeBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelCake = document.getElementById('cancelCake');
    const cakeForm = document.getElementById('cakeForm');
    const modalTitle = document.getElementById('modalTitle');

    // Image upload
    const imagePreview = document.getElementById('imagePreview');
    const cakeImage = document.getElementById('cakeImage');

    // Open modal for adding new cake
    addCakeBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Add New Cake';
        cakeForm.reset();
        $('.select2-multiple').val(null).trigger('change');
        imagePreview.style.backgroundImage = 'none';
        imagePreview.className = 'image-preview';
        cakeModal.classList.add('open');
    });

    // Close modal
    function closeCakeModal() {
        cakeModal.classList.remove('open');
    }

    closeModal.addEventListener('click', closeCakeModal);
    cancelCake.addEventListener('click', closeCakeModal);

    // Image upload preview
    imagePreview.addEventListener('click', function() {
        cakeImage.click();
    });

    cakeImage.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
                imagePreview.classList.add('has-image');
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Form submission
    cakeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleCakeSubmission();
    });

    // Edit cake buttons
    document.querySelectorAll('.edit-cake').forEach(btn => {
        btn.addEventListener('click', function() {
            const cakeCard = this.closest('.cake-card');
            const cakeName = cakeCard.querySelector('.cake-name').textContent;
            modalTitle.textContent = `Edit ${cakeName}`;
            // In real application, you would load existing cake data here
            cakeModal.classList.add('open');
        });
    });

    // Delete cake buttons
    document.querySelectorAll('.delete-cake').forEach(btn => {
        btn.addEventListener('click', function() {
            const cakeCard = this.closest('.cake-card');
            const cakeName = cakeCard.querySelector('.cake-name').textContent;
            
            if (confirm(`Are you sure you want to delete "${cakeName}"?`)) {
                // In real application, you would send delete request here
                cakeCard.style.opacity = '0';
                setTimeout(() => {
                    cakeCard.remove();
                    showToast('Cake Deleted', `${cakeName} has been deleted successfully.`, 'success');
                }, 300);
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchCakes');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cakeCards = document.querySelectorAll('.cake-card');
        
        cakeCards.forEach(card => {
            const name = card.querySelector('.cake-name').textContent.toLowerCase();
            const description = card.querySelector('.cake-description').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Filter functionality
    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');

    [filterStatus, filterType].forEach(filter => {
        filter.addEventListener('change', filterCakes);
    });

    function filterCakes() {
        const statusFilter = filterStatus.value;
        const typeFilter = filterType.value;
        const cakeCards = document.querySelectorAll('.cake-card');
        
        cakeCards.forEach(card => {
            const status = card.querySelector('.cake-status').classList.contains('available') ? 'available' : 'unavailable';
            const type = card.querySelector('.cake-type').classList.contains('special') ? 'special' : 'general';
            
            const statusMatch = !statusFilter || status === statusFilter;
            const typeMatch = !typeFilter || type === typeFilter;
            
            if (statusMatch && typeMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMore');
    loadMoreBtn.addEventListener('click', function() {
        // In real application, you would load more cakes from API
        showToast('Loading', 'Loading more cakes...', 'info');
        setTimeout(() => {
            showToast('Loaded', 'More cakes loaded successfully.', 'success');
        }, 1000);
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

    cakeModal.addEventListener('click', function(e) {
        if (e.target === cakeModal) {
            closeCakeModal();
        }
    });
});

function handleCakeSubmission() {
    const formData = new FormData(document.getElementById('cakeForm'));
    
    // Get multi-select values
    const cakeType = $('#cakeType').val();
    const baseFlavors = $('#baseFlavors').val();
    const fillings = $('#fillings').val();
    const frosting = $('#frosting').val();
    const shape = $('#shape').val();
    const size = $('#size').val();
    const colors = $('#colors').val();
    const decorations = $('#decorations').val();
    const candles = $('#candles').val();
    const topper = $('#topper').val();
    const packaging = $('#packaging').val();

    // Prepare data for submission
    const cakeData = {
        name: formData.get('cakeName'),
        description: formData.get('cakeDescription'),
        basePrice: parseFloat(formData.get('basePrice')),
        cakeType: cakeType,
        productType: formData.get('productType'),
        baseFlavors: baseFlavors,
        fillings: fillings,
        frosting: frosting,
        shape: shape,
        size: size,
        layers: parseInt(formData.get('layers')),
        colors: colors,
        decorations: decorations,
        customText: formData.get('cakeText'),
        textColor: formData.get('textColor'),
        candles: candles,
        topper: topper,
        packaging: packaging,
        isAvailable: formData.get('isAvailable') === 'yes'
    };

    // Simulate API call
    showToast('Saving Cake...', 'Please wait while we save your cake information.', 'info');
    
    setTimeout(() => {
        // In real application, you would send this to your backend
        console.log('Cake data:', cakeData);
        
        showToast('Cake Saved', 'Your cake has been saved successfully.', 'success');
        document.getElementById('cakeModal').classList.remove('open');
        
        // In real application, you would update the cakes grid here
    }, 1500);
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
            bgColor = '#10b981';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            bgColor = '#f59e0b';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            bgColor = '#ef4444';
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
// cake-catalog.js - Updated Select2 initialization

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Select2 for multi-select dropdowns with text area appearance
    $('.select2-multiple').select2({
        placeholder: 'Select options...',
        allowClear: true,
        width: '100%',
        closeOnSelect: false,
        selectionCssClass: 'select2-textarea-style',
        dropdownCssClass: 'select2-dropdown-textarea',
        tags: false, // Set to true if you want to allow custom entries
        tokenSeparators: [',', ' '], // If tags is true, this allows comma separation
        createTag: function (params) {
            return undefined; // Disable custom tag creation by default
        }
    });

    // Additional styling for better text area appearance
    $('.select2-multiple').on('select2:open', function() {
        // Add custom class when dropdown is open
        $(this).data('select2').$container.addClass('select2-focused');
    });

    $('.select2-multiple').on('select2:close', function() {
        // Remove custom class when dropdown closes
        $(this).data('select2').$container.removeClass('select2-focused');
    });

    // Auto-expand height based on content
    $('.select2-multiple').on('select2:select select2:unselect', function() {
        const $container = $(this).data('select2').$container;
        const $selection = $container.find('.select2-selection--multiple');
        const choiceCount = $selection.find('.select2-selection__choice').length;
        
        if (choiceCount > 2) {
            $selection.css('min-height', 'auto').css('height', 'auto');
        } else {
            $selection.css('min-height', '44px').css('height', 'auto');
        }
    });

    // Rest of your existing JavaScript code...
});