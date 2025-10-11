// special-designs.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Select2 for multi-select dropdowns
    $('.select2-multiple').select2({
        placeholder: 'Select options...',
        allowClear: true,
        width: '100%',
        closeOnSelect: false
    });

    // Add Design Modal
    const designModal = document.getElementById('designModal');
    const addDesignBtn = document.getElementById('addDesignBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelDesign = document.getElementById('cancelDesign');
    const designForm = document.getElementById('designForm');
    const modalTitle = document.getElementById('modalTitle');

    // View Design Modal
    const viewDesignModal = document.getElementById('viewDesignModal');
    const closeViewModal = document.getElementById('closeViewModal');
    const closeViewDesign = document.getElementById('closeViewDesign');
    const editFromView = document.getElementById('editFromView');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    // Image Upload
    const imagePreview = document.getElementById('imagePreview');
    const cakeImage = document.getElementById('cakeImage');

    let currentDesignId = '';
    let isEditing = false;

    // Open modal for adding new design
    addDesignBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Add New Design';
        designForm.reset();
        $('.select2-multiple').val(null).trigger('change');
        imagePreview.style.backgroundImage = 'none';
        imagePreview.className = 'image-preview';
        isEditing = false;
        designModal.classList.add('open');
    });

    // Close modals
    function closeDesignModal() {
        designModal.classList.remove('open');
    }

    function closeViewDesignModal() {
        viewDesignModal.classList.remove('open');
    }

    function closeDeleteDesignModal() {
        deleteModal.classList.remove('open');
    }

    closeModal.addEventListener('click', closeDesignModal);
    cancelDesign.addEventListener('click', closeDesignModal);
    closeViewModal.addEventListener('click', closeViewDesignModal);
    closeViewDesign.addEventListener('click', closeViewDesignModal);
    closeDeleteModal.addEventListener('click', closeDeleteDesignModal);
    cancelDelete.addEventListener('click', closeDeleteDesignModal);

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
    designForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleDesignSubmission();
    });

    // View Design buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const designId = this.getAttribute('data-design');
            viewDesign(designId);
        });
    });

    // Edit Design buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const designId = this.getAttribute('data-design');
            editDesign(designId);
        });
    });

    // Edit from View modal
    editFromView.addEventListener('click', function() {
        editDesign(currentDesignId);
        closeViewDesignModal();
    });

    // Delete Design buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const designId = this.getAttribute('data-design');
            showDeleteConfirmation(designId);
        });
    });

    // Confirm delete
    confirmDelete.addEventListener('click', function() {
        deleteDesign(currentDesignId);
    });

    // Thumbnail click in view modal
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const src = this.querySelector('img').src;
            document.getElementById('viewMainImage').src = src;
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchDesigns');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const designCards = document.querySelectorAll('.design-card');
        
        designCards.forEach(card => {
            const title = card.querySelector('.design-title').textContent.toLowerCase();
            const description = card.querySelector('.design-description').textContent.toLowerCase();
            const specs = card.querySelector('.design-specs').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || specs.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Filter functionality
    const filterCakeType = document.getElementById('filterCakeType');
    const filterProductType = document.getElementById('filterProductType');

    [filterCakeType, filterProductType].forEach(filter => {
        filter.addEventListener('change', filterDesigns);
    });

    function filterDesigns() {
        const cakeTypeFilter = filterCakeType.value;
        const productTypeFilter = filterProductType.value;
        const designCards = document.querySelectorAll('.design-card');
        
        designCards.forEach(card => {
            const cakeTypes = card.querySelector('.design-specs .spec-item:first-child span').textContent.toLowerCase();
            const productType = card.querySelector('.design-badge').classList.contains('special') ? 'special' : 'general';
            
            const cakeTypeMatch = !cakeTypeFilter || cakeTypes.includes(cakeTypeFilter);
            const productTypeMatch = !productTypeFilter || productType === productTypeFilter;
            
            if (cakeTypeMatch && productTypeMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreDesigns');
    loadMoreBtn.addEventListener('click', function() {
        showToast('Loading', 'Loading more designs...', 'info');
        setTimeout(() => {
            showToast('Loaded', 'More designs loaded successfully.', 'success');
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
    
    // Close modals when clicking outside
    [designModal, viewDesignModal, deleteModal, signOutModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                if (modal === designModal) closeDesignModal();
                if (modal === viewDesignModal) closeViewDesignModal();
                if (modal === deleteModal) closeDeleteDesignModal();
                if (modal === signOutModal) signOutModal.classList.remove('open');
            }
        });
    });
});

function handleDesignSubmission() {
    // Get multi-select values
    const cakeTypes = $('#cakeTypes').val();
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
    const designData = {
        cakeName: document.getElementById('cakeName').value,
        productType: document.getElementById('productType').value,
        description: document.getElementById('cakeDescription').value,
        basePrice: parseFloat(document.getElementById('basePrice').value),
        isAvailable: document.getElementById('isAvailable').value === 'true',
        cakeTypes: cakeTypes,
        baseFlavors: baseFlavors,
        fillings: fillings,
        frosting: frosting,
        shape: shape,
        size: size,
        layers: document.getElementById('layers').value,
        colors: colors,
        decorations: decorations,
        cakeText: document.getElementById('cakeText').value,
        textColor: document.getElementById('textColor').value,
        candles: candles,
        topper: topper,
        edibleImage: document.getElementById('edibleImage').value,
        packaging: packaging
    };

    // Simulate API call
    showToast('Saving Design...', 'Please wait while we save your cake design.', 'info');
    
    setTimeout(() => {
        if (isEditing) {
            showToast('Design Updated', 'Your cake design has been updated successfully.', 'success');
        } else {
            showToast('Design Created', 'Your new cake design has been created successfully.', 'success');
        }
        
        document.getElementById('designModal').classList.remove('open');
        
        // In real application, you would update the designs grid here
    }, 1500);
}

function viewDesign(designId) {
    currentDesignId = designId;
    const designCard = document.querySelector(`[data-design="${designId}"]`);
    
    if (designCard) {
        const title = designCard.querySelector('.design-title').textContent;
        const productType = designCard.querySelector('.design-badge').classList.contains('special') ? 'special' : 'general';
        const basePrice = designCard.querySelector('.meta-item:nth-child(1) span').textContent;
        const layers = designCard.querySelector('.meta-item:nth-child(2) span').textContent;
        const status = designCard.querySelector('.status').textContent.toLowerCase();
        const description = designCard.querySelector('.design-description').textContent;
        const cakeTypes = designCard.querySelector('.spec-item:nth-child(1) span').textContent;
        const size = designCard.querySelector('.spec-item:nth-child(2) span').textContent;
        
        // Update view modal content
        document.getElementById('viewDesignTitle').textContent = title;
        document.getElementById('viewProductType').textContent = productType.charAt(0).toUpperCase() + productType.slice(1);
        document.getElementById('viewProductType').className = `badge ${productType}`;
        document.getElementById('viewBasePrice').textContent = basePrice;
        document.getElementById('viewAvailability').textContent = status.charAt(0).toUpperCase() + status.slice(1);
        document.getElementById('viewAvailability').className = `status ${status}`;
        document.getElementById('viewDescription').textContent = description;
        document.getElementById('viewCakeTypes').textContent = cakeTypes;
        document.getElementById('viewSize').textContent = size;
        document.getElementById('viewLayers').textContent = layers;
        
        // Set default values for other fields (in real app, you'd fetch from backend)
        document.getElementById('viewBaseFlavors').textContent = 'Red Velvet, Vanilla';
        document.getElementById('viewFillings').textContent = 'Cream Cheese, Chocolate Ganache';
        document.getElementById('viewFrosting').textContent = 'Cream Cheese, Butter Cream';
        document.getElementById('viewShape').textContent = 'Round';
        document.getElementById('viewColors').textContent = 'Red, White, Gold';
        document.getElementById('viewDecorations').textContent = 'Gold Leaf, Fresh Flowers';
        document.getElementById('viewCakeText').textContent = 'Congratulations';
        document.getElementById('viewTextColor').textContent = 'Gold';
        document.getElementById('viewCandles').textContent = 'Sparkler';
        document.getElementById('viewTopper').textContent = 'Acrylic';
        document.getElementById('viewEdibleImage').textContent = 'No';
        document.getElementById('viewPackaging').textContent = 'Luxury Box, Cake Board';
        
        viewDesignModal.classList.add('open');
    }
}

function editDesign(designId) {
    currentDesignId = designId;
    const designCard = document.querySelector(`[data-design="${designId}"]`);
    
    if (designCard) {
        const title = designCard.querySelector('.design-title').textContent;
        const productType = designCard.querySelector('.design-badge').classList.contains('special') ? 'special' : 'general';
        const basePrice = designCard.querySelector('.meta-item:nth-child(1) span').textContent.replace('SAR ', '');
        const layers = designCard.querySelector('.meta-item:nth-child(2) span').textContent.replace(' Layers', '');
        const status = designCard.querySelector('.status').textContent.toLowerCase();
        const description = designCard.querySelector('.design-description').textContent;
        
        // Populate form with existing data
        document.getElementById('cakeName').value = title;
        document.getElementById('productType').value = productType;
        document.getElementById('cakeDescription').value = description;
        document.getElementById('basePrice').value = basePrice;
        document.getElementById('layers').value = layers;
        document.getElementById('isAvailable').value = status === 'active' ? 'true' : 'false';
        
        // Set default values for multi-select fields (in real app, you'd fetch from backend)
        $('#cakeTypes').val(['red-velvet', 'fondant']).trigger('change');
        $('#baseFlavors').val(['red-velvet', 'vanilla']).trigger('change');
        $('#fillings').val(['cream-cheese', 'chocolate-ganache']).trigger('change');
        $('#frosting').val(['cream-cheese', 'butter-cream']).trigger('change');
        $('#shape').val(['round']).trigger('change');
        $('#size').val(['10']).trigger('change');
        $('#colors').val(['red', 'white', 'gold']).trigger('change');
        $('#decorations').val(['gold-leaf', 'fresh-flowers']).trigger('change');
        $('#candles').val(['sparkler']).trigger('change');
        $('#topper').val(['acrylic']).trigger('change');
        $('#packaging').val(['luxury-box', 'cake-board']).trigger('change');
        
        document.getElementById('cakeText').value = 'Congratulations';
        document.getElementById('textColor').value = '#FFD700';
        document.getElementById('edibleImage').value = 'no';
        
        modalTitle.textContent = 'Edit Design';
        isEditing = true;
        designModal.classList.add('open');
    }
}

function showDeleteConfirmation(designId) {
    currentDesignId = designId;
    const designCard = document.querySelector(`[data-design="${designId}"]`);
    
    if (designCard) {
        const title = designCard.querySelector('.design-title').textContent;
        const productType = designCard.querySelector('.design-badge').classList.contains('special') ? 'Special' : 'General';
        const imageSrc = designCard.querySelector('.design-image img').src;
        
        document.getElementById('deleteDesignTitle').textContent = title;
        document.getElementById('deleteDesignType').textContent = `${productType} Design`;
        document.getElementById('deletePreviewImage').src = imageSrc;
        
        deleteModal.classList.add('open');
    }
}

function deleteDesign(designId) {
    showToast('Deleting Design...', `Removing design ${designId}...`, 'info');

    setTimeout(() => {
        const designCard = document.querySelector(`[data-design="${designId}"]`);
        if (designCard) {
            designCard.style.opacity = '0';
            designCard.style.transform = 'scale(0.8)';
            setTimeout(() => {
                designCard.remove();
                showToast('Design Deleted', 'Design has been removed successfully.', 'success');
                closeDeleteDesignModal();
            }, 300);
        }
    }, 1000);
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