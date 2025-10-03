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

    const form = document.getElementById('commissionForm');
    const commission = document.getElementById('commission');
    const effectiveFrom = document.getElementById('effectiveFrom');
    const resetBtn = document.getElementById('resetCommission');

    function load() {
        commission.value = localStorage.getItem('financials_commission') || '';
        effectiveFrom.value = localStorage.getItem('financials_effectiveFrom') || '';
    }
    function save() {
        localStorage.setItem('financials_commission', commission.value.trim());
        localStorage.setItem('financials_effectiveFrom', effectiveFrom.value.trim());
    }

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = parseFloat(commission.value);
        if (isNaN(val) || val < 0 || val > 100) { showToast('Invalid commission', 'Enter a value between 0 and 100.', 'warning'); return; }
        save();
        showToast('Saved', 'Commission settings updated.', 'success');
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        localStorage.removeItem('financials_commission');
        localStorage.removeItem('financials_effectiveFrom');
        form.reset();
        showToast('Reset', 'Commission form cleared.', 'warning');
    });

    load();
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


