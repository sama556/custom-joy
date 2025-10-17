// My Account interactions

AOS.init({ duration: 800, once: true });

// Tabs
document.querySelectorAll('.account-nav .list-group-item').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.account-nav .list-group-item').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const target = this.getAttribute('data-target');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const pane = document.querySelector(target);
        if (pane) pane.classList.add('active');
        try { AOS.refreshHard(); } catch { }
    });
});

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('active'); } else { scrollTopBtn.classList.remove('active'); }
});
scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// Initialize cart badge from localStorage
function loadCart() { try { return JSON.parse(localStorage.getItem('cj_cart') || '[]'); } catch { return []; } }
(function initBadge() {
    const items = loadCart();
    const count = items.reduce((s, i) => s + (i.qty || 0), 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
})();

// Mock data aligned with provided schema
const CURRENT_USER = {
    userId: 501,
    name: 'Sara Al‑Mutairi',
    email: 'customer@example.com',
    phone: '+966 5X XXX XXXX',
    password: '••••••••',
    userType: 'customer', // customer | vendor | admin
    status: 'active', // active | suspended
    createdAt: '2025-01-10'
};

const STAFF = [
    { staffId: 1, name: 'Admin One', phone: '+966 5X XXX XXXX', email: 'admin1@site.com', role: 'Admin', addedAt: '2025-02-01' },
    { staffId: 2, name: 'Support Agent', phone: '+966 5X XXX XXXX', email: 'support@site.com', role: 'Support', addedAt: '2025-03-12' }
];

const ADDRESSES = [
    { addressId: 12, userId: 501, vendorId: null, title: 'Home', city: 'Riyadh', district: 'Al Olaya', street: 'King Fahd Rd', extra: 'Apartment 12B', map: '24.7136, 46.6753' },
    { addressId: 33, userId: 501, vendorId: 21, title: 'Office', city: 'Riyadh', district: 'King Abdullah', street: 'Olaya St', extra: 'Floor 5', map: '24.726, 46.72' }
];

// Populate profile extended fields if present
document.addEventListener('DOMContentLoaded', () => {
    const first = document.getElementById('firstName');
    const last = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    if (first && last && email && phone) {
        const [fn, ...ln] = CURRENT_USER.name.split(' ');
        first.value = fn || '';
        last.value = ln.join(' ') || '';
        email.value = CURRENT_USER.email;
        phone.value = CURRENT_USER.phone;
    }
    // Render staff list if container exists
    const staffTbody = document.getElementById('staffTableBody');
    if (staffTbody) {
        staffTbody.innerHTML = STAFF.map(s => `
            <tr>
                <td>#${s.staffId}</td>
                <td>${s.name}</td>
                <td>${s.phone}</td>
                <td>${s.email}</td>
                <td>${s.role}</td>
                <td>${s.addedAt}</td>
            </tr>
        `).join('');
    }
    // Render addresses
    const addrList = document.getElementById('addressesList');
    if (addrList) {
        addrList.innerHTML = ADDRESSES.map(a => `
            <div class="address-card p-3 rounded-3 border">
                <div class="d-flex justify-content-between">
                    <strong>${a.title}</strong>
                    <span class="text-muted small">#${a.addressId}${a.vendorId ? ` • Vendor #${a.vendorId}` : ''}</span>
                </div>
                <div class="text-muted small mt-2">City: ${a.city} • District: ${a.district}</div>
                <div class="text-muted small">Street: ${a.street}</div>
                <div class="text-muted small">Extra: ${a.extra || '-'}</div>
                <div class="text-muted small">Map: ${a.map}</div>
            </div>
        `).join('');
    }

    // Add Address handler
    const addBtn = document.getElementById('addAddressBtn');
    if (addBtn && addrList) {
        const modalEl = document.getElementById('addAddressModal');
        const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
        addBtn.addEventListener('click', function () { if (modal) modal.show(); });

        const form = document.getElementById('addressForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const title = document.getElementById('addrTitle').value.trim();
                const city = document.getElementById('addrCity').value.trim();
                const district = document.getElementById('addrDistrict').value.trim();
                const street = document.getElementById('addrStreet').value.trim();
                const extra = document.getElementById('addrExtra').value.trim();
                const map = document.getElementById('addrMap').value.trim();
                if (!title || !city || !district || !street) return;
                const newId = (ADDRESSES.length ? Math.max(...ADDRESSES.map(a => a.addressId)) : 0) + 1;
                const newAddress = {
                    addressId: newId,
                    userId: CURRENT_USER.userId,
                    vendorId: null,
                    title, city, district, street, extra, map
                };
                ADDRESSES.push(newAddress);
                const col = document.createElement('div');
                col.className = 'col-12';
                col.innerHTML = `
                    <div class="address-card p-3 rounded-3 border">
                        <div class="d-flex justify-content-between">
                            <strong>${newAddress.title}</strong>
                            <span class="text-muted small">#${newAddress.addressId}${newAddress.vendorId ? ` • Vendor #${newAddress.vendorId}` : ''}</span>
                        </div>
                        <div class="text-muted small mt-2">City: ${newAddress.city} • District: ${newAddress.district}</div>
                        <div class="text-muted small">Street: ${newAddress.street}</div>
                        <div class="text-muted small">Extra: ${newAddress.extra || '-'}</div>
                        <div class="text-muted small">Map: ${newAddress.map}</div>
                    </div>`;
                addrList.appendChild(col);
                if (modal) modal.hide();
                form.reset();
                Toastify({ text: 'Address added', duration: 2500, gravity: 'top', position: 'right', style: { background: 'linear-gradient(135deg, #FF4FA1, #e03d8c)' } }).showToast();
            });
        }
    }
});

// Basic client-side validation + success toast
document.getElementById('profileForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const first = document.getElementById('firstName');
    const last = document.getElementById('lastName');
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value);
    const phoneOk = /^\+?\d[\d\s\-]{7,}$/.test(phone.value);
    [email, phone, first, last].forEach(i => i.classList.remove('is-invalid'));
    let valid = true;
    if (!first.value.trim()) { first.classList.add('is-invalid'); valid = false; }
    if (!last.value.trim()) { last.classList.add('is-invalid'); valid = false; }
    if (!emailOk) { email.classList.add('is-invalid'); valid = false; }
    if (!phoneOk) { phone.classList.add('is-invalid'); valid = false; }
    if (!valid) return;
    Toastify({ text: '✅ Profile updated successfully', duration: 3000, gravity: 'top', position: 'right', style: { background: 'linear-gradient(135deg, #7ED7FF, #368BFF)' } }).showToast();
});


