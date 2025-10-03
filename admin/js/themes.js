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
    const themeImage = document.getElementById('themeImage');
    const themeStatus = document.getElementById('themeStatus');
    let editingRow = null;

    // View modal
    const viewThemeModal = document.getElementById('viewThemeModal');
    const viewThemeImage = document.getElementById('viewThemeImage');
    const viewThemeTitle = document.getElementById('viewThemeTitle');
    const viewThemeId = document.getElementById('viewThemeId');
    const viewThemeDescription = document.getElementById('viewThemeDescription');
    const viewThemeStatus = document.getElementById('viewThemeStatus');
    const closeViewTheme = document.getElementById('closeViewTheme');

    function openThemeModal(title) { themeModalTitle.innerHTML = title; themeModal.classList.add('open'); themeModal.setAttribute('aria-hidden', 'false'); }
    function closeThemeModal() { themeModal.classList.remove('open'); themeModal.setAttribute('aria-hidden', 'true'); themeForm.reset(); editingRow = null; }
    if (cancelTheme) cancelTheme.addEventListener('click', closeThemeModal);
    if (themeModal) themeModal.addEventListener('click', (e) => { if (e.target === themeModal) closeThemeModal(); });

    function openViewTheme() { viewThemeModal.classList.add('open'); viewThemeModal.setAttribute('aria-hidden', 'false'); }
    function closeViewThemeModal() { viewThemeModal.classList.remove('open'); viewThemeModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewTheme) closeViewTheme.addEventListener('click', closeViewThemeModal);
    if (viewThemeModal) viewThemeModal.addEventListener('click', (e) => { if (e.target === viewThemeModal) closeViewThemeModal(); });

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
            status: card.querySelector('.badge.status')?.getAttribute('data-status') || 'active'
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
            if (viewThemeImage) viewThemeImage.src = data.image;
            if (viewThemeTitle) viewThemeTitle.textContent = data.title;
            if (viewThemeId) viewThemeId.textContent = data.id;
            if (viewThemeDescription) viewThemeDescription.textContent = data.description;
            if (viewThemeStatus) viewThemeStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            openViewTheme();
        } else if (action === 'edit') {
            themeId.value = data.id;
            themeTitle.value = data.title;
            themeDescription.value = data.description;
            themeImage.value = data.image.startsWith('http') || data.image.startsWith('..') ? data.image : '';
            themeStatus.value = data.status;
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
    if (addThemeBtn) addThemeBtn.addEventListener('click', () => {
        themeForm.reset();
        themeImage.value = '';
        editingRow = null;
        openThemeModal('<i class="fas fa-plus" style="color: var(--bright-blue);"></i> Add theme');
    });

    if (themeForm) themeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            id: themeId.value.trim(),
            title: themeTitle.value.trim(),
            description: themeDescription.value.trim(),
            image: themeImage.value.trim() || '../../images/celebrate2.jpg',
            status: themeStatus.value
        };
        if (editingRow) {
            fillRow(editingRow, data);
            showToast('Theme updated', `${data.title} has been saved.`, 'success');
        } else {
            const card = createCard(data);
            themesGrid.prepend(card);
            showToast('Theme created', 'A new theme has been added.', 'success');
        }
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


