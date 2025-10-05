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
    
    // Commission display elements
    const currentCommission = document.getElementById('currentCommission');
    const commissionNumber = document.getElementById('commissionNumber');
    const lastUpdated = document.getElementById('lastUpdated');
    const effectiveSince = document.getElementById('effectiveSince');
    const commissionHistory = document.getElementById('commissionHistory');

    // Commission data structure
    let commissionData = {
        current: {
            rate: 15.5,
            number: 'COM-2025-001',
            lastUpdated: '2025-01-15',
            effectiveSince: '2025-01-01'
        },
        history: [
            { rate: 15.5, date: '2025-01-15', number: 'COM-2025-001' },
            { rate: 12.0, date: '2025-12-01', number: 'COM-2025-012' },
            { rate: 10.0, date: '2025-10-15', number: 'COM-2025-010' }
        ]
    };

    function load() {
        if (commission) commission.value = localStorage.getItem('financials_commission') || commissionData.current.rate;
        if (effectiveFrom) effectiveFrom.value = localStorage.getItem('financials_effectiveFrom') || commissionData.current.effectiveSince;
        updateCommissionDisplay();
    }
    
    function save() {
        if (commission) localStorage.setItem('financials_commission', (commission.value || '').trim());
        if (effectiveFrom) localStorage.setItem('financials_effectiveFrom', (effectiveFrom.value || '').trim());
    }
    
    function updateCommissionDisplay() {
        if (currentCommission) currentCommission.textContent = `${commissionData.current.rate}%`;
        if (commissionNumber) commissionNumber.textContent = commissionData.current.number;
        if (lastUpdated) lastUpdated.textContent = commissionData.current.lastUpdated;
        if (effectiveSince) effectiveSince.textContent = commissionData.current.effectiveSince;
        
        if (commissionHistory) {
            commissionHistory.innerHTML = commissionData.history.map(item => `
                <div class="history-item">
                    <div class="history-rate">${item.rate}%</div>
                    <div class="history-details">
                        <div class="history-date">${item.date}</div>
                        <div class="history-number">${item.number}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = parseFloat(commission.value);
        if (isNaN(val) || val < 0 || val > 100) { showToast('Invalid commission', 'Enter a value between 0 and 100.', 'warning'); return; }
        
        // Update commission data
        const newCommissionNumber = `COM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
        const today = new Date().toISOString().slice(0, 10);
        
        // Add to history
        commissionData.history.unshift({
            rate: val,
            date: today,
            number: newCommissionNumber
        });
        
        // Update current
        commissionData.current = {
            rate: val,
            number: newCommissionNumber,
            lastUpdated: today,
            effectiveSince: effectiveFrom.value || today
        };
        
        save();
        updateCommissionDisplay();
        showToast('Saved', 'Commission settings updated.', 'success');
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        localStorage.removeItem('financials_commission');
        localStorage.removeItem('financials_effectiveFrom');
        form.reset();
        showToast('Reset', 'Commission form cleared.', 'warning');
    });

    load();

    // Commission management table & modals
    const table = document.getElementById('commissionTable');
    const cmCount = document.getElementById('cmCount');
    const addBtn = document.getElementById('addCommissionBtn');
    const addModal = document.getElementById('addCommissionModal');
    const addForm = document.getElementById('addCommissionForm');
    const cancelAdd = document.getElementById('cancelAddCommission');
    const viewModal = document.getElementById('viewCommissionModal');
    const closeViewTop = document.getElementById('closeViewCommission');
    const closeViewBottom = document.getElementById('closeViewCommissionBottom');
    const vc = { id: document.getElementById('vc_id'), price: document.getElementById('vc_price'), date: document.getElementById('vc_date') };

    function open(el){ if (!el) return; el.classList.add('open'); el.setAttribute('aria-hidden','false'); }
    function close(el){ if (!el) return; el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }

    function updateCount(){ if (table && cmCount){ const rows = table.querySelectorAll('tbody tr'); cmCount.textContent = `${rows.length} item${rows.length !== 1 ? 's' : ''}`; } }
    updateCount();

    function getRowData(tr){
        return {
            id: tr.getAttribute('data-commission-id') || tr.querySelector('.cm-id')?.textContent?.trim() || '—',
            price: tr.getAttribute('data-price') || tr.querySelector('.cm-price')?.textContent?.trim() || '—',
            date: tr.getAttribute('data-date') || tr.querySelector('.cm-date')?.textContent?.trim() || '—'
        };
    }
    function populateView(data){ if (vc.id){ vc.id.textContent = data.id; vc.price.textContent = data.price; vc.date.textContent = data.date; } }

    if (table) table.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const tr = btn.closest('tr');
        if (!action || !tr) return;
        if (action === 'view') { populateView(getRowData(tr)); open(viewModal); }
        else if (action === 'delete') { tr.remove(); updateCount(); showToast('Deleted', 'Commission removed.', 'warning'); }
    });

    if (addBtn) addBtn.addEventListener('click', () => { open(addModal); });
    if (cancelAdd) cancelAdd.addEventListener('click', () => { close(addModal); });
    if (addModal) addModal.addEventListener('click', (e) => { if (e.target === addModal) close(addModal); });
    if (viewModal) viewModal.addEventListener('click', (e) => { if (e.target === viewModal) close(viewModal); });
    if (closeViewTop) closeViewTop.addEventListener('click', () => close(viewModal));
    if (closeViewBottom) closeViewBottom.addEventListener('click', () => close(viewModal));

    if (addForm) addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idEl = document.getElementById('cmId');
        const priceEl = document.getElementById('cmPrice');
        const dateEl = document.getElementById('cmDate');
        const id = (idEl?.value?.trim()) || `COM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
        const price = priceEl?.value?.trim() || '';
        const date = dateEl?.value || '';
        if (!price || !date){ showToast('Missing fields', 'Please enter price and date.', 'warning'); return; }
        const tr = document.createElement('tr');
        tr.setAttribute('data-commission-id', id);
        tr.setAttribute('data-price', price);
        tr.setAttribute('data-date', date);
        tr.innerHTML = `
            <td class="cm-id">${id}</td>
            <td class="cm-price">${price}</td>
            <td class="cm-date">${date}</td>
            <td>
                <div class="row-actions">
                    <button class="icon-btn view" data-action="view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="icon-btn danger" data-action="delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>`;
        table.querySelector('tbody').prepend(tr);
        updateCount();
        showToast('Added', 'Commission record added.', 'success');
        close(addModal);
        addForm.reset();
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


