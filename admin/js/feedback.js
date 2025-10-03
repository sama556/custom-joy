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

    const fbSearch = document.getElementById('fbSearch');
    const ratingFilter = document.getElementById('ratingFilter');
    const statusFilter = document.getElementById('statusFilter');
    const fbTable = document.getElementById('fbTable');
    const fbCount = document.getElementById('fbCount');
    const selectAll = document.getElementById('selectAll');
    const rowTemplate = document.getElementById('fb-row-template');

    const viewFbModal = document.getElementById('viewFbModal');
    const closeViewFb = document.getElementById('closeViewFb');
    const viewAvatar = document.getElementById('viewAvatar');
    const viewName = document.getElementById('viewName');
    const viewSub = document.getElementById('viewSub');
    const viewOrder = document.getElementById('viewOrder');
    const viewRating = document.getElementById('viewRating');
    const viewComment = document.getElementById('viewComment');
    const viewProvider = document.getElementById('viewProvider');
    const viewProducts = document.getElementById('viewProducts');
    const viewStatus = document.getElementById('viewStatus');
    const viewDate = document.getElementById('viewDate');

    const replyModal = document.getElementById('replyModal');
    const replyForm = document.getElementById('replyForm');
    const replyMessage = document.getElementById('replyMessage');
    const cancelReply = document.getElementById('cancelReply');
    let replyingRow = null;

    function openReplyModal() { replyModal.classList.add('open'); replyModal.setAttribute('aria-hidden', 'false'); }
    function closeReplyModal() { replyModal.classList.remove('open'); replyModal.setAttribute('aria-hidden', 'true'); replyForm.reset(); replyingRow = null; }
    if (cancelReply) cancelReply.addEventListener('click', closeReplyModal);
    if (replyModal) replyModal.addEventListener('click', (e) => { if (e.target === replyModal) closeReplyModal(); });

    function openViewModal() { viewFbModal.classList.add('open'); viewFbModal.setAttribute('aria-hidden', 'false'); }
    function closeViewModal() { viewFbModal.classList.remove('open'); viewFbModal.setAttribute('aria-hidden', 'true'); }
    if (closeViewFb) closeViewFb.addEventListener('click', closeViewModal);
    if (viewFbModal) viewFbModal.addEventListener('click', (e) => { if (e.target === viewFbModal) closeViewModal(); });

    function setStatusBadge(span, status) {
        span.className = 'badge status';
        span.setAttribute('data-status', status);
        if (status === 'open') span.classList.add('open');
        if (status === 'replied') span.classList.add('replied');
        if (status === 'resolved') span.classList.add('resolved');
        if (status === 'flagged') span.classList.add('flagged');
        span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    function applyFilters() {
        const q = (fbSearch.value || '').toLowerCase();
        const ratingVal = ratingFilter.value;
        const statusVal = statusFilter.value;
        let visible = 0;
        [...fbTable.tBodies[0].rows].forEach(row => {
            const name = (row.querySelector('.user-cell .name')?.textContent || '').toLowerCase();
            const sub = (row.querySelector('.user-cell .sub')?.textContent || '').toLowerCase();
            const orderId = (row.querySelector('.order-id')?.textContent || '').toLowerCase();
            const comment = (row.querySelector('.comment')?.textContent || '').toLowerCase();
            const rowRating = row.querySelector('.rating')?.getAttribute('data-rating');
            const rowStatus = row.querySelector('.badge.status')?.getAttribute('data-status');
            const matchesQuery = !q || [name, sub, orderId, comment].some(v => v.includes(q));
            const matchesRating = !ratingVal || rowRating === ratingVal;
            const matchesStatus = !statusVal || rowStatus === statusVal;
            const show = matchesQuery && matchesRating && matchesStatus;
            row.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        fbCount.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
    }

    if (fbSearch) fbSearch.addEventListener('input', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    applyFilters();

    if (selectAll) selectAll.addEventListener('change', () => {
        const rows = fbTable.tBodies[0].querySelectorAll('tr');
        rows.forEach(r => {
            if (r.style.display !== 'none') {
                const cb = r.querySelector('.row-select');
                if (cb) cb.checked = selectAll.checked;
            }
        });
    });

    function getRowData(row) {
        return {
            avatar: row.querySelector('.user-cell img')?.getAttribute('src') || '',
            name: row.querySelector('.user-cell .name')?.textContent || '',
            username: row.querySelector('.user-cell .sub')?.textContent || '',
            orderId: row.querySelector('.order-id')?.textContent || '',
            rating: row.querySelector('.rating')?.getAttribute('data-rating') || '5',
            comment: row.querySelector('.comment')?.textContent || '',
            status: row.querySelector('.badge.status')?.getAttribute('data-status') || 'open',
            date: row.querySelector('.date')?.textContent || new Date().toISOString().slice(0, 10)
        };
    }

    fbTable.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const row = btn.closest('tr');
        const data = getRowData(row);
        if (action === 'view') {
            if (viewAvatar) viewAvatar.src = data.avatar;
            if (viewName) viewName.textContent = data.name;
            if (viewSub) viewSub.textContent = data.username;
            if (viewOrder) viewOrder.textContent = data.orderId;
            if (viewRating) viewRating.textContent = `${'★'.repeat(parseInt(data.rating, 10))}${'☆'.repeat(5 - parseInt(data.rating, 10))}`;
            if (viewComment) viewComment.textContent = data.comment;
            if (viewStatus) viewStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            if (viewDate) viewDate.textContent = data.date;
            if (viewProvider) viewProvider.textContent = (row.getAttribute('data-provider') || '').toString();
            if (viewProducts) {
                viewProducts.innerHTML = '';
                const productsAttr = row.getAttribute('data-products') || '[]';
                let items = [];
                try { items = JSON.parse(productsAttr); } catch (e) { items = []; }
                items.forEach(it => {
                    const li = document.createElement('li');
                    li.textContent = `${it.name} × ${it.qty}`;
                    viewProducts.appendChild(li);
                });
            }
            openViewModal();
        } else if (action === 'reply') {
            replyingRow = row;
            replyMessage.value = '';
            openReplyModal();
        } else if (action === 'resolve') {
            setStatusBadge(row.querySelector('.badge.status'), 'resolved');
            showToast('Feedback resolved', `${data.name}'s feedback marked as resolved.`, 'success');
            applyFilters();
        } else if (action === 'flag') {
            setStatusBadge(row.querySelector('.badge.status'), 'flagged');
            showToast('Feedback flagged', `${data.name}'s feedback flagged for review.`, 'warning');
            applyFilters();
        } else if (action === 'delete') {
            row.parentNode.removeChild(row);
            showToast('Feedback deleted', `${data.name}'s feedback has been removed.`, 'error');
            applyFilters();
        }
    });

    if (replyForm) replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = replyMessage.value.trim();
        if (!msg) { showToast('Reply required', 'Please enter a reply message.', 'warning'); return; }
        if (replyingRow) {
            setStatusBadge(replyingRow.querySelector('.badge.status'), 'replied');
            showToast('Reply sent', 'Your reply has been recorded.', 'success');
            applyFilters();
        }
        closeReplyModal();
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


