document.addEventListener('DOMContentLoaded', function () {
    // Sign out (reuse pattern)
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');
    function openSignOut() { if (signOutModal) { signOutModal.classList.add('open'); signOutModal.setAttribute('aria-hidden', 'false'); } }
    function closeSignOut() { if (signOutModal) { signOutModal.classList.remove('open'); signOutModal.setAttribute('aria-hidden', 'true'); } }
    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openSignOut(); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', closeSignOut);
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeSignOut(); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => { closeSignOut(); showToast('Signed out', 'You have been signed out successfully.', 'success'); });

    const inqTable = document.getElementById('inqTable');
    const inqCount = document.getElementById('inqCount');

    const viewInqModal = document.getElementById('viewInqModal');
    const closeViewInq = document.getElementById('closeViewInq');
    const closeViewInqBottom = document.getElementById('closeViewInqBottom');
    function openView() { if (viewInqModal) { viewInqModal.classList.add('open'); viewInqModal.setAttribute('aria-hidden', 'false'); } }
    function closeView() { if (viewInqModal) { viewInqModal.classList.remove('open'); viewInqModal.setAttribute('aria-hidden', 'true'); } }
    if (closeViewInq) closeViewInq.addEventListener('click', closeView);
    if (closeViewInqBottom) closeViewInqBottom.addEventListener('click', closeView);
    if (viewInqModal) viewInqModal.addEventListener('click', (e) => { if (e.target === viewInqModal) closeView(); });

    const replyInqModal = document.getElementById('replyInqModal');
    const replyInqForm = document.getElementById('replyInqForm');
    const replyInqMessage = document.getElementById('replyInqMessage');
    const cancelReplyInq = document.getElementById('cancelReplyInq');
    function openReply() { if (replyInqModal) { replyInqModal.classList.add('open'); replyInqModal.setAttribute('aria-hidden', 'false'); } }
    function closeReply() { if (replyInqModal) { replyInqModal.classList.remove('open'); replyInqModal.setAttribute('aria-hidden', 'true'); replyInqForm?.reset(); } }
    if (cancelReplyInq) cancelReplyInq.addEventListener('click', closeReply);
    if (replyInqModal) replyInqModal.addEventListener('click', (e) => { if (e.target === replyInqModal) closeReply(); });

    function populateView(row){
        const get = (sel) => row.querySelector(sel)?.textContent || '';
        const getAttr = (name) => row.getAttribute(name) || '';
        const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setText('vi_inq_id', get('.inq-id') || getAttr('data-inquiry-id'));
        setText('vi_name', get('.inq-name') || getAttr('data-name'));
        setText('vi_email', get('.inq-email') || getAttr('data-email'));
        setText('vi_type', get('.inq-type') || getAttr('data-type'));
        setText('vi_text', get('.inq-text') || getAttr('data-text'));
        setText('vi_reply', get('.inq-reply') || getAttr('data-reply'));
        setText('vi_date', get('.inq-date') || getAttr('data-date'));
        setText('vi_reply_status', get('.inq-reply-status') || getAttr('data-reply-status'));
    }

    if (inqTable) {
        // count
        inqCount.textContent = `${inqTable.tBodies[0].rows.length} items`;
        inqTable.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const row = btn.closest('tr');
            if (action === 'view') {
                populateView(row);
                openView();
            } else if (action === 'reply') {
                openReply();
            } else if (action === 'delete') {
                row.parentNode.removeChild(row);
                inqCount.textContent = `${inqTable.tBodies[0].rows.length} items`;
                showToast('Deleted', 'Inquiry removed', 'error');
            }
        });
    }

    if (replyInqForm) replyInqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = (replyInqMessage?.value || '').trim();
        if (!msg) { showToast('Reply required', 'Please enter a reply.', 'warning'); return; }
        showToast('Reply sent', 'Your reply has been recorded.', 'success');
        closeReply();
    });
});

function showToast(title, message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const template = document.getElementById('toast-template');
    if (!toastContainer || !template) return;
    const toast = template.content.firstElementChild.cloneNode(true);
    let iconClass = 'fas fa-info-circle'; let iconColor = '#368BFF';
    if (type === 'success') { iconClass = 'fas fa-check-circle'; iconColor = '#2ecc71'; }
    else if (type === 'warning') { iconClass = 'fas fa-exclamation-triangle'; iconColor = '#FFB11B'; }
    else if (type === 'error') { iconClass = 'fas fa-times-circle'; iconColor = '#e74c3c'; }
    toast.querySelector('.toast-icon').style.backgroundColor = iconColor;
    toast.querySelector('.toast-icon i').className = iconClass;
    toast.querySelector('.toast-title').textContent = title;
    toast.querySelector('.toast-message').textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) { toast.style.animation = 'slideIn .3s ease-out reverse'; setTimeout(() => { if (toast.parentNode) toast.parentNode.remove(); }, 300); } }, 4500);
}


