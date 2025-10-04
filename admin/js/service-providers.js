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
    const spSearch = document.getElementById('spSearch');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const spTable = document.getElementById('spTable');
    const spCount = document.getElementById('spCount');
    const selectAll = document.getElementById('selectAll');
    const rowTemplate = document.getElementById('sp-row-template');

    // Modals for Add/Edit
    const spModal = document.getElementById('spModal');
    const spForm = document.getElementById('spForm');
    const spModalTitle = document.getElementById('spModalTitle');
    const cancelSp = document.getElementById('cancelSp');
    const spProviderId = document.getElementById('spProviderId');
    const spUserId = document.getElementById('spUserId');
    const spStore = document.getElementById('spStore');
    const spType = document.getElementById('spType');
    const spStatus = document.getElementById('spStatus');
    const spDescription = document.getElementById('spDescription');
    let editingRow = null;

    // View modal
    const viewSpModal = document.getElementById('viewSpModal');
    const viewSpAvatar = document.getElementById('viewSpAvatar');
    const viewSpStore = document.getElementById('viewSpStore');
    const viewSpProviderId = document.getElementById('viewSpProviderId');
    const viewSpUserId = document.getElementById('viewSpUserId');
    const viewSpType = document.getElementById('viewSpType');
    const viewSpTypeDetail = document.getElementById('viewSpTypeDetail');
    const viewSpStatus = document.getElementById('viewSpStatus');
    const viewSpDescription = document.getElementById('viewSpDescription');
    const viewSpStatusIndicator = document.getElementById('viewSpStatusIndicator');
    const closeViewSp = document.getElementById('closeViewSp');

    function openSpModal(title) { spModalTitle.innerHTML = title; spModal.classList.add('open'); spModal.setAttribute('aria-hidden', 'false'); }
    function closeSpModal() { spModal.classList.remove('open'); spModal.setAttribute('aria-hidden', 'true'); spForm.reset(); editingRow = null; }
    const cancelSpBtn = document.getElementById('cancelSpBtn');
    if (cancelSp) cancelSp.addEventListener('click', closeSpModal);
    if (cancelSpBtn) cancelSpBtn.addEventListener('click', closeSpModal);
    if (spModal) spModal.addEventListener('click', (e) => { if (e.target === spModal) closeSpModal(); });

    function openViewSp() { viewSpModal.classList.add('open'); viewSpModal.setAttribute('aria-hidden', 'false'); }
    function closeViewSpModal() { viewSpModal.classList.remove('open'); viewSpModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewSp) closeViewSp.addEventListener('click', closeViewSpModal);
    if (viewSpModal) viewSpModal.addEventListener('click', (e) => { if (e.target === viewSpModal) closeViewSpModal(); });

    function applyFilters() {
        const q = (spSearch.value || '').toLowerCase();
        const type = typeFilter.value;
        const status = statusFilter.value;
        let visible = 0;
        [...spTable.tBodies[0].rows].forEach(row => {
            const userId = (row.querySelector('.user-id')?.textContent || '').toLowerCase();
            const store = (row.querySelector('.store')?.textContent || '').toLowerCase();
            const description = (row.querySelector('.description')?.textContent || '').toLowerCase();
            const rowType = row.querySelector('.badge.type')?.getAttribute('data-type');
            const rowStatus = row.querySelector('.badge.status')?.getAttribute('data-status');
            const matchesQuery = !q || [userId, store, description].some(v => v.includes(q));
            const matchesType = !type || rowType === type;
            const matchesStatus = !status || rowStatus === status;
            const show = matchesQuery && matchesType && matchesStatus;
            row.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        spCount.textContent = `${visible} provider${visible === 1 ? '' : 's'}`;
    }

    if (spSearch) spSearch.addEventListener('input', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    applyFilters();

    if (selectAll) selectAll.addEventListener('change', () => {
        const rows = spTable.tBodies[0].querySelectorAll('tr');
        rows.forEach(r => {
            if (r.style.display !== 'none') {
                const cb = r.querySelector('.row-select');
                if (cb) cb.checked = selectAll.checked;
            }
        });
    });

    function setTypeBadge(span, type) {
        span.className = 'badge type';
        span.setAttribute('data-type', type);
        if (type === 'flowers') span.classList.add('flowers');
        if (type === 'cakes') span.classList.add('cakes');
        span.textContent = type === 'flowers' ? 'Florist' : 'Chef';
    }
    function setStatusBadge(span, status) {
        span.className = 'badge status';
        span.setAttribute('data-status', status);
        if (status === 'active') span.classList.add('active');
        if (status === 'suspended') span.classList.add('suspended');
        span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
    function fillRow(row, data) {
        row.querySelector('.user-id').textContent = data.userId;
        row.querySelector('.sp-cell .store').textContent = data.store;
        setTypeBadge(row.querySelector('.badge.type'), data.type);
        setStatusBadge(row.querySelector('.badge.status'), data.status);
        row.querySelector('.description').textContent = data.description;
    }
    function getRowData(row) {
        return {
            providerId: `SP-${String(Date.now()).slice(-3)}`, // Auto-generate provider ID
            userId: row.querySelector('.user-id')?.textContent || '',
            logo: `../../images/ceek4.jpg`, // Auto-generate logo
            store: row.querySelector('.sp-cell .store')?.textContent || '',
            type: row.querySelector('.badge.type')?.getAttribute('data-type') || 'flowers',
            description: row.querySelector('.description')?.textContent || '',
            status: row.querySelector('.badge.status')?.getAttribute('data-status') || 'active'
        };
    }
    function createRow(data) { const tr = rowTemplate.content.firstElementChild.cloneNode(true); fillRow(tr, data); return tr; }

    spTable.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const row = btn.closest('tr');
        const data = getRowData(row);
        if (action === 'view') {
            if (viewSpAvatar) viewSpAvatar.src = data.logo;
            if (viewSpStore) viewSpStore.textContent = data.store;
            if (viewSpProviderId) viewSpProviderId.textContent = data.providerId;
            if (viewSpUserId) viewSpUserId.textContent = data.userId;
            if (viewSpType) {
                viewSpType.textContent = data.type === 'flowers' ? 'Florist' : 'Chef';
                viewSpType.className = `sp-type-badge ${data.type}`;
            }
            if (viewSpTypeDetail) viewSpTypeDetail.textContent = data.type === 'flowers' ? 'Florist' : 'Chef';
            if (viewSpStatus) {
                viewSpStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
                viewSpStatus.className = `detail-value status-badge ${data.status}`;
            }
            if (viewSpStatusIndicator) {
                viewSpStatusIndicator.className = `sp-status-indicator ${data.status}`;
            }
            if (viewSpDescription) viewSpDescription.textContent = data.description;
            openViewSp();
        } else if (action === 'edit') {
            spProviderId.value = data.providerId;
            spUserId.value = data.userId;
            spStore.value = data.store;
            spType.value = data.type;
            spStatus.value = data.status;
            spDescription.value = data.description;
            editingRow = row;
            openSpModal('<i class="fas fa-user-edit" style="color: var(--orange-yellow);"></i> Edit provider');
        } else if (action === 'suspend') {
            setStatusBadge(row.querySelector('.badge.status'), 'suspended');
            showToast('Provider suspended', `${data.store} has been suspended.`, 'warning');
            applyFilters();
        } else if (action === 'activate') {
            setStatusBadge(row.querySelector('.badge.status'), 'active');
            showToast('Provider activated', `${data.store} is now active.`, 'success');
            applyFilters();
        } else if (action === 'delete') {
            row.parentNode.removeChild(row);
            showToast('Provider deleted', `${data.store} has been removed.`, 'error');
            applyFilters();
        }
    });

    const addProviderBtn = document.getElementById('addProviderBtn');
    if (addProviderBtn) addProviderBtn.addEventListener('click', () => {
        spForm.reset();
        editingRow = null;
        openSpModal('<i class="fas fa-user-plus" style="color: var(--bright-blue);"></i> Add supplier');
    });

    if (spForm) spForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            providerId: editingRow ? getRowData(editingRow).providerId : `SP-${String(Date.now()).slice(-3)}`,
            userId: spUserId.value.trim(),
            store: spStore.value.trim(),
            type: spType.value,
            status: spStatus.value,
            description: spDescription.value.trim(),
            logo: `../../images/flower1.jpg}`
        };
        if (editingRow) {
            fillRow(editingRow, data);
            showToast('Provider updated', `${data.store} has been saved.`, 'success');
        } else {
            const tbody = spTable.tBodies[0];
            const row = createRow(data);
            tbody.prepend(row);
            showToast('Provider created', 'A new provider has been added.', 'success');
        }
        applyFilters();
        closeSpModal();
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


