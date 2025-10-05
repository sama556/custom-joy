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

    // Contact table interactions
    const contactTable = document.getElementById('contactTable');
    const msgCount = document.getElementById('msgCount');
    const viewModal = document.getElementById('viewMsgModal');
    const closeViewMsg = document.getElementById('closeViewMsg');
    const closeViewMsgBottom = document.getElementById('closeViewMsgBottom');
    const vm = {
        id: document.getElementById('vm_message_id'),
        name: document.getElementById('vm_name'),
        email: document.getElementById('vm_email'),
        phone: document.getElementById('vm_phone'),
        subject: document.getElementById('vm_subject'),
        text: document.getElementById('vm_text'),
        date: document.getElementById('vm_date'),
        status: document.getElementById('vm_status')
    };

    function openViewModal() { if (viewModal) { viewModal.classList.add('open'); viewModal.setAttribute('aria-hidden','false'); } }
    function closeViewModal() { if (viewModal) { viewModal.classList.remove('open'); viewModal.setAttribute('aria-hidden','true'); } }

    function getRowData(tr){
        return {
            id: tr.getAttribute('data-message-id') || tr.querySelector('.msg-id')?.textContent?.trim() || '',
            name: tr.getAttribute('data-name') || tr.querySelector('.msg-name')?.textContent?.trim() || '',
            email: tr.getAttribute('data-email') || tr.querySelector('.msg-email')?.textContent?.trim() || '',
            phone: tr.getAttribute('data-phone') || tr.querySelector('.msg-phone')?.textContent?.trim() || '',
            subject: tr.getAttribute('data-subject') || tr.querySelector('.msg-subject')?.textContent?.trim() || '',
            text: tr.getAttribute('data-text') || tr.querySelector('.msg-text')?.textContent?.trim() || '',
            date: tr.getAttribute('data-date') || tr.querySelector('.msg-date')?.textContent?.trim() || '',
            status: tr.getAttribute('data-status') || tr.querySelector('.msg-status')?.textContent?.trim() || ''
        };
    }

    function populateView(data){
        if (!vm.id) return;
        vm.id.textContent = data.id || '—';
        vm.name.textContent = data.name || '—';
        vm.email.textContent = data.email || '—';
        vm.phone.textContent = data.phone || '—';
        vm.subject.textContent = data.subject || '—';
        vm.text.textContent = data.text || '—';
        vm.date.textContent = data.date || '—';
        vm.status.textContent = data.status || '—';
    }

    function updateCount(){
        if (!contactTable || !msgCount) return;
        const rows = contactTable.querySelectorAll('tbody tr');
        msgCount.textContent = `${rows.length} item${rows.length !== 1 ? 's' : ''}`;
    }
    updateCount();

    if (contactTable) contactTable.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const tr = btn.closest('tr');
        if (!action || !tr) return;
        if (action === 'view'){
            const data = getRowData(tr);
            populateView(data);
            openViewModal();
        } else if (action === 'delete'){
            tr.remove();
            updateCount();
            showToast('Deleted', 'Message removed.', 'warning');
        }
    });

    if (closeViewMsg) closeViewMsg.addEventListener('click', closeViewModal);
    if (closeViewMsgBottom) closeViewMsgBottom.addEventListener('click', closeViewModal);
    if (viewModal) viewModal.addEventListener('click', (e) => { if (e.target === viewModal) closeViewModal(); });
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


