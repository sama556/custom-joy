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

function renderOrders(orders) {
    const container = document.getElementById('ordersGrid');
    const emptyState = document.getElementById('emptyState');
    const statsContainer = document.getElementById('orderStats');

    // Always show statistics
    // statsContainer.style.display = 'block';
    statsContainer.style.display = 'flex';
    statsContainer.style.flexWrap = 'nowrap';
    statsContainer.style.gap = '10px';
    statsContainer.style.justifyContent = 'space-between';
    if (!orders.length) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        // Update statistics with zero values
        updateOrderStats([]);
        return;
    }

    emptyState.style.display = 'none';

    // Update statistics
    updateOrderStats(orders);

    container.innerHTML = orders.map(order => createOrderCard(order)).join('');
}

function createOrderCard(order) {
    const statusConfig = getStatusConfig(order.status);
    const progressSteps = getProgressSteps(order.status);

    return `
        <div class="col-lg-6 col-xl-4 mb-4" data-aos="fade-up" data-aos-delay="${Math.random() * 200}">
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">#${order.id}</div>
                        <div class="order-date">${formatDate(order.date)}</div>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusConfig.class}">${statusConfig.text}</span>
                    </div>
                </div>
                
                <div class="order-progress">
                    <div class="progress-steps">
                        ${progressSteps.map(step => `
                            <div class="progress-step ${step.status}">
                                <div class="step-icon">
                                    <i class="${step.icon}"></i>
                                </div>
                                <div class="step-label">${step.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="order-details">
                    <div class="order-detail-row">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">${order.type === 'custom' ? 'Custom Order' : 'From Products'}</span>
                    </div>
                    <div class="order-detail-row">
                        <span class="detail-label">Items</span>
                        <span class="detail-value">${order.items?.length || 0} item(s)</span>
                    </div>
                    <div class="order-detail-row">
                        <span class="detail-label">Delivery</span>
                        <span class="detail-value">${order.deliveryDate || 'TBD'}</span>
                    </div>
                </div>
                
                <div class="order-total">
                    <div class="order-total-amount">SAR ${order.total}</div>
                    <div class="order-total-label">Total Amount</div>
                </div>
                
                <div class="order-actions">
                    <button class="order-action-btn btn-view" data-order="${order.id}">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    ${order.status === 'completed' ? `
                        <button class="order-action-btn btn-reorder" data-reorder="${order.id}">
                            <i class="fas fa-redo"></i>
                            Reorder
                        </button>
                    ` : ''}
                    ${order.status === 'in_progress' ? `
                        <button class="order-action-btn btn-track" data-track="${order.id}">
                            <i class="fas fa-truck"></i>
                            Track
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function getStatusConfig(status) {
    const configs = {
        processing: { class: 'status-processing', text: 'Processing' },
        in_progress: { class: 'status-shipped', text: 'In Progress' },
        completed: { class: 'status-delivered', text: 'Completed' },
        cancelled: { class: 'status-cancelled', text: 'Cancelled' },
        paid: { class: 'status-delivered', text: 'Paid' },
        unpaid: { class: 'status-processing', text: 'Unpaid' }
    };
    return configs[status] || configs.processing;
}

function getProgressSteps(status) {
    const steps = [
        { icon: 'fas fa-shopping-cart', label: 'Ordered', status: 'completed' },
        { icon: 'fas fa-clock', label: 'Processing', status: status === 'processing' ? 'current' : (['in_progress', 'completed', 'paid'].includes(status) ? 'completed' : '') },
        { icon: 'fas fa-truck', label: 'Shipped', status: status === 'in_progress' ? 'current' : (['completed', 'paid'].includes(status) ? 'completed' : '') },
        { icon: 'fas fa-check', label: 'Delivered', status: ['completed', 'paid'].includes(status) ? 'completed' : '' }
    ];

    if (status === 'cancelled') {
        return steps.map(step => ({ ...step, status: step.label === 'Ordered' ? 'completed' : '' }));
    }

    return steps;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function updateOrderStats(orders) {
    const stats = {
        processing: orders.filter(o => o.status === 'processing').length,
        inProgress: orders.filter(o => o.status === 'in_progress').length,
        completed: orders.filter(o => o.status === 'completed' || o.status === 'paid').length,
        total: orders.length
    };

    document.getElementById('processingCount').textContent = stats.processing;
    document.getElementById('inProgressCount').textContent = stats.inProgress;
    document.getElementById('completedCount').textContent = stats.completed;
    document.getElementById('totalCount').textContent = stats.total;
}

function openOrder(id) {
    const order = ORDERS.find(o => o.id === id);
    if (!order) return;

    const body = document.getElementById('orderModalBody');
    const subtitle = document.getElementById('orderModalSubtitle');
    const reorderBtn = document.getElementById('reorderBtn');

    // Set modal subtitle
    subtitle.textContent = `Ordered on ${formatDate(order.date)} • User #${order.userId}`;

    // Show/hide reorder button
    reorderBtn.style.display = order.status === 'completed' ? 'block' : 'none';
    reorderBtn.onclick = () => handleReorder(order.id);

    // Determine if items are from checkout (have title/image) or demo (category/productId)
    const isCheckoutSchema = Array.isArray(order.items) && order.items.length && (order.items[0].title || order.items[0].image);

    // Build items table rows
    const itemsRows = (order.items || []).map((i, idx) => {
        const qty = i.qty || 1;
        const lineTotal = (i.price || 0) * qty;
        const img = isCheckoutSchema ? (i.image || '') : '';
        const name = isCheckoutSchema ? (i.title || `Item ${idx + 1}`) : `${i.category} #${i.productId}`;
        const variant = isCheckoutSchema ? (i.variant ? `<div class="text-muted small">${i.variant}</div>` : '') : (i.addonId ? `<div class="text-muted small">Addon #${i.addonId}</div>` : '');
        return `
            <tr>
                <td style="width:64px">${img ? `<img src="${img}" alt="item" style="width:56px;height:56px;border-radius:8px;object-fit:cover;">` : ''}</td>
                <td>
                    <div class="fw-semibold">${name}</div>
                    ${variant || ''}
                </td>
                <td class="text-center" style="width:80px">${qty}</td>
                <td class="text-end" style="width:110px">SAR ${i.price || 0}</td>
                <td class="text-end" style="width:120px">SAR ${lineTotal}</td>
            </tr>
        `;
    }).join('');

    // Images gallery (for demo orders)
    const imagesHtml = (order.images && order.images.length)
        ? `<div class="mb-3">
            <h6 class="mb-2">Reference Images</h6>
            <div class="d-flex gap-2 flex-wrap">
                ${order.images.map(src => `<img src="${src}" alt="ref" style="width:80px;height:80px;object-fit:cover;border-radius:12px;border:2px solid rgba(126,215,255,0.2);">`).join('')}
            </div>
        </div>`
        : '';

    // Address block
    const addr = order.address;
    const addressHtml = addr ? `
        <div class="p-3 rounded-3 border" style="background:rgba(126,215,255,0.06);">
            <div class="fw-semibold mb-1">Shipping Address</div>
            <div>${addr.name || '-'}</div>
            <div class="text-muted small">${addr.phone || '-'}</div>
            <div class="text-muted small">${addr.address || '-'}${addr.city ? `, ${addr.city}` : ''}${addr.zip ? `, ${addr.zip}` : ''}</div>
        </div>
    ` : (order.addressId ? `<div class="text-muted">Address #${order.addressId}</div>` : '<div class="text-muted">No address on file</div>');

    // Payment status
    const paymentStatus = (order.status === 'paid' || order.status === 'completed') ? 'Paid' : 'Unpaid';
    const paymentBadge = `<span class="badge ${paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}">${paymentStatus}</span>`;

    // Status badge
    const statusConfig = getStatusConfig(order.status);
    const statusHtml = `<span class="status-badge ${statusConfig.class}">${statusConfig.text}</span>`;

    // Build body content with modern layout
    body.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                <div class="order-summary mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">Order Summary</h5>
                        <div class="d-flex align-items-center gap-2">
                            ${paymentBadge}
                            ${statusHtml}
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-sm align-middle">
                            <thead>
                                <tr>
                                    <th style="width:64px"></th>
                                    <th>Item</th>
                                    <th class="text-center" style="width:80px">Qty</th>
                                    <th class="text-end" style="width:110px">Price</th>
                                    <th class="text-end" style="width:120px">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRows || `<tr><td colspan="5" class="text-muted text-center py-4">No items found</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                    
                    ${imagesHtml}
                    ${order.notes ? `
                        <div class="mt-3 p-3 rounded-3" style="background:rgba(9,21,35,0.03);">
                            <div class="fw-semibold mb-1">Special Notes</div>
                            <div class="text-muted">${order.notes}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="order-info">
                    <div class="p-3 rounded-3 border mb-3" style="background:rgba(9,21,35,0.03);">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>SAR ${order.subtotal}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Delivery Fee</span>
                            <span>SAR ${order.deliveryFee}</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <span class="fw-bold">Total</span>
                            <span class="fw-bold text-primary">SAR ${order.total}</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">${addressHtml}</div>
                    
                    <div class="order-details-info">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Delivery Date</span>
                            <span>${order.deliveryDate || 'TBD'}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Order Type</span>
                            <span>${order.type === 'custom' ? 'Custom Order' : 'From Products'}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Initial Review</span>
                            <span class="badge ${order.initialReview?.state === 'accepted' ? 'bg-success' : 'bg-danger'}">
                                ${order.initialReview?.state === 'accepted' ? 'Accepted' : 'Rejected'}
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    `;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();

    // Add order review for completed orders
    if (order.status === 'completed') {
        addOrderReview(body, order);
    }
}

function addOrderReview(container, order) {
    const orderReviews = JSON.parse(localStorage.getItem('cj_order_reviews') || '{}');
    const orderKey = `order_${order.id}`;
    const currentReview = orderReviews[orderKey] || { rating: 0, comment: '' };

    // Create order review section
    const reviewSection = document.createElement('div');
    reviewSection.className = 'order-review-section mt-4 p-3 rounded-3';
    reviewSection.style.cssText = 'background: rgba(126,215,255,0.05); border: 1px solid rgba(126,215,255,0.2);';
    
    reviewSection.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <h6 class="mb-0 me-3">
                <i class="fas fa-star text-warning me-1"></i>
                Order Review
            </h6>
            <div class="rating-stars" data-order-key="${orderKey}">
                ${[1, 2, 3, 4, 5].map(n => 
                    `<span class="star ${currentReview.rating >= n ? 'active' : ''}" data-value="${n}">★</span>`
                ).join('')}
            </div>
            <span class="rating-text ms-2">${currentReview.rating > 0 ? `${currentReview.rating}.0` : 'Not rated'}</span>
        </div>
        
        <div class="review-comment mb-3">
            <label class="form-label small">Your Review</label>
            <textarea class="form-control" rows="3" placeholder="Share your experience with this order..." data-comment-key="${orderKey}">${currentReview.comment}</textarea>
        </div>
        
        <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm" data-save-review="${orderKey}">
                <i class="fas fa-save me-1"></i>Save Review
            </button>
            <button class="btn btn-outline-secondary btn-sm" data-clear-review="${orderKey}">
                <i class="fas fa-trash me-1"></i>Clear
            </button>
        </div>
    `;

    // Add to container
    container.appendChild(reviewSection);

    // Add event listeners
    const starsContainer = reviewSection.querySelector('.rating-stars');
    const commentTextarea = reviewSection.querySelector('[data-comment-key]');
    const saveBtn = reviewSection.querySelector('[data-save-review]');
    const clearBtn = reviewSection.querySelector('[data-clear-review]');

    // Star rating functionality
    starsContainer.addEventListener('click', function(e) {
        const star = e.target.closest('.star');
        if (!star) return;

        const value = parseInt(star.getAttribute('data-value'), 10);
        const allStars = this.querySelectorAll('.star');

        allStars.forEach((s, idx) => {
            if (idx < value) s.classList.add('active');
            else s.classList.remove('active');
        });

        // Update rating text
        const ratingText = reviewSection.querySelector('.rating-text');
        ratingText.textContent = `${value}.0`;
    });

    // Save review functionality
    saveBtn.addEventListener('click', function() {
        const rating = starsContainer.querySelectorAll('.star.active').length;
        const comment = commentTextarea.value.trim();

        if (rating === 0) {
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: "Please select a rating",
                    duration: 2000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #ff6b6b, #ee5a24)",
                }).showToast();
            }
            return;
        }

        const orderReviews = JSON.parse(localStorage.getItem('cj_order_reviews') || '{}');
        orderReviews[orderKey] = { rating, comment };
        localStorage.setItem('cj_order_reviews', JSON.stringify(orderReviews));

        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: "Review saved successfully!",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
        }
    });

    // Clear review functionality
    clearBtn.addEventListener('click', function() {
        const allStars = starsContainer.querySelectorAll('.star');
        allStars.forEach(star => star.classList.remove('active'));
        commentTextarea.value = '';
        
        const ratingText = reviewSection.querySelector('.rating-text');
        ratingText.textContent = 'Not rated';

        const orderReviews = JSON.parse(localStorage.getItem('cj_order_reviews') || '{}');
        delete orderReviews[orderKey];
        localStorage.setItem('cj_order_reviews', JSON.stringify(orderReviews));

        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: "Review cleared",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
            }).showToast();
        }
    });
}

function handleReorder(orderId) {
    const order = ORDERS.find(o => o.id === orderId);
    if (!order) return;

    // Add items to cart
    const cart = JSON.parse(localStorage.getItem('cj_cart') || '[]');
    order.items.forEach(item => {
        cart.push({
            ...item,
            id: Date.now() + Math.random(), // New unique ID
            addedAt: new Date().toISOString()
        });
    });

    localStorage.setItem('cj_cart', JSON.stringify(cart));

    // Show success message
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "Items added to cart for reorder!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    }

    // Update cart badge
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = cart.length;
    }
}

function clearFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('orderSearch').value = '';
    applyFilters();
}

function clearSearch() {
    document.getElementById('orderSearch').value = '';
    applyFilters();
}

function exportOrders() {
    // Export functionality
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "Exporting orders...",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
        }).showToast();
    }
}

function refreshOrders() {
    // Refresh functionality
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "Refreshing orders...",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    }
    // Reload the page or refresh data
    setTimeout(() => {
        renderOrders(ORDERS);
        applyFilters();
    }, 1000);
}

// Event handlers
document.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-order]');
    if (btn) {
        const id = parseInt(btn.getAttribute('data-order'), 10);
        openOrder(id);
    }

    const reorderBtn = e.target.closest('button[data-reorder]');
    if (reorderBtn) {
        const id = parseInt(reorderBtn.getAttribute('data-reorder'), 10);
        handleReorder(id);
    }

    const trackBtn = e.target.closest('button[data-track]');
    if (trackBtn) {
        const id = parseInt(trackBtn.getAttribute('data-track'), 10);
        // Handle tracking functionality
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: "Tracking information will be available soon!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
            }).showToast();
        }
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
    renderOrders(filtered);
}

// Initialize filters
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
document.getElementById('orderSearch').addEventListener('input', applyFilters);

// Initialize page
renderOrders(ORDERS);
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


