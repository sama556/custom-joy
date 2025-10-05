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
    const adsSearch = document.getElementById('adsSearch');
    const statusFilter = document.getElementById('statusFilter');
    const adsGrid = document.getElementById('adsGrid');
    const adsCount = document.getElementById('adsCount');
    const cardTemplate = document.getElementById('ad-card-template');

    // Modals for Add/Edit
    const adModal = document.getElementById('adModal');
    const adForm = document.getElementById('adForm');
    const adModalTitle = document.getElementById('adModalTitle');
    const cancelAd = document.getElementById('cancelAd');
    const adId = document.getElementById('adId');
    const adTitle = document.getElementById('adTitle');
    const adLink = document.getElementById('adLink');
    const adDate = document.getElementById('adDate');
    const adActive = document.getElementById('adActive');
    const adImageFile = document.getElementById('adImageFile');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');
    let editingCard = null;

    // View modal
    const viewAdModal = document.getElementById('viewAdModal');
    const viewAdImage = document.getElementById('viewAdImage');
    const viewAdTitle = document.getElementById('viewAdTitle');
    const viewAdId = document.getElementById('viewAdId');
    // Removed legacy view fields (description/status/duration) in favor of Link/Date/Active
    const closeViewAd = document.getElementById('closeViewAd');

    function openAdModal(title) { adModalTitle.innerHTML = title; adModal.classList.add('open'); adModal.setAttribute('aria-hidden', 'false'); }
    function closeAdModal() {
        adModal.classList.remove('open');
        adModal.setAttribute('aria-hidden', 'true');
        adForm.reset();
        hideImagePreview();
        editingCard = null;
    }
    if (cancelAd) cancelAd.addEventListener('click', closeAdModal);
    if (adModal) adModal.addEventListener('click', (e) => { if (e.target === adModal) closeAdModal(); });

    function openViewAd() { viewAdModal.classList.add('open'); viewAdModal.setAttribute('aria-hidden', 'false'); }
    function closeViewAdModal() { viewAdModal.classList.remove('open'); viewAdModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewAd) closeViewAd.addEventListener('click', closeViewAdModal);
    if (viewAdModal) viewAdModal.addEventListener('click', (e) => { if (e.target === viewAdModal) closeViewAdModal(); });

    // Image handling
    function showImagePreview(src) {
        previewImage.src = src;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
    }

    function hideImagePreview() {
        uploadArea.style.display = 'block';
        imagePreview.style.display = 'none';
        previewImage.src = '';
        if (adImageFile) adImageFile.value = '';
    }

    if (uploadArea) {
        uploadArea.addEventListener('click', () => adImageFile?.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleImageFile(files[0]);
        });
    }

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Invalid file', 'Please select an image file.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => { showImagePreview(e.target.result); };
        reader.readAsDataURL(file);
    }

    if (adImageFile) adImageFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleImageFile(e.target.files[0]);
    });

    if (removeImage) removeImage.addEventListener('click', hideImagePreview);

    // No direct URL input anymore

    function setStatusBadge(span, status) {
        span.className = 'badge status';
        span.setAttribute('data-status', status);
        if (status === 'active') span.classList.add('active');
        if (status === 'scheduled') span.classList.add('scheduled');
        if (status === 'expired') span.classList.add('expired');
        if (status === 'hidden') span.classList.add('hidden');
        span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    function fillCard(card, data) {
        const thumb = card.querySelector('.ad-thumb');
        const idEl = card.querySelector('.ad-id');
        const titleEl = card.querySelector('.ad-title');
        const descEl = card.querySelector('.ad-desc');
        const durationEl = card.querySelector('.ad-duration');
        const statusEl = card.querySelector('.badge.status');
        if (thumb) thumb.style.backgroundImage = `url('${data.image}')`;
        if (idEl) idEl.textContent = data.id;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.link || '';
        if (durationEl) durationEl.innerHTML = `<i class="far fa-clock"></i> ${data.date || ''}`;
        const isActive = (data.active === true) || (data.active === 'true') || (data.active === 'yes');
        const status = isActive ? 'active' : 'hidden';
        if (statusEl) setStatusBadge(statusEl, status);
        card.setAttribute('data-status', status);
    }

    function getCardData(card) {
        return {
            id: card.querySelector('.ad-id')?.textContent || '',
            title: card.querySelector('.ad-title')?.textContent || '',
            link: card.querySelector('.ad-desc')?.textContent || '',
            image: (card.querySelector('.ad-thumb')?.getAttribute('style') || '').replace(/^.*url\(['"]?/, '').replace(/["']?\).*$/, ''),
            active: (card.getAttribute('data-status') === 'active'),
            date: (card.querySelector('.ad-duration')?.textContent || '').replace(/^\s*\w+\s*/, '').trim()
        };
    }

    function createCard(data) { const el = cardTemplate.content.firstElementChild.cloneNode(true); fillCard(el, data); return el; }

    function applyFilters() {
        const q = (adsSearch.value || '').toLowerCase();
        const status = statusFilter.value;
        let visible = 0;
        [...adsGrid.children].forEach(card => {
            if (!card.classList.contains('ad-card')) return;
            const title = (card.querySelector('.ad-title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.ad-desc')?.textContent || '').toLowerCase();
            const cardStatus = card.getAttribute('data-status');
            const matchesQuery = !q || title.includes(q) || desc.includes(q);
            const matchesStatus = !status || cardStatus === status;
            const show = matchesQuery && matchesStatus;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        adsCount.textContent = `${visible} ad${visible === 1 ? '' : 's'}`;
    }

    if (adsSearch) adsSearch.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    applyFilters();

    // Row actions on cards
    adsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const card = btn.closest('.ad-card');
        const data = getCardData(card);
        if (action === 'view') {
            if (viewAdImage) viewAdImage.src = data.image;
            if (viewAdTitle) viewAdTitle.textContent = data.title;
            if (viewAdId) viewAdId.textContent = data.id;
            const viewAdLink = document.getElementById('viewAdLink');
            const viewAdDate = document.getElementById('viewAdDate');
            const viewAdActive = document.getElementById('viewAdActive');
            if (viewAdLink) viewAdLink.textContent = data.link || '';
            if (viewAdDate) viewAdDate.textContent = data.date || '';
            if (viewAdActive) viewAdActive.textContent = (data.active ? 'Yes' : 'No');
            openViewAd();
        } else if (action === 'edit') {
            if (adId) adId.value = data.id;
            if (adTitle) adTitle.value = data.title;
            if (adLink) adLink.value = data.link || '';
            if (adDate) adDate.value = data.date || '';
            if (adActive) adActive.value = data.active ? 'yes' : 'no';
            if (data.image) {
                showImagePreview(data.image);
            } else {
                hideImagePreview();
            }
            editingCard = card;
            openAdModal('<i class="fas fa-pen" style="color: var(--orange-yellow);"></i> Edit ad');
        } else if (action === 'hide') {
            setStatusBadge(card.querySelector('.badge.status'), 'hidden');
            card.setAttribute('data-status', 'hidden');
            showToast('Ad hidden', `${data.title} is now hidden.`, 'warning');
            applyFilters();
        } else if (action === 'activate') {
            setStatusBadge(card.querySelector('.badge.status'), 'active');
            card.setAttribute('data-status', 'active');
            showToast('Ad activated', `${data.title} is now active.`, 'success');
            applyFilters();
        } else if (action === 'delete') {
            card.parentNode.removeChild(card);
            showToast('Ad deleted', `${data.title} has been removed.`, 'error');
            applyFilters();
        }
    });

    const addAdBtn = document.getElementById('addAdBtn');
    if (addAdBtn) addAdBtn.addEventListener('click', () => {
        adForm.reset();
        hideImagePreview();
        editingCard = null;
        openAdModal('<i class="fas fa-plus" style="color: var(--bright-blue);"></i> Add ad');
    });

    if (adForm) adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Compose data for six-field model
        let imageSrc = previewImage && previewImage.src ? previewImage.src : '../../images/celebrate.jpg';
        const data = {
            id: adId.value.trim(),
            title: adTitle.value.trim(),
            link: adLink ? adLink.value.trim() : '',
            date: adDate ? adDate.value : '',
            active: adActive ? (adActive.value === 'yes') : true,
            image: imageSrc
        };
        if (editingCard) {
            fillCard(editingCard, data);
            showToast('Ad updated', `${data.title} has been saved.`, 'success');
        } else {
            const el = createCard(data);
            adsGrid.prepend(el);
            showToast('Ad created', 'A new ad has been added.', 'success');
        }
        applyFilters();
        closeAdModal();
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


