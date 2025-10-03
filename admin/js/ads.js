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
    const adDescription = document.getElementById('adDescription');
    const adImage = document.getElementById('adImage');
    const adStatus = document.getElementById('adStatus');
    const adDuration = document.getElementById('adDuration');
    let editingCard = null;

    // View modal
    const viewAdModal = document.getElementById('viewAdModal');
    const viewAdImage = document.getElementById('viewAdImage');
    const viewAdTitle = document.getElementById('viewAdTitle');
    const viewAdId = document.getElementById('viewAdId');
    const viewAdDescription = document.getElementById('viewAdDescription');
    const viewAdStatus = document.getElementById('viewAdStatus');
    const viewAdDuration = document.getElementById('viewAdDuration');
    const closeViewAd = document.getElementById('closeViewAd');

    function openAdModal(title) { adModalTitle.innerHTML = title; adModal.classList.add('open'); adModal.setAttribute('aria-hidden', 'false'); }
    function closeAdModal() { adModal.classList.remove('open'); adModal.setAttribute('aria-hidden', 'true'); adForm.reset(); editingCard = null; }
    if (cancelAd) cancelAd.addEventListener('click', closeAdModal);
    if (adModal) adModal.addEventListener('click', (e) => { if (e.target === adModal) closeAdModal(); });

    function openViewAd() { viewAdModal.classList.add('open'); viewAdModal.setAttribute('aria-hidden', 'false'); }
    function closeViewAdModal() { viewAdModal.classList.remove('open'); viewAdModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewAd) closeViewAd.addEventListener('click', closeViewAdModal);
    if (viewAdModal) viewAdModal.addEventListener('click', (e) => { if (e.target === viewAdModal) closeViewAdModal(); });

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
        if (descEl) descEl.textContent = data.description;
        if (durationEl) durationEl.innerHTML = `<i class="far fa-clock"></i> ${data.duration || ''}`;
        if (statusEl) setStatusBadge(statusEl, data.status);
        card.setAttribute('data-status', data.status);
    }

    function getCardData(card) {
        return {
            id: card.querySelector('.ad-id')?.textContent || '',
            title: card.querySelector('.ad-title')?.textContent || '',
            description: card.querySelector('.ad-desc')?.textContent || '',
            image: (card.querySelector('.ad-thumb')?.getAttribute('style') || '').replace(/^.*url\(['"]?/, '').replace(/["']?\).*$/, ''),
            status: card.querySelector('.badge.status')?.getAttribute('data-status') || 'active',
            duration: (card.querySelector('.ad-duration')?.textContent || '').replace(/^\s*\w+\s*/, '').trim()
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
            if (viewAdDescription) viewAdDescription.textContent = data.description;
            if (viewAdStatus) viewAdStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            if (viewAdDuration) viewAdDuration.textContent = data.duration;
            openViewAd();
        } else if (action === 'edit') {
            adId.value = data.id;
            adTitle.value = data.title;
            adDescription.value = data.description;
            adImage.value = data.image.startsWith('http') || data.image.startsWith('/') ? data.image : '';
            adStatus.value = data.status;
            adDuration.value = data.duration;
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
        adImage.value = '';
        editingCard = null;
        openAdModal('<i class="fas fa-plus" style="color: var(--bright-blue);"></i> Add ad');
    });

    if (adForm) adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            id: adId.value.trim(),
            title: adTitle.value.trim(),
            description: adDescription.value.trim(),
            status: adStatus.value,
            duration: adDuration.value.trim(),
            image: adImage.value.trim() || '../../images/celebrate.jpg'
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


