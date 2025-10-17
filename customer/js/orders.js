// Orders page

AOS.init({ duration: 800, once: true });

// Load orders from localStorage and seed demo if empty
function loadOrders() {
    try { return JSON.parse(localStorage.getItem('cj_orders') || '[]'); } catch { return []; }
}

function saveOrders(list) {
    localStorage.setItem('cj_orders', JSON.stringify(list));
}

// Demo seeds (used if there are no saved orders)
const DEMO_ORDERS = [
    {
        id: 100245,
        userId: 501,
        date: '2025-10-10',
        subtotal: 333,
        deliveryFee: 15,
        total: 348,
        status: 'completed', // processing | in_progress | completed | cancelled | paid | unpaid
        addressId: 12,
        initialReview: { state: 'accepted', reason: '' }, // accepted | rejected + reason
        type: 'products', // custom | products
        notes: 'Please deliver before 2 PM',
        deliveryDate: '2025-10-12',
        images: ['../images/ceek2.jpg'],
        description: 'Birthday cake with roses',
        items: [
            { orderId: 100245, category: 'cakes', productId: 1, addonCategory: null, addonId: null, qty: 1, price: 199, notes: '' },
            { orderId: 100245, category: 'flowers', productId: 5, addonCategory: null, addonId: null, qty: 1, price: 134, notes: '' }
        ]
    },
    {
        id: 100246,
        userId: 501,
        date: '2025-10-12',
        subtotal: 149,
        deliveryFee: 15,
        total: 164,
        status: 'processing',
        addressId: 12,
        initialReview: { state: 'accepted', reason: '' },
        type: 'custom',
        notes: 'Use white roses',
        deliveryDate: '2025-10-15',
        images: ['../images/flower2.jpg'],
        description: 'Custom bouquet with specific colors',
        items: [
            { orderId: 100246, category: 'flowers', productId: 6, addonCategory: null, addonId: null, qty: 1, price: 149, notes: 'Add note card' }
        ]
    },
    {
        id: 100247,
        userId: 777,
        date: '2025-10-14',
        subtotal: 219,
        deliveryFee: 0,
        total: 219,
        status: 'in_progress',
        addressId: 33,
        initialReview: { state: 'rejected', reason: 'Out of stock' },
        type: 'products',
        notes: '',
        deliveryDate: '2025-10-20',
        images: [],
        description: 'Red velvet cake order',
        items: [
            { orderId: 100247, category: 'cakes', productId: 4, addonCategory: 'cakes', addonId: 101, qty: 1, price: 219, notes: '' }
        ]
    }
];

let ORDERS = loadOrders();
if (!ORDERS.length) {
    ORDERS = DEMO_ORDERS;
}

function statusBadge(status) {
    const map = {
        processing: 'status-processing',
        in_progress: 'status-shipped',
        completed: 'status-delivered',
        cancelled: 'status-cancelled',
        paid: 'status-delivered',
        unpaid: 'status-processing'
    };
    const cls = map[status] || 'status-processing';
    const txt = status.replace('_', ' ');
    return `<span class="badge status-badge ${cls}">${txt.charAt(0).toUpperCase() + txt.slice(1)}</span>`;
}

function renderTable(rows) {
    const tbody = document.getElementById('ordersTable');
    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="9"><div class="orders-empty"><div class="icon">📦</div>No orders found</div></td></tr>`;
        return;
    }
    tbody.innerHTML = rows.map(o => `
        <tr>
            <td>#${o.id}</td>
            <td>${o.userId}</td>
            <td>${o.date}</td>
            <td>${o.type === 'custom' ? 'Custom' : 'From Products'}</td>
            <td>${statusBadge(o.status)}</td>
            <td>SAR ${o.total}</td>
            <td>${o.deliveryDate || '-'}</td>
            <td>${o.initialReview?.state === 'accepted' ? 'Accepted' : 'Rejected'}</td>
            <td><button class="btn btn-sm btn-outline-secondary" data-order="${o.id}">View</button></td>
        </tr>
    `).join('');
}

function openOrder(id) {
    const order = ORDERS.find(o => o.id === id);
    if (!order) return;
    const body = document.getElementById('orderModalBody');
    const itemsHtml = order.items.map(i => `<div class="d-flex justify-content-between"><div>${i.qty} × ${i.category} #${i.productId}${i.addonId ? ` (+ addon #${i.addonId})` : ''}</div><div>SAR ${i.price * i.qty}</div></div>`).join('');
    const imagesHtml = (order.images && order.images.length)
        ? `<div class="mb-2">${order.images.map(src => `<img src="${src}" alt="ref" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-right:8px;">`).join('')}</div>`
        : '';
    // Ratings storage
    const ratings = JSON.parse(localStorage.getItem('cj_ratings') || '{}');

    body.innerHTML = `
        <div class="order-meta mb-3">
            <div><strong>Order #${order.id}</strong><div class="text-muted small">${order.date} • User #${order.userId}</div></div>
            <div class="text-end">${statusBadge(order.status)}</div>
        </div>
        <div class="mb-2 text-muted">Type: ${order.type === 'custom' ? 'Custom' : 'From Products'} • Address #${order.addressId}</div>
        <div class="mb-2">Initial Review: ${order.initialReview?.state === 'accepted' ? 'Accepted' : 'Rejected'}${order.initialReview?.reason ? ` - ${order.initialReview.reason}` : ''}</div>
        <div class="mb-2">Delivery: ${order.deliveryDate || '-'}</div>
        <div class="mb-2">Notes: ${order.notes || '-'}</div>
        ${imagesHtml}
        <div class="mb-3 items-list">
            ${order.items.map(i => {
        const key = `${order.id}:${i.category}:${i.productId}`;
        const current = ratings[key] || 0;
        return `
                <div class=\"rating-row\">
                    <div class=\"item-name\">${i.qty} × ${i.category} #${i.productId}${i.addonId ? ` (+ addon #${i.addonId})` : ''}</div>
                    <div class=\"d-flex align-items-center gap-2\">
                        <div class=\"rating-stars\" data-key=\"${key}\">
                            ${[1, 2, 3, 4, 5].map(n => `<span class=\"star ${current >= n ? 'active' : ''}\" data-value=\"${n}\">★</span>`).join('')}
                        </div>
                        <div class=\"text-muted small\">SAR ${i.price * i.qty}</div>
                    </div>
                </div>`;
    }).join('')}
        </div>
        <div class="d-flex justify-content-between"><div>Subtotal</div><div>SAR ${order.subtotal}</div></div>
        <div class="d-flex justify-content-between"><div>Delivery Fee</div><div>SAR ${order.deliveryFee}</div></div>
        <div class="d-flex justify-content-between border-top pt-2"><div class="fw-bold">Total</div><div class="fw-bold">SAR ${order.total}</div></div>
        <div class="order-actions mt-3">
            <button class="btn btn-outline-secondary btn-sm">Download Invoice</button>
            <button class="btn btn-hero btn-sm">Reorder</button>
        </div>
    `;
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();

    // Attach rating handlers only for completed orders
    if (order.status === 'completed') {
        body.querySelectorAll('.rating-stars').forEach(group => {
            group.addEventListener('click', function (e) {
                const star = e.target.closest('.star');
                if (!star) return;
                const value = parseInt(star.getAttribute('data-value'), 10);
                const key = this.getAttribute('data-key');
                const all = this.querySelectorAll('.star');
                all.forEach((s, idx) => {
                    if (idx < value) s.classList.add('active'); else s.classList.remove('active');
                });
                const ratings = JSON.parse(localStorage.getItem('cj_ratings') || '{}');
                ratings[key] = value;
                localStorage.setItem('cj_ratings', JSON.stringify(ratings));
            });
        });
        body.insertAdjacentHTML('beforeend', `<div class=\"rating-note mt-2\">Tip: Tap stars to rate each item</div>`);
    }
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-order]');
    if (btn) {
        const id = parseInt(btn.getAttribute('data-order'), 10);
        openOrder(id);
    }
});

function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const type = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value : 'all';
    const term = document.getElementById('orderSearch').value.trim().toLowerCase();
    const filtered = ORDERS.filter(o => {
        const okStatus = status === 'all' || o.status === status;
        const okType = type === 'all' || o.type === type;
        const okSearch = (`${o.id}`.includes(term) || `${o.userId}`.includes(term) || o.date.includes(term));
        return okStatus && okType && okSearch;
    });
    renderTable(filtered);
}

document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
document.getElementById('orderSearch').addEventListener('input', applyFilters);

renderTable(ORDERS);
applyFilters();

// Initialize cart badge from localStorage on top-right icon
function loadCart() { try { return JSON.parse(localStorage.getItem('cj_cart') || '[]'); } catch { return []; } }
(function initBadge() {
    const items = loadCart();
    const count = items.reduce((s, i) => s + (i.qty || 0), 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
})();

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('active'); } else { scrollTopBtn.classList.remove('active'); }
});
scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });


