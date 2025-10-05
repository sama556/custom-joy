document.addEventListener('DOMContentLoaded', function () {
    // Sign out modal
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');
    function openModal() { signOutModal.classList.add('open'); signOutModal.setAttribute('aria-hidden', 'false'); }
    function closeModal() { signOutModal.classList.remove('open'); signOutModal.setAttribute('aria-hidden', 'true'); }
    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', closeModal);
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeModal(); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => { closeModal(); showToast('Signed out', 'You have been signed out successfully.', 'success'); });

    // Elements
    const themeSearch = document.getElementById('themeSearch');
    const statusFilter = document.getElementById('statusFilter');
    const themesGrid = document.getElementById('themesGrid');
    const themeCount = document.getElementById('themeCount');
    const cardTemplate = document.getElementById('theme-card-template');

    // Modals for Add/Edit
    const themeModal = document.getElementById('themeModal');
    const themeForm = document.getElementById('themeForm');
    const themeModalTitle = document.getElementById('themeModalTitle');
    const cancelTheme = document.getElementById('cancelTheme');
    const themeId = document.getElementById('themeId');
    const themeTitle = document.getElementById('themeTitle');
    const themeDescription = document.getElementById('themeDescription');
    const themeImageFile = document.getElementById('themeImageFile');
    const themeCategory = document.getElementById('themeCategory');
    const themeAvailable = document.getElementById('themeAvailable');
    let editingRow = null;

    // View modal
    const viewThemeModal = document.getElementById('viewThemeModal');
    const viewThemeImage = document.getElementById('viewThemeImage');
    const viewThemeTitle = document.getElementById('viewThemeTitle');
    const viewThemeId = document.getElementById('viewThemeId');
    const viewThemeDescription = document.getElementById('viewThemeDescription');
    const viewThemeAvailable = document.getElementById('viewThemeAvailable');
    const closeViewTheme = document.getElementById('closeViewTheme');

    // Form persistence
    function saveFormDraft() {
        const formData = {
            id: themeId ? themeId.value : '',
            title: themeTitle ? themeTitle.value : '',
            description: themeDescription ? themeDescription.value : '',
            category: themeCategory ? themeCategory.value : 'birthday',
            available: themeAvailable ? themeAvailable.value : 'false',
            image: (function(){ const img = document.getElementById('themePreviewImage'); return img ? img.src : ''; })()
        };
        localStorage.setItem('themeFormDraft', JSON.stringify(formData));
        showAutoSaveIndicator();
    }

    function showAutoSaveIndicator() {
        let indicator = document.querySelector('.form-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'form-save-indicator';
            indicator.textContent = 'Draft saved';
            document.body.appendChild(indicator);
        }

        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    // Form progress tracking
    function updateFormProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (!progressFill || !progressText) return;

        let completedFields = 0;
        let totalFields = 6; // ID, Title, Description, Category, Available, Image

        // Check required fields
        if (themeId && themeId.value.trim()) completedFields++;
        if (themeTitle && themeTitle.value.trim()) completedFields++;
        if (themeDescription && themeDescription.value.trim()) completedFields++;
        if (themeCategory && themeCategory.value) completedFields++;
        if (themeAvailable && themeAvailable.value) completedFields++;

        // Check if image is uploaded
        const previewImg = document.getElementById('themePreviewImage');
        if (previewImg && previewImg.src && !previewImg.src.includes('data:image/svg+xml')) {
            completedFields++;
        }

        const percentage = Math.round((completedFields / totalFields) * 100);

        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;

        // Update progress bar color based on completion
        if (percentage === 100) {
            progressFill.style.background = 'var(--success)';
        } else if (percentage >= 50) {
            progressFill.style.background = 'var(--orange-yellow)';
        } else {
            progressFill.style.background = 'var(--white)';
        }
    }

    function loadFormDraft() {
        const draft = localStorage.getItem('themeFormDraft');
        if (draft) {
            try {
                const formData = JSON.parse(draft);
                if (themeId) themeId.value = formData.id || '';
                if (themeTitle) themeTitle.value = formData.title || '';
                if (themeDescription) themeDescription.value = formData.description || '';
                if (themeCategory) themeCategory.value = formData.category || 'birthday';
                if (themeAvailable) themeAvailable.value = formData.available || 'false';

                if (formData.image && themePreviewImage) {
                    themePreviewImage.src = formData.image;
                    themeImagePreview.style.display = 'block';
                    themeUploadArea.style.display = 'none';
                }

                return true;
            } catch (e) {
                console.error('Error loading form draft:', e);
            }
        }
        return false;
    }

    function clearFormDraft() {
        localStorage.removeItem('themeFormDraft');
    }

    function openThemeModal(title) {
        themeModalTitle.innerHTML = title;
        themeModal.classList.add('open');
        themeModal.setAttribute('aria-hidden', 'false');

        // subtitle removed in markup

        // Load draft if not editing
        if (!editingRow) {
            const hasDraft = loadFormDraft();
            if (hasDraft) {
                showToast('Draft Loaded', 'Previous form data has been restored', 'info');
            }
        }

        // Update progress
        updateFormProgress();
    }

    function closeThemeModal() {
        themeModal.classList.remove('open');
        themeModal.setAttribute('aria-hidden', 'true');
        themeForm.reset();
        // Reset image preview
        const preview = document.getElementById('themeImagePreview');
        const uploadArea = document.getElementById('themeUploadArea');
        if (preview) preview.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'block';
        editingRow = null;
        clearFormDraft();
    }
    if (cancelTheme) cancelTheme.addEventListener('click', closeThemeModal);
    const cancelThemeBottom = document.getElementById('cancelThemeBottom');
    if (cancelThemeBottom) cancelThemeBottom.addEventListener('click', closeThemeModal);
    if (themeModal) themeModal.addEventListener('click', (e) => { if (e.target === themeModal) closeThemeModal(); });

    function openViewTheme() { viewThemeModal.classList.add('open'); viewThemeModal.setAttribute('aria-hidden', 'false'); }
    function closeViewThemeModal() { viewThemeModal.classList.remove('open'); viewThemeModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewTheme) closeViewTheme.addEventListener('click', closeViewThemeModal);
    if (viewThemeModal) viewThemeModal.addEventListener('click', (e) => { if (e.target === viewThemeModal) closeViewThemeModal(); });

    // Quick action buttons in view modal
    const quickEditTheme = document.getElementById('quickEditTheme');
    const quickToggleStatus = document.getElementById('quickToggleStatus');
    const quickDuplicateTheme = document.getElementById('quickDuplicateTheme');
    const quickDeleteTheme = document.getElementById('quickDeleteTheme');
    const viewFullImage = document.getElementById('viewFullImage');

    if (quickEditTheme) {
        quickEditTheme.addEventListener('click', () => {
            closeViewThemeModal();
            // Trigger edit action on the current theme card
            const currentCard = document.querySelector('.theme-card[data-current="true"]');
            if (currentCard) {
                const editBtn = currentCard.querySelector('button[data-action="edit"]');
                if (editBtn) editBtn.click();
            }
        });
    }

    if (quickToggleStatus) {
        quickToggleStatus.addEventListener('click', () => {
            const currentCard = document.querySelector('.theme-card[data-current="true"]');
            if (currentCard) {
                const statusBtn = currentCard.querySelector('button[data-action="hide"], button[data-action="activate"]');
                if (statusBtn) statusBtn.click();
                closeViewThemeModal();
            }
        });
    }

    if (quickDuplicateTheme) {
        quickDuplicateTheme.addEventListener('click', () => {
            const currentCard = document.querySelector('.theme-card[data-current="true"]');
            if (currentCard) {
                const data = getCardData(currentCard);
                // Create a new theme with modified data
                const newData = {
                    ...data,
                    id: generateThemeId(),
                    title: `${data.title} (Copy)`,
                    status: 'active'
                };
                const newCard = createCard(newData);
                themesGrid.prepend(newCard);
                showToast('Theme Duplicated', 'A copy of the theme has been created', 'success');
                applyFilters();
                closeViewThemeModal();
            }
        });
    }

    if (quickDeleteTheme) {
        quickDeleteTheme.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
                const currentCard = document.querySelector('.theme-card[data-current="true"]');
                if (currentCard) {
                    const data = getCardData(currentCard);
                    currentCard.remove();
                    showToast('Theme Deleted', `${data.title} has been removed`, 'error');
                    applyFilters();
                    closeViewThemeModal();
                }
            }
        });
    }

    if (viewFullImage) {
        viewFullImage.addEventListener('click', () => {
            const img = document.getElementById('viewThemeImage');
            if (img && img.src) {
                window.open(img.src, '_blank');
            }
        });
    }

    function applyFilters() {
        const q = (themeSearch.value || '').toLowerCase();
        const status = statusFilter.value;
        let visible = 0;
        [...themesGrid.querySelectorAll('.theme-card')].forEach(card => {
            const id = (card.querySelector('.theme-id')?.textContent || '').toLowerCase();
            const title = (card.querySelector('.theme-title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.theme-desc')?.textContent || '').toLowerCase();
            const rowStatus = card.querySelector('.badge.status')?.getAttribute('data-status');
            const matchesQuery = !q || [id, title, desc].some(v => v.includes(q));
            const matchesStatus = !status || rowStatus === status;
            const show = matchesQuery && matchesStatus;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        themeCount.textContent = `${visible} theme${visible === 1 ? '' : 's'}`;
    }

    if (themeSearch) themeSearch.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    applyFilters();

    // Image upload functionality
    const themeUploadArea = document.getElementById('themeUploadArea');
    const themeImagePreview = document.getElementById('themeImagePreview');
    const themePreviewImage = document.getElementById('themePreviewImage');
    const removeThemeImage = document.getElementById('removeThemeImage');

    if (themeUploadArea && themeImageFile) {
        themeUploadArea.addEventListener('click', () => themeImageFile.click());

        themeUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            themeUploadArea.classList.add('dragover');
        });

        themeUploadArea.addEventListener('dragleave', () => {
            themeUploadArea.classList.remove('dragover');
        });

        themeUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            themeUploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });
    }

    if (themeImageFile) {
        themeImageFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    if (removeThemeImage) {
        removeThemeImage.addEventListener('click', () => {
            themeImagePreview.style.display = 'none';
            themeUploadArea.style.display = 'block';
            themeImageFile.value = '';
            updateFormProgress();
        });
    }

    function handleImageFile(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Invalid File', 'Please select an image file (JPG, PNG, GIF)', 'error');
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showToast('File Too Large', 'Image must be smaller than 5MB', 'error');
            return;
        }

        // Show loading state
        const uploadArea = document.getElementById('themeUploadArea');
        if (uploadArea) {
            uploadArea.classList.add('loading');
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            themePreviewImage.src = e.target.result;
            themeImagePreview.style.display = 'block';
            themeUploadArea.style.display = 'none';
            themeUploadArea.classList.remove('loading');
            showToast('Image Uploaded', 'Image preview ready', 'success');
            updateFormProgress();
        };

        reader.onerror = () => {
            themeUploadArea.classList.remove('loading');
            showToast('Upload Error', 'Failed to process image', 'error');
        };

        reader.readAsDataURL(file);
    }

    // no selectAll in card view

    function setStatusBadge(span, status) {
        span.className = 'badge status';
        span.setAttribute('data-status', status);
        if (status === 'active') span.classList.add('active');
        if (status === 'hidden') span.classList.add('hidden');
        span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
    function fillCard(card, data) {
        card.setAttribute('data-status', data.status);
        card.setAttribute('data-category', data.category || 'birthday');
        card.setAttribute('data-price', data.price || 0);
        card.setAttribute('data-color', data.color || '#368BFF');
        card.setAttribute('data-tags', data.tags || '');
        card.querySelector('.theme-id').textContent = data.id;
        card.querySelector('.theme-title').textContent = data.title;
        card.querySelector('.theme-desc').textContent = data.description;
        const thumb = card.querySelector('.theme-thumb');
        thumb.style.backgroundImage = `url('${data.image}')`;
        setStatusBadge(card.querySelector('.badge.status'), data.status);
    }
    function getCardData(card) {
        return {
            id: card.querySelector('.theme-id')?.textContent || '',
            title: card.querySelector('.theme-title')?.textContent || '',
            description: card.querySelector('.theme-desc')?.textContent || '',
            image: (() => { const bg = card.querySelector('.theme-thumb').style.backgroundImage; return bg ? bg.slice(5, -2) : ''; })(),
            status: card.querySelector('.badge.status')?.getAttribute('data-status') || 'active',
            category: card.getAttribute('data-category') || 'birthday',
            price: parseFloat(card.getAttribute('data-price')) || 0,
            color: card.getAttribute('data-color') || '#368BFF',
            tags: card.getAttribute('data-tags') || ''
        };
    }
    function createCard(data) { const el = cardTemplate.content.firstElementChild.cloneNode(true); fillCard(el, data); return el; }

    themesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const card = btn.closest('.theme-card');
        const data = getCardData(card);
        if (action === 'view') {
            // Populate all view modal fields
            if (viewThemeImage) viewThemeImage.src = data.image;
            if (viewThemeTitle) viewThemeTitle.textContent = data.title;
            if (viewThemeId) viewThemeId.textContent = data.id;
            if (viewThemeDescription) viewThemeDescription.textContent = data.description;

            // Additional fields
            const viewThemeCategoryDetail = document.getElementById('viewThemeCategoryDetail');
            if (viewThemeAvailable) viewThemeAvailable.textContent = (data.status === 'active') ? 'Yes' : 'No';

            if (viewThemeCategoryDetail) viewThemeCategoryDetail.textContent = data.category.charAt(0).toUpperCase() + data.category.slice(1);
            

            // Mark current card for quick actions
            document.querySelectorAll('.theme-card').forEach(card => card.removeAttribute('data-current'));
            card.setAttribute('data-current', 'true');

            // Update quick action button text based on current status
            const quickToggleBtn = document.getElementById('quickToggleStatus');
            if (quickToggleBtn) {
                const icon = quickToggleBtn.querySelector('i');
                const text = quickToggleBtn.querySelector('span') || quickToggleBtn.childNodes[quickToggleBtn.childNodes.length - 1];
                if (data.status === 'active') {
                    if (icon) icon.className = 'fas fa-eye-slash';
                    if (text) text.textContent = 'Hide Theme';
                } else {
                    if (icon) icon.className = 'fas fa-eye';
                    if (text) text.textContent = 'Show Theme';
                }
            }

            openViewTheme();
        } else if (action === 'edit') {
            themeId.value = data.id;
            themeTitle.value = data.title;
            themeDescription.value = data.description;
            // Set image preview if editing existing theme
            if (data.image && (data.image.startsWith('http') || data.image.startsWith('..'))) {
                const preview = document.getElementById('themeImagePreview');
                const previewImg = document.getElementById('themePreviewImage');
                if (preview && previewImg) {
                    previewImg.src = data.image;
                    preview.style.display = 'block';
                    document.getElementById('themeUploadArea').style.display = 'none';
                }
            }
            if (themeCategory) themeCategory.value = data.category || 'birthday';
            if (themeAvailable) themeAvailable.value = data.status === 'active' ? 'true' : 'false';
            editingRow = card;
            openThemeModal('<i class="fas fa-edit" style="color: var(--orange-yellow);"></i> Edit theme');
        } else if (action === 'hide') {
            setStatusBadge(card.querySelector('.badge.status'), 'hidden');
            showToast('Theme hidden', `${data.title} is now hidden.`, 'warning');
            applyFilters();
        } else if (action === 'activate') {
            setStatusBadge(card.querySelector('.badge.status'), 'active');
            showToast('Theme activated', `${data.title} is now active.`, 'success');
            applyFilters();
        } else if (action === 'delete') {
            card.parentNode.removeChild(card);
            showToast('Theme deleted', `${data.title} has been removed.`, 'error');
            applyFilters();
        }
    });

    const addThemeBtn = document.getElementById('addThemeBtn');
    // Auto-generate theme ID
    function generateThemeId() {
        const existingCards = themesGrid.querySelectorAll('.theme-card');
        const existingIds = Array.from(existingCards).map(card => {
            const id = card.querySelector('.theme-id')?.textContent;
            return id ? parseInt(id.replace('TH-', '')) : 0;
        });

        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 1000;
        return `TH-${maxId + 1}`;
    }

    if (addThemeBtn) addThemeBtn.addEventListener('click', () => {
        themeForm.reset();
        // Reset image preview
        const preview = document.getElementById('themeImagePreview');
        const uploadArea = document.getElementById('themeUploadArea');
        if (preview) preview.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'block';

        // Auto-generate theme ID
        if (themeId) {
            themeId.value = generateThemeId();
        }

        editingRow = null;
        openThemeModal('<i class="fas fa-plus" style="color: var(--bright-blue);"></i> Add theme');
    });

    // Form validation
    function validateForm() {
        const errors = [];

        // Required field validation
        if (!themeId.value.trim()) {
            errors.push('Theme ID is required');
            themeId.classList.add('error');
        } else {
            themeId.classList.remove('error');
        }

        if (!themeTitle.value.trim()) {
            errors.push('Title is required');
            themeTitle.classList.add('error');
        } else {
            themeTitle.classList.remove('error');
        }

        if (!themeDescription.value.trim()) {
            errors.push('Description is required');
            themeDescription.classList.add('error');
        } else {
            themeDescription.classList.remove('error');
        }

        // Check for duplicate ID
        if (themeId.value.trim()) {
            const existingCards = themesGrid.querySelectorAll('.theme-card');
            const isDuplicate = Array.from(existingCards).some(card => {
                const cardId = card.querySelector('.theme-id')?.textContent;
                return cardId === themeId.value.trim() && card !== editingRow;
            });

            if (isDuplicate) {
                errors.push('Theme ID already exists');
                themeId.classList.add('error');
            }
        }

        // no price validation in simplified form

        return errors;
    }

    // Real-time validation
    if (themeId) {
        themeId.addEventListener('blur', () => {
            if (themeId.value.trim()) {
                const existingCards = themesGrid.querySelectorAll('.theme-card');
                const isDuplicate = Array.from(existingCards).some(card => {
                    const cardId = card.querySelector('.theme-id')?.textContent;
                    return cardId === themeId.value.trim() && card !== editingRow;
                });

                if (isDuplicate) {
                    themeId.classList.add('error');
                    showFieldError(themeId, 'Theme ID already exists');
                } else {
                    themeId.classList.remove('error');
                    clearFieldError(themeId);
                }
            }
        });
    }

    if (themeTitle) {
        themeTitle.addEventListener('input', () => {
            if (themeTitle.value.trim()) {
                themeTitle.classList.remove('error');
                clearFieldError(themeTitle);
            }
        });
    }

    if (themeDescription) {
        themeDescription.addEventListener('input', () => {
            if (themeDescription.value.trim()) {
                themeDescription.classList.remove('error');
                clearFieldError(themeDescription);
            }
        });
    }

    // removed price input listeners

    // Auto-save form data
    const formFields = [themeId, themeTitle, themeDescription, themeCategory, themeAvailable];
    formFields.forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                saveFormDraft();
                updateFormProgress();
            });
            field.addEventListener('change', () => {
                saveFormDraft();
                updateFormProgress();
            });
        }
    });

    // Auto-save when image changes
    if (themePreviewImage) {
        const observer = new MutationObserver(() => {
            if (themePreviewImage.src) {
                saveFormDraft();
            }
        });
        observer.observe(themePreviewImage, { attributes: true, attributeFilter: ['src'] });
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    if (themeForm) themeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            showToast('Validation Error', errors.join(', '), 'error');
            return;
        }

        // Handle image - get from preview or use default
        let imageUrl = '../../images/celebrate2.jpg'; // default
        const previewImg = document.getElementById('themePreviewImage');
        if (previewImg && previewImg.src) {
            imageUrl = previewImg.src;
        }

        const data = {
            id: themeId.value.trim(),
            title: themeTitle.value.trim(),
            description: themeDescription.value.trim(),
            image: imageUrl,
            status: (themeAvailable && themeAvailable.value === 'true') ? 'active' : 'hidden',
            category: themeCategory ? themeCategory.value : 'birthday'
        };

        if (editingRow) {
            fillCard(editingRow, data);
            showToast('Theme updated', `${data.title} has been saved.`, 'success');
        } else {
            const card = createCard(data);
            themesGrid.prepend(card);
            showToast('Theme created', 'A new theme has been added.', 'success');
        }

        // Clear draft after successful save
        clearFormDraft();
        applyFilters();
        closeThemeModal();
    });
});

function showToast(title, message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const template = document.getElementById('toast-template');
    const toast = template.content.firstElementChild.cloneNode(true);
    let iconClass = 'fas fa-info-circle';
    let iconColor = '#368BFF';
    if (type === 'success') { iconClass = 'fas fa-check-circle'; iconColor = '#2ecc71'; }
    else if (type === 'warning') { iconClass = 'fas fa-exclamation-triangle'; iconColor = '#FFB11B'; }
    else if (type === 'error') { iconClass = 'fas fa-times-circle'; iconColor = '#e74c3c'; }
    const iconWrap = toast.querySelector('.toast-icon');
    const iconEl = toast.querySelector('.toast-icon i');
    const titleEl = toast.querySelector('.toast-title');
    const msgEl = toast.querySelector('.toast-message');
    const closeBtn = toast.querySelector('.toast-close');
    iconWrap.style.backgroundColor = iconColor; iconEl.className = iconClass; titleEl.textContent = title; msgEl.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) { toast.style.animation = 'slideIn .3s ease-out reverse'; setTimeout(() => { if (toast.parentNode) toast.parentNode.remove(); }, 300); } }, 5000);
    closeBtn.addEventListener('click', () => { toast.style.animation = 'slideIn .3s ease-out reverse'; setTimeout(() => { if (toast.parentNode) toast.parentNode.remove(); }, 300); });
}


