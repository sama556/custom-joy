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

    const form = document.getElementById('contactForm');
    const resetBtn = document.getElementById('resetForm');
    const fields = ['supportEmail', 'supportPhone', 'whatsapp', 'website', 'address', 'twitter', 'instagram', 'facebook', 'tiktok', 'hours', 'notes'];

    function loadData() {
        fields.forEach(id => {
            const el = document.getElementById(id);
            const val = localStorage.getItem(`contact_${id}`) || '';
            if (el) el.value = val;
        });
    }
    function saveData() {
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) localStorage.setItem(`contact_${id}`, el.value.trim());
        });
    }

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveData();
        showToast('Saved', 'Contact information updated.', 'success');
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        localStorage.removeItem('contact_supportEmail');
        localStorage.removeItem('contact_supportPhone');
        localStorage.removeItem('contact_whatsapp');
        localStorage.removeItem('contact_website');
        localStorage.removeItem('contact_address');
        localStorage.removeItem('contact_twitter');
        localStorage.removeItem('contact_instagram');
        localStorage.removeItem('contact_facebook');
        localStorage.removeItem('contact_tiktok');
        localStorage.removeItem('contact_hours');
        localStorage.removeItem('contact_notes');
        form.reset();
        showToast('Reset', 'Form cleared.', 'warning');
    });

    loadData();
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


