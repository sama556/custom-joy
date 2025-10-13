document.addEventListener('DOMContentLoaded', function() {
    // Initialize Select2 for multi-select dropdowns
    $('.select2-multi').select2({
        placeholder: 'Select options',
        allowClear: true,
        width: '100%',
        closeOnSelect: false
    });

    // Modal functionality
    const flowerModal = document.getElementById('flowerModal');
    const deleteModal = document.getElementById('deleteModal');
    const addFlowerBtn = document.getElementById('addFlowerBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelFlower = document.getElementById('cancelFlower');
    const flowerForm = document.getElementById('flowerForm');

    // Open modal for adding new flower
    addFlowerBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-seedling"></i> Add New Flower';
        flowerForm.reset();
        // Reset image preview (supports both legacy <img id="flowerImagePreview"> and new container)
        const legacyPreviewImg = document.getElementById('flowerImagePreview');
        const previewContainer = document.getElementById('flowerImagePreviewContainer');
        if (legacyPreviewImg) {
            legacyPreviewImg.src = '../../images/placeholder-image.jpg';
        }
        if (previewContainer) {
            previewContainer.style.backgroundImage = '';
            const hintSpan = previewContainer.querySelector('span');
            if (hintSpan) hintSpan.style.opacity = '1';
        }
        $('.select2-multi').val(null).trigger('change');
        flowerModal.style.display = 'flex';
    });

    // Close modal
    function closeFlowerModal() {
        flowerModal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeFlowerModal);
    cancelFlower.addEventListener('click', closeFlowerModal);

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabBtns.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
        });
    });

    // Image upload preview (supports legacy <img> preview and new container preview)
    const flowerImage = document.getElementById('flowerImage');
    const flowerImagePreview = document.getElementById('flowerImagePreview');
    const flowerImagePreviewContainer = document.getElementById('flowerImagePreviewContainer');

    if (flowerImage) {
        flowerImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    if (flowerImagePreview) {
                        flowerImagePreview.src = ev.target.result;
                    }
                    if (flowerImagePreviewContainer) {
                        flowerImagePreviewContainer.style.backgroundImage = `url('${ev.target.result}')`;
                        flowerImagePreviewContainer.style.backgroundSize = 'cover';
                        flowerImagePreviewContainer.style.backgroundPosition = 'center';
                        const hintSpan = flowerImagePreviewContainer.querySelector('span');
                        if (hintSpan) hintSpan.style.opacity = '0';
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Trigger file input when clicking on preview area
        if (flowerImagePreview && flowerImagePreview.closest('.image-preview')) {
            flowerImagePreview.closest('.image-preview').addEventListener('click', function() {
                flowerImage.click();
            });
        }
        if (flowerImagePreviewContainer) {
            flowerImagePreviewContainer.addEventListener('click', function() {
                flowerImage.click();
            });
        }
    }

    // Edit and Delete buttons functionality
    document.querySelectorAll('.edit-flower').forEach(btn => {
        btn.addEventListener('click', function() {
            const flowerCard = this.closest('.flower-card');
            const flowerId = flowerCard.getAttribute('data-id');
            
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Flower';
            // Here you would load the flower data into the form
            showToast('Edit Mode', 'Loading flower data...', 'info');
            flowerModal.style.display = 'flex';
        });
    });

    document.querySelectorAll('.delete-flower').forEach(btn => {
        btn.addEventListener('click', function() {
            const flowerCard = this.closest('.flower-card');
            const flowerName = flowerCard.querySelector('.flower-name').textContent;
            
            document.getElementById('deleteModal').style.display = 'flex';
            
            // Set up delete confirmation
            document.getElementById('confirmDelete').onclick = function() {
                showToast('Success', `"${flowerName}" has been deleted`, 'success');
                document.getElementById('deleteModal').style.display = 'none';
                // Here you would actually delete the flower from the database
            };
        });
    });

    // Close delete modal
    document.getElementById('cancelDelete').addEventListener('click', function() {
        document.getElementById('deleteModal').style.display = 'none';
    });

    // Form submission
    flowerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Success', 'Flower saved successfully!', 'success');
        closeFlowerModal();
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === flowerModal) {
            closeFlowerModal();
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });

    // Toast notification function
    function showToast(title, message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Search functionality
    const searchInput = document.getElementById('searchFlowers');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const flowerCards = document.querySelectorAll('.flower-card');
        
        flowerCards.forEach(card => {
            const flowerName = card.querySelector('.flower-name').textContent.toLowerCase();
            const flowerType = card.querySelector('.flower-type').textContent.toLowerCase();
            const flowerArrangement = card.querySelector('.flower-arrangement').textContent.toLowerCase();
            
            if (flowerName.includes(searchTerm) || flowerType.includes(searchTerm) || flowerArrangement.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});