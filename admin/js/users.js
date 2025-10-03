document.addEventListener('DOMContentLoaded', function () {
    // Modal wiring
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');

    function openModal() {
        signOutModal.classList.add('open');
        signOutModal.setAttribute('aria-hidden', 'false');
    }
    function closeModal() {
        signOutModal.classList.remove('open');
        signOutModal.setAttribute('aria-hidden', 'true');
    }
    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', closeModal);
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeModal(); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => {
        closeModal();
        showToast('Signed out', 'You have been signed out successfully.', 'success');
    });

    // Users table interactions
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const usersTable = document.getElementById('usersTable');
    const userCount = document.getElementById('userCount');
    const selectAll = document.getElementById('selectAll');

    // Add/Edit modal elements
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const userModalTitle = document.getElementById('userModalTitle');
    const cancelUserBtn = document.getElementById('cancelUser');
    const fullNameInput = document.getElementById('fullName');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');
    const statusInput = document.getElementById('status');
    const avatarUrlInput = document.getElementById('avatarUrl');
    const rowTemplate = document.getElementById('user-row-template');

    // View modal elements
    const viewUserModal = document.getElementById('viewUserModal');
    const viewAvatar = document.getElementById('viewAvatar');
    const viewName = document.getElementById('viewName');
    const viewUsername = document.getElementById('viewUsername');
    const viewEmail = document.getElementById('viewEmail');
    const viewRole = document.getElementById('viewRole');
    const viewStatus = document.getElementById('viewStatus');
    const viewJoined = document.getElementById('viewJoined');
    const closeViewUser = document.getElementById('closeViewUser');

    let currentEditingRow = null;

    function normalize(text) { return (text || '').toLowerCase(); }

    function applyFilters() {
        const q = normalize(searchInput.value);
        const role = roleFilter.value;
        const status = statusFilter.value;
        let visible = 0;
        [...usersTable.tBodies[0].rows].forEach(row => {
            const name = normalize(row.querySelector('.user-cell .name')?.textContent);
            const sub = normalize(row.querySelector('.user-cell .sub')?.textContent);
            const email = normalize(row.cells[2]?.textContent);
            const roleVal = row.querySelector('.badge.role')?.getAttribute('data-role');
            const statusVal = row.querySelector('.badge.status')?.getAttribute('data-status');

            const matchesQuery = !q || [name, sub, email].some(v => v && v.includes(q));
            const matchesRole = !role || roleVal === role;
            const matchesStatus = !status || statusVal === status;

            const show = matchesQuery && matchesRole && matchesStatus;
            row.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        userCount.textContent = `${visible} user${visible === 1 ? '' : 's'}`;
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    // Initial count
    applyFilters();

    // Select all
    if (selectAll) selectAll.addEventListener('change', () => {
        const rows = usersTable.tBodies[0].querySelectorAll('tr');
        rows.forEach(r => {
            if (r.style.display !== 'none') {
                const cb = r.querySelector('.row-select');
                if (cb) cb.checked = selectAll.checked;
            }
        });
    });

    // Helpers to open/close user modal
    function openUserModal(title) {
        userModalTitle.innerHTML = title;
        userModal.classList.add('open');
        userModal.setAttribute('aria-hidden', 'false');
    }

    function closeUserModal() {
        userModal.classList.remove('open');
        userModal.setAttribute('aria-hidden', 'true');
        userForm.reset();
        currentEditingRow = null;
    }

    if (cancelUserBtn) cancelUserBtn.addEventListener('click', closeUserModal);
    if (userModal) userModal.addEventListener('click', (e) => { if (e.target === userModal) closeUserModal(); });

    function getFormData() {
        return {
            name: fullNameInput.value.trim(),
            username: usernameInput.value.trim().startsWith('@') ? usernameInput.value.trim() : `@${usernameInput.value.trim()}`,
            email: emailInput.value.trim(),
            role: roleInput.value,
            status: statusInput.value,
            avatar: avatarUrlInput.value.trim() || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
            joined: new Date().toISOString().slice(0, 10)
        };
    }

    function applyRoleBadge(span, role) {
        span.className = 'badge role';
        span.setAttribute('data-role', role);
        if (role === 'customer') span.classList.add('customer');
        if (role === 'employee') span.classList.add('employee');
        if (role === 'admin') span.classList.add('admin');
        span.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    }

    function applyStatusBadge(span, status) {
        span.className = 'badge status';
        span.setAttribute('data-status', status);
        if (status === 'active') span.classList.add('active');
        if (status === 'suspended') span.classList.add('suspended');
        span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    function fillRowFromData(row, data) {
        const img = row.querySelector('.user-cell img');
        const nameEl = row.querySelector('.user-cell .name');
        const subEl = row.querySelector('.user-cell .sub');
        const emailEl = row.querySelector('.email');
        const joinedEl = row.querySelector('.joined') || row.querySelector('td:nth-child(6)');
        const roleSpan = row.querySelector('.badge.role');
        const statusSpan = row.querySelector('.badge.status');

        if (img) img.src = data.avatar;
        if (nameEl) nameEl.textContent = data.name;
        if (subEl) subEl.textContent = data.username;
        if (emailEl) emailEl.textContent = data.email;
        if (joinedEl) joinedEl.textContent = data.joined;
        if (roleSpan) applyRoleBadge(roleSpan, data.role);
        if (statusSpan) applyStatusBadge(statusSpan, data.status);
    }

    function getDataFromRow(row) {
        return {
            name: row.querySelector('.user-cell .name')?.textContent || '',
            username: row.querySelector('.user-cell .sub')?.textContent || '',
            email: row.querySelector('.email')?.textContent || row.cells[2]?.textContent || '',
            role: row.querySelector('.badge.role')?.getAttribute('data-role') || 'customer',
            status: row.querySelector('.badge.status')?.getAttribute('data-status') || 'active',
            avatar: row.querySelector('.user-cell img')?.getAttribute('src') || '',
            joined: row.querySelector('.joined')?.textContent || row.cells[5]?.textContent || new Date().toISOString().slice(0, 10)
        };
    }

    function createRow(data) {
        const tr = rowTemplate.content.firstElementChild.cloneNode(true);
        fillRowFromData(tr, data);
        return tr;
    }

    // Row actions
    usersTable.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const row = btn.closest('tr');
        const name = row.querySelector('.user-cell .name')?.textContent || 'User';
        if (action === 'view') {
            const data = getDataFromRow(row);
            if (viewAvatar) viewAvatar.src = data.avatar;
            if (viewName) viewName.textContent = data.name;
            if (viewUsername) viewUsername.textContent = data.username;
            if (viewEmail) viewEmail.textContent = data.email;
            if (viewRole) viewRole.textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1);
            if (viewStatus) viewStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            if (viewJoined) viewJoined.textContent = data.joined;
            if (viewUserModal) {
                viewUserModal.classList.add('open');
                viewUserModal.setAttribute('aria-hidden', 'false');
            }
        } else if (action === 'edit') {
            const data = getDataFromRow(row);
            fullNameInput.value = data.name;
            usernameInput.value = data.username.replace(/^@/, '');
            emailInput.value = data.email;
            roleInput.value = data.role;
            statusInput.value = data.status;
            avatarUrlInput.value = data.avatar.startsWith('http') ? data.avatar : '';
            currentEditingRow = row;
            openUserModal('<i class="fas fa-user-edit" style="color: var(--orange-yellow);"></i> Edit user');
        } else if (action === 'suspend') {
            showToast('User suspended', `${name} has been suspended.`, 'warning');
            const status = row.querySelector('.badge.status');
            if (status) { status.textContent = 'Suspended'; status.classList.remove('active'); status.classList.add('suspended'); status.setAttribute('data-status', 'suspended'); }
            applyFilters();
        } else if (action === 'activate') {
            showToast('User activated', `${name} is now active.`, 'success');
            const status = row.querySelector('.badge.status');
            if (status) { status.textContent = 'Active'; status.classList.remove('suspended'); status.classList.add('active'); status.setAttribute('data-status', 'active'); }
            applyFilters();
        } else if (action === 'delete') {
            row.parentNode.removeChild(row);
            showToast('User deleted', `${name} has been removed.`, 'error');
            applyFilters();
        }
    });

    // Close view modal
    if (closeViewUser) closeViewUser.addEventListener('click', () => {
        viewUserModal.classList.remove('open');
        viewUserModal.setAttribute('aria-hidden', 'true');
    });
    if (viewUserModal) viewUserModal.addEventListener('click', (e) => {
        if (e.target === viewUserModal) {
            viewUserModal.classList.remove('open');
            viewUserModal.setAttribute('aria-hidden', 'true');
        }
    });

    // Add user flow
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) addUserBtn.addEventListener('click', () => {
        userForm.reset();
        avatarUrlInput.value = '';
        currentEditingRow = null;
        openUserModal('<i class="fas fa-user-plus" style="color: var(--bright-blue);"></i> Add user');
    });

    if (userForm) userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData();
        if (currentEditingRow) {
            fillRowFromData(currentEditingRow, data);
            showToast('User updated', `${data.name} has been saved.`, 'success');
        } else {
            const tbody = usersTable.tBodies[0];
            const row = createRow(data);
            tbody.prepend(row);
            showToast('User created', 'A new user has been added.', 'success');
        }
        applyFilters();
        closeUserModal();
    });
});

// Toast Notification Function (reused)
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

    iconWrap.style.backgroundColor = iconColor;
    iconEl.className = iconClass;
    titleEl.textContent = title;
    msgEl.textContent = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
        }
    }, 5000);
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    });
}


