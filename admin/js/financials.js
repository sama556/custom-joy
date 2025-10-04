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
        commission.value = localStorage.getItem('financials_commission') || commissionData.current.rate;
        effectiveFrom.value = localStorage.getItem('financials_effectiveFrom') || commissionData.current.effectiveSince;
        updateCommissionDisplay();
    }
    
    function save() {
        localStorage.setItem('financials_commission', commission.value.trim());
        localStorage.setItem('financials_effectiveFrom', effectiveFrom.value.trim());
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


