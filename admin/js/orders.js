
// Enhanced Orders Management JavaScript

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function (event) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });

        // Close sidebar on window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
            }
        });
    }
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Order details modal functionality
function showOrderDetailsModal(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    const orderIdTitle = document.getElementById('orderIdTitle');
    const orderDetailsContent = document.getElementById('orderDetailsContent');

    if (!modal || !orderIdTitle || !orderDetailsContent) return;

    // Find the order data
    const order = ordersData.find(o => o.orderNumber === orderId);
    if (!order) return;

    // Update modal title
    orderIdTitle.textContent = `#${orderId}`;

    // Generate order details HTML
    const orderDetailsHTML = generateOrderDetailsHTML(order);
    orderDetailsContent.innerHTML = orderDetailsHTML;

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
}

function generateOrderDetailsHTML(order) {
    return `
        <div class="details-grid">
            <!-- Order Information -->
            <div class="order-info-section">
                <h4><i class="fas fa-info-circle"></i> Order Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Order ID:</label>
                        <span class="order-id">#${order.orderNumber}</span>
                    </div>
                    <div class="info-item">
                        <label>User ID:</label>
                        <span class="user-id">#${order.userNumber}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Date:</label>
                        <span>${order.date}</span>
                    </div>
                    <div class="info-item">
                        <label>Delivery Date:</label>
                        <span>${order.deliveryDate}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Type:</label>
                        <span class="badge badge-${order.orderType}">${order.orderType}</span>
                    </div>
                    <div class="info-item">
                        <label>Priority:</label>
                        <span class="priority-badge priority-${order.priority}">${order.priority}</span>
                    </div>
                </div>
            </div>

            <!-- Customer Information -->
            <div class="customer-section">
                <h4><i class="fas fa-user"></i> Customer Information</h4>
                <div class="customer-content">
                    <div class="customer-header">
                        <img src="${order.customer.avatar}" alt="${order.customer.name}" class="customer-avatar">
                        <div class="customer-details">
                            <h5>${order.customer.name}</h5>
                            <p><i class="fas fa-envelope"></i> ${order.customer.email}</p>
                            <p><i class="fas fa-phone"></i> ${order.customer.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${order.customer.address}</p>
                            <p><i class="fas fa-calendar"></i> Customer since: ${order.customer.since}</p>
                            <p><i class="fas fa-shopping-cart"></i> Total orders: ${order.customer.orderCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pricing Information -->
            <div class="pricing-section">
                <h4><i class="fas fa-calculator"></i> Pricing Information</h4>
                <div class="pricing-grid">
                    <div class="price-item">
                        <span>Subtotal:</span>
                        <span>SAR ${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="price-item">
                        <span>Delivery Fee:</span>
                        <span>SAR ${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div class="price-item total">
                        <span>Total:</span>
                        <span class="price-total">SAR ${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="order-items-section">
                <h4><i class="fas fa-shopping-bag"></i> Order Items</h4>
                <div class="items-list">
                    ${order.orderDetails.map(item => `
                        <div class="item-card">
                            <div class="item-header">
                                <div class="item-name">${item.productType}</div>
                                <div class="item-price">SAR ${item.total.toFixed(2)}</div>
                            </div>
                            <div class="item-details">
                                <p><strong>Product ID:</strong> <span class="detail-value product-id">${item.productNumber}</span></p>
                                <p><strong>Quantity:</strong> <span class="detail-value">${item.quantity}</span></p>
                                <p><strong>Price:</strong> <span class="detail-value price">SAR ${item.price.toFixed(2)}</span></p>
                                <p><strong>Total:</strong> <span class="detail-value total">SAR ${item.total.toFixed(2)}</span></p>
                                ${item.notes ? `<p><strong>Notes:</strong> <span class="detail-value notes">${item.notes}</span></p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Custom Request Details -->
            ${order.orderType === 'custom' ? `
                <div class="custom-request-section">
                    <h4><i class="fas fa-palette"></i> Custom Request Details</h4>
                    <div class="request-content">
                        <div class="request-description">
                            <label>Description:</label>
                            <div class="description-content">
                                <p>${order.illustrativeDescription}</p>
                            </div>
                        </div>
                        <div class="request-images">
                            <label>Reference Images:</label>
                            <div class="images-grid">
                                ${order.illustrativeImages.map(img => `
                                    <div class="image-item">
                                        <img src="${img}" alt="Reference image" onclick="openImageModal('${img}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Notes Section -->
            ${order.notes ? `
                <div class="notes-section">
                    <h4><i class="fas fa-sticky-note"></i> Order Notes</h4>
                    <div class="notes-content">
                        <div class="notes-item">
                            <label>Special Instructions:</label>
                            <div class="notes-text">${order.notes}</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Cancellation Request -->
            ${order.cancellationRequest ? `
                <div class="cancellation-request-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Cancellation Request</h4>
                    <div class="cancellation-content">
                        <p><strong>Requested Date:</strong> ${order.cancellationRequest.requestedDate}</p>
                        <p><strong>Reason:</strong> ${order.cancellationRequest.reason}</p>
                        <p><strong>Customer Notes:</strong> ${order.cancellationRequest.customerNotes}</p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Status update modal functionality
function showStatusUpdateModal(orderId) {
    const modal = document.getElementById('actionModal');
    const actionTitle = document.getElementById('actionTitle');
    const actionMessage = document.getElementById('actionMessage');
    const reasonInput = document.getElementById('reasonInput');
    const priceInput = document.getElementById('priceInput');
    const confirmActionBtn = document.getElementById('confirmAction');

    if (!modal || !actionTitle || !actionMessage) return;

    // Update modal content for status update
    actionTitle.textContent = 'Update Order Status';
    actionMessage.innerHTML = `
        <label for="statusSelect">Select new status for order ${orderId}:</label>
        <select id="statusSelect" style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="">Select Status</option>
            <option value="processing">Processing</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="ready">Ready for Delivery</option>
            <option value="in-delivery">In Delivery</option>
            <option value="delivered">Delivered</option>
        </select>
    `;
    reasonInput.style.display = 'none';
    priceInput.style.display = 'none';
    confirmActionBtn.textContent = 'Update Status';

    // Store current action and order ID
    modal.dataset.action = 'update-status';
    modal.dataset.orderId = orderId;

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
}

// Action modal functionality
function showActionModal(action, orderId) {
    const modal = document.getElementById('actionModal');
    const actionTitle = document.getElementById('actionTitle');
    const actionMessage = document.getElementById('actionMessage');
    const reasonInput = document.getElementById('reasonInput');
    const priceInput = document.getElementById('priceInput');
    const confirmActionBtn = document.getElementById('confirmAction');

    if (!modal || !actionTitle || !actionMessage) return;

    // Update modal content based on action
    switch (action) {
        case 'accept':
            actionTitle.textContent = 'Accept Order';
            actionMessage.textContent = 'Are you sure you want to accept this order?';
            reasonInput.style.display = 'none';
            priceInput.style.display = 'block';
            confirmActionBtn.textContent = 'Accept Order';
            break;
        case 'reject':
            actionTitle.textContent = 'Reject Order';
            actionMessage.textContent = 'Are you sure you want to reject this order?';
            reasonInput.style.display = 'block';
            priceInput.style.display = 'none';
            confirmActionBtn.textContent = 'Reject Order';
            break;
        case 'update-status':
            actionTitle.textContent = 'Update Order Status';
            actionMessage.textContent = 'Select the new status for this order:';
            reasonInput.style.display = 'none';
            priceInput.style.display = 'none';
            confirmActionBtn.textContent = 'Update Status';
            break;
        case 'start-delivery':
            actionTitle.textContent = 'Start Delivery';
            actionMessage.textContent = 'Are you sure you want to start delivery for this order?';
            reasonInput.style.display = 'none';
            priceInput.style.display = 'none';
            confirmActionBtn.textContent = 'Start Delivery';
            break;
        case 'mark-delivered':
            actionTitle.textContent = 'Mark as Delivered';
            actionMessage.textContent = 'Are you sure you want to mark this order as delivered?';
            reasonInput.style.display = 'none';
            priceInput.style.display = 'none';
            confirmActionBtn.textContent = 'Mark Delivered';
            break;
    }

    // Store current action and order ID
    modal.dataset.action = action;
    modal.dataset.orderId = orderId;

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
}

// Execute action
function executeAction() {
    const modal = document.getElementById('actionModal');
    const action = modal.dataset.action;
    const orderId = modal.dataset.orderId;

    if (!action || !orderId) return;

    // Find the order
    const order = ordersData.find(o => o.orderNumber === orderId);
    if (!order) return;

    // Execute the action
    switch (action) {
        case 'accept':
            // Update order status to processing
            order.status = 'processing';
            showToast('success', 'Order Accepted', `Order ${orderId} has been accepted.`);
            break;
        case 'reject':
            // Update order status to cancelled
            order.status = 'cancelled';
            const rejectionReason = document.getElementById('rejectionReason').value;
            order.rejectionReason = rejectionReason;
            showToast('success', 'Order Rejected', `Order ${orderId} has been rejected.`);
            break;
        case 'update-status':
            // Get selected status and update order
            const statusSelect = document.getElementById('statusSelect');
            if (statusSelect && statusSelect.value) {
                order.status = statusSelect.value;
                showToast('success', 'Status Updated', `Order ${orderId} status has been updated to ${statusSelect.value}.`);
            } else {
                showToast('error', 'No Status Selected', 'Please select a status before updating.');
                return;
            }
            break;
        case 'start-delivery':
            // Update order status to in-delivery
            order.status = 'in-delivery';
            showToast('success', 'Delivery Started', `Delivery for order ${orderId} has been started.`);
            break;
        case 'mark-delivered':
            // Update order status to delivered
            order.status = 'delivered';
            showToast('success', 'Order Delivered', `Order ${orderId} has been marked as delivered.`);
            break;
    }

    // Close modal
    closeActionModal();

    // Refresh the current tab
    refreshCurrentTab();
}

// Close action modal
function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }

    // Clear form fields
    const rejectionReason = document.getElementById('rejectionReason');
    const totalPrice = document.getElementById('totalPrice');
    const priceNotes = document.getElementById('priceNotes');

    if (rejectionReason) rejectionReason.value = '';
    if (totalPrice) totalPrice.value = '';
    if (priceNotes) priceNotes.value = '';
}

// Refresh current tab
function refreshCurrentTab() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;

    const tabId = activeTab.id;

    // Re-render the table for the active tab
    switch (tabId) {
        case 'incoming':
            renderIncomingOrders();
            break;
        case 'processing':
            renderProcessingOrders();
            break;
        case 'delivery':
            renderDeliveryOrders();
            break;
    }
}

// Render orders for each tab
function renderIncomingOrders() {
    const tbody = document.querySelector('#incoming tbody');
    if (!tbody) return;

    const incomingOrders = ordersData.filter(order => order.status === 'pending');
    tbody.innerHTML = '';

    incomingOrders.forEach(order => {
        const row = createIncomingOrderRow(order);
        tbody.appendChild(row);
    });
}

function renderProcessingOrders() {
    const tbody = document.querySelector('#processing tbody');
    if (!tbody) return;

    const processingOrders = ordersData.filter(order =>
        order.status === 'processing' || order.status === 'in-progress' || order.status === 'completed'
    );
    tbody.innerHTML = '';

    processingOrders.forEach(order => {
        const row = createProcessingOrderRow(order);
        tbody.appendChild(row);
    });
}

function renderDeliveryOrders() {
    const tbody = document.querySelector('#delivery tbody');
    if (!tbody) return;

    const deliveryOrders = ordersData.filter(order =>
        order.status === 'ready' || order.status === 'in-delivery' || order.status === 'delivered'
    );
    tbody.innerHTML = '';

    deliveryOrders.forEach(order => {
        const row = createDeliveryOrderRow(order);
        tbody.appendChild(row);
    });
}

// Create table rows for each tab
function createIncomingOrderRow(order) {
    const row = document.createElement('tr');
    row.dataset.order = order.orderNumber;

    row.innerHTML = `
        <td>#${order.orderNumber}</td>
        <td>${order.customer.name}</td>
        <td><span class="badge badge-${order.orderType}">${order.orderType}</span></td>
        <td>${order.date}</td>
        <td>${order.deliveryDate}</td>
        <td><span class="status status-${order.status}">${order.status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon btn-view" data-order="${order.orderNumber}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon btn-accept" data-order="${order.orderNumber}" title="Accept Order">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon btn-reject" data-order="${order.orderNumber}" title="Reject Order">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

function createProcessingOrderRow(order) {
    const row = document.createElement('tr');
    row.dataset.order = order.orderNumber;

    row.innerHTML = `
        <td>#${order.orderNumber}</td>
        <td>${order.customer.name}</td>
        <td><span class="badge badge-${order.orderType}">${order.orderType}</span></td>
        <td>${order.deliveryDate}</td>
        <td><strong>SAR ${order.total.toFixed(2)}</strong></td>
        <td><span class="status status-${order.status}">${order.status}</span></td>
        <td>${order.date}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon btn-view" data-order="${order.orderNumber}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary btn-update-status" data-order="${order.orderNumber}">
                    Update Status
                </button>
            </div>
        </td>
    `;

    return row;
}

function createDeliveryOrderRow(order) {
    const row = document.createElement('tr');
    row.dataset.order = order.orderNumber;

    row.innerHTML = `
        <td>#${order.orderNumber}</td>
        <td>${order.customer.name}</td>
        <td>${order.customer.address}</td>
        <td>${order.deliveryDate}</td>
        <td><strong>SAR ${order.total.toFixed(2)}</strong></td>
        <td><span class="status status-${order.status}">${order.status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon btn-view" data-order="${order.orderNumber}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.status === 'ready' ? `
                    <button class="btn btn-sm btn-primary btn-start-delivery" data-order="${order.orderNumber}">
                        Start Delivery
                    </button>
                ` : order.status === 'in-delivery' ? `
                    <button class="btn btn-sm btn-success btn-mark-delivered" data-order="${order.orderNumber}">
                        Mark Delivered
                    </button>
                ` : `
                    <button class="btn btn-sm btn-secondary" disabled>
                        Delivered
                    </button>
                `}
            </div>
        </td>
    `;

    return row;
}

// Search functionality for each tab
function setupTabSearch() {
    const searchInputs = document.querySelectorAll('#searchIncoming, #searchProcessing, #searchDelivery');

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tabId = e.target.id.replace('search', '').toLowerCase();
            const tbody = document.querySelector(`#${tabId} tbody`);

            if (!tbody) return;

            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
}

// Filter functionality for each tab
function setupTabFilters() {
    const filterSelects = document.querySelectorAll('#filterOrderType, #filterProcessingStatus, #filterDeliveryStatus');

    filterSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            const tabId = e.target.id.replace('filter', '').replace('Status', '').replace('Type', '').toLowerCase();
            const tbody = document.querySelector(`#${tabId} tbody`);

            if (!tbody) return;

            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                if (!filterValue) {
                    row.style.display = '';
                    return;
                }

                const statusCell = row.querySelector('.status');
                const typeCell = row.querySelector('.badge');

                if (statusCell && statusCell.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
                    row.style.display = '';
                } else if (typeCell && typeCell.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Event delegation for table actions
function setupTableActions() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const orderId = button.dataset.order;
        if (!orderId) return;

        if (button.classList.contains('btn-view')) {
            showOrderDetailsModal(orderId);
        } else if (button.classList.contains('btn-accept')) {
            showActionModal('accept', orderId);
        } else if (button.classList.contains('btn-reject')) {
            showActionModal('reject', orderId);
        } else if (button.classList.contains('btn-update-status')) {
            showStatusUpdateModal(orderId);
        } else if (button.classList.contains('btn-start-delivery')) {
            showActionModal('start-delivery', orderId);
        } else if (button.classList.contains('btn-mark-delivered')) {
            showActionModal('mark-delivered', orderId);
        }
    });
}

// Toast notification system
function showToast(type, title, message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type] || iconMap.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    // Add to container
    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    setupTabSearch();
    setupTabFilters();
    setupTableActions();

    // Render initial data
    renderIncomingOrders();
    renderProcessingOrders();
    renderDeliveryOrders();

    // Setup modal close handlers
    const closeDetailsModal = document.getElementById('closeDetailsModal');
    const closeDetails = document.getElementById('closeDetails');
    const closeActionModal = document.getElementById('closeActionModal');
    const cancelAction = document.getElementById('cancelAction');
    const confirmAction = document.getElementById('confirmAction');

    if (closeDetailsModal) {
        closeDetailsModal.addEventListener('click', () => {
            const modal = document.getElementById('orderDetailsModal');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        });
    }

    if (closeDetails) {
        closeDetails.addEventListener('click', () => {
            const modal = document.getElementById('orderDetailsModal');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        });
    }

    if (closeActionModal) {
        closeActionModal.addEventListener('click', () => {
            const modal = document.getElementById('actionModal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
            }
        });
    }

    if (cancelAction) {
        cancelAction.addEventListener('click', () => {
            const modal = document.getElementById('actionModal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
            }
        });
    }

    if (confirmAction) {
        confirmAction.addEventListener('click', executeAction);
    }

    // Setup confirmation modal close handlers
    const cancelConfirm = document.getElementById('cancelConfirm');
    if (cancelConfirm) {
        cancelConfirm.addEventListener('click', () => {
            const modal = document.getElementById('confirmModal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
            }
        });
    }

    // Setup sign out modal close handlers
    const cancelSignOut = document.getElementById('cancelSignOut');
    if (cancelSignOut) {
        cancelSignOut.addEventListener('click', () => {
            const modal = document.getElementById('signOutModal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
            }
        });
    }

    // Setup modal overlay click to close
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.setAttribute('aria-hidden', 'true');
                overlay.style.display = 'none';
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const orderDetailsModal = document.getElementById('orderDetailsModal');
            const actionModal = document.getElementById('actionModal');
            const confirmModal = document.getElementById('confirmModal');
            const signOutModal = document.getElementById('signOutModal');

            if (orderDetailsModal && orderDetailsModal.style.display === 'flex') {
                orderDetailsModal.setAttribute('aria-hidden', 'true');
                orderDetailsModal.style.display = 'none';
            }
            if (actionModal && actionModal.style.display === 'flex') {
                closeActionModal();
            }
            if (confirmModal && confirmModal.style.display === 'flex') {
                confirmModal.setAttribute('aria-hidden', 'true');
                confirmModal.style.display = 'none';
            }
            if (signOutModal && signOutModal.style.display === 'flex') {
                signOutModal.setAttribute('aria-hidden', 'true');
                signOutModal.style.display = 'none';
            }
        }
    });
});

// Comprehensive sample orders data
const ordersData = [
    {
        orderNumber: 'ORD-001',
        userNumber: 'USR-001',
        date: '2025-01-15',
        subtotal: 89.99,
        deliveryFee: 5.99,
        total: 95.98,
        status: 'processing',
        addressNumber: 'ADD-001',
        initialStatus: 'accepted',
        rejectionReason: '',
        orderType: 'custom',
        priority: 'high',
        notes: 'Please deliver after 6 PM. Call before delivery.',
        deliveryDate: '2025-01-20',
        illustrativeImages: ['../../images/product1.avif', '../../images/ceek1.jpg'],
        illustrativeDescription: 'Custom birthday cake with chocolate flavor, 2-tier design with personalized decoration',
        orderDetails: [
            {
                orderNumber: 'ORD-001',
                productType: 'Cake',
                productNumber: 'PRD-CAKE-001',
                additionType: 'Cake',
                additionNumber: 'ADD-CAKE-001',
                quantity: 1,
                price: 89.99,
                total: 89.99,
                notes: 'Chocolate flavor, 2-tier, custom decoration'
            }
        ],
        customer: {
            name: 'Sarah Ahmed',
            email: 'sarah@example.com',
            phone: '+966501234567',
            avatar: '../../images/woman.jpg',
            address: '123 Main Street, Riyadh, Saudi Arabia',
            since: '2024-03-15',
            orderCount: 5
        },
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card (****1234)',
        cancellationRequest: null
    },
    {
        orderNumber: 'ORD-002',
        userNumber: 'USR-002',
        date: '2025-01-14',
        subtotal: 45.00,
        deliveryFee: 3.99,
        total: 48.99,
        status: 'in-progress',
        addressNumber: 'ADD-002',
        initialStatus: 'accepted',
        rejectionReason: '',
        orderType: 'products',
        priority: 'medium',
        notes: 'Set up in living room area.',
        deliveryDate: '2025-01-18',
        illustrativeImages: ['../../images/ballon.jpg', '../../images/ceek2.jpg'],
        illustrativeDescription: 'Balloon decoration package with mixed colors, perfect for party setup',
        orderDetails: [
            {
                orderNumber: 'ORD-002',
                productType: 'Balloons',
                productNumber: 'PRD-BAL-001',
                additionType: 'Balloons',
                additionNumber: 'ADD-BAL-001',
                quantity: 1,
                price: 45.00,
                total: 45.00,
                notes: '50 balloons, mixed colors, latex type'
            }
        ],
        customer: {
            name: 'Ahmed Mohamed',
            email: 'ahmed@example.com',
            phone: '+966507654321',
            avatar: '../../images/avater2.jpg',
            address: '456 King Fahd Road, Jeddah, Saudi Arabia',
            since: '2024-05-20',
            orderCount: 3
        },
        paymentStatus: 'paid',
        paymentMethod: 'Apple Pay',
        cancellationRequest: null
    },
    {
        orderNumber: 'ORD-003',
        userNumber: 'USR-003',
        date: '2025-01-13',
        subtotal: 35.00,
        deliveryFee: 2.99,
        total: 37.99,
        status: 'completed',
        addressNumber: 'ADD-003',
        initialStatus: 'accepted',
        rejectionReason: '',
        orderType: 'products',
        priority: 'low',
        notes: 'Deliver to reception desk.',
        deliveryDate: '2025-01-16',
        illustrativeImages: ['../../images/rose.jpg', '../../images/ceek3.jpg'],
        illustrativeDescription: 'Beautiful rose bouquet with gift wrapping, perfect for special occasions',
        orderDetails: [
            {
                orderNumber: 'ORD-003',
                productType: 'Flowers',
                productNumber: 'PRD-FLOW-001',
                additionType: 'Flowers',
                additionNumber: 'ADD-FLOW-001',
                quantity: 1,
                price: 35.00,
                total: 35.00,
                notes: '12 red roses, gift wrapping included'
            }
        ],
        customer: {
            name: 'Mona Ali',
            email: 'mona@example.com',
            phone: '+966509876543',
            avatar: '../../images/wowan2.jpg',
            address: '789 Al Olaya Street, Riyadh, Saudi Arabia',
            since: '2024-08-10',
            orderCount: 8
        },
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card (****5678)',
        cancellationRequest: null
    },
    {
        orderNumber: 'ORD-004',
        userNumber: 'USR-004',
        date: '2025-01-12',
        subtotal: 120.00,
        deliveryFee: 8.99,
        total: 128.99,
        status: 'paid',
        addressNumber: 'ADD-004',
        initialStatus: 'accepted',
        rejectionReason: '',
        orderType: 'custom',
        priority: 'high',
        notes: 'Wedding decoration package with premium setup.',
        deliveryDate: '2025-01-25',
        illustrativeImages: ['../../images/ceek4.jpg', '../../images/ceek5.jpg'],
        illustrativeDescription: 'Complete wedding decoration package including flowers, balloons, and organization services',
        orderDetails: [
            {
                orderNumber: 'ORD-004',
                productType: 'Organization',
                productNumber: 'PRD-ORG-001',
                additionType: 'Flowers',
                additionNumber: 'ADD-FLOW-002',
                quantity: 1,
                price: 80.00,
                total: 80.00,
                notes: 'Wedding flower arrangement'
            },
            {
                orderNumber: 'ORD-004',
                productType: 'Balloons',
                productNumber: 'PRD-BAL-002',
                additionType: 'Balloons',
                additionNumber: 'ADD-BAL-002',
                quantity: 1,
                price: 40.00,
                total: 40.00,
                notes: 'Wedding balloon decoration'
            }
        ],
        customer: {
            name: 'Fatima Al-Rashid',
            email: 'fatima@example.com',
            phone: '+966501112233',
            avatar: '../../images/avater3.jpg',
            address: '321 Prince Mohammed Street, Dammam, Saudi Arabia',
            since: '2024-01-15',
            orderCount: 12
        },
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer',
        cancellationRequest: null
    },
    {
        orderNumber: 'ORD-005',
        userNumber: 'USR-005',
        date: '2025-01-11',
        subtotal: 25.00,
        deliveryFee: 2.99,
        total: 27.99,
        status: 'cancellation-requested',
        addressNumber: 'ADD-005',
        initialStatus: 'accepted',
        rejectionReason: '',
        orderType: 'products',
        priority: 'medium',
        notes: 'Customer requested cancellation due to change of plans.',
        deliveryDate: '2025-01-15',
        illustrativeImages: ['../../images/ceek6.jpg'],
        illustrativeDescription: 'Small flower arrangement for office desk',
        orderDetails: [
            {
                orderNumber: 'ORD-005',
                productType: 'Flowers',
                productNumber: 'PRD-FLOW-002',
                additionType: 'Flowers',
                additionNumber: 'ADD-FLOW-003',
                quantity: 1,
                price: 25.00,
                total: 25.00,
                notes: 'Small office flower arrangement'
            }
        ],
        customer: {
            name: 'Omar Hassan',
            email: 'omar@example.com',
            phone: '+966504445555',
            avatar: '../../images/avater4.jpg',
            address: '654 Al Khobar Road, Khobar, Saudi Arabia',
            since: '2024-11-05',
            orderCount: 2
        },
        paymentStatus: 'unpaid',
        paymentMethod: 'Credit Card (****9012)',
        cancellationRequest: {
            requestedDate: '2025-01-12',
            reason: 'Change of plans',
            customerNotes: 'I need to cancel this order due to unexpected circumstances.'
        }
    },
    {
        orderNumber: 'ORD-006',
        userNumber: 'USR-006',
        date: '2025-01-10',
        subtotal: 75.50,
        deliveryFee: 4.99,
        total: 80.49,
        status: 'pending',
        addressNumber: 'ADD-006',
        initialStatus: 'pending',
        rejectionReason: '',
        orderType: 'custom',
        priority: 'medium',
        notes: 'Need delivery before 2 PM.',
        deliveryDate: '2025-01-17',
        illustrativeImages: ['../../images/ceek7.jpg'],
        illustrativeDescription: 'Custom anniversary cake with photo printing',
        orderDetails: [
            {
                orderNumber: 'ORD-006',
                productType: 'Cake',
                productNumber: 'PRD-CAKE-002',
                additionType: 'Cake',
                additionNumber: 'ADD-CAKE-002',
                quantity: 1,
                price: 75.50,
                total: 75.50,
                notes: 'Vanilla flavor with photo printing'
            }
        ],
        customer: {
            name: 'Khalid Abdullah',
            email: 'khalid@example.com',
            phone: '+966506667777',
            avatar: '../../images/avater5.jpg',
            address: '987 University Street, Riyadh, Saudi Arabia',
            since: '2024-09-22',
            orderCount: 4
        },
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash on Delivery',
        cancellationRequest: null
    }
    ,
    {
        orderNumber: 'ORD-007',
        userNumber: 'USR-007',
        date: '2025-01-09',
        subtotal: 60.00,
        deliveryFee: 3.50,
        total: 63.50,
        status: 'cancelled',
        addressNumber: 'ADD-007',
        initialStatus: 'accepted',
        rejectionReason: 'Customer requested cancellation',
        orderType: 'products',
        priority: 'low',
        notes: 'Cancelled by customer before processing.',
        deliveryDate: '2025-01-12',
        illustrativeImages: ['../../images/flower1.jpg'],
        illustrativeDescription: 'Gift bundle order',
        orderDetails: [
            {
                orderNumber: 'ORD-007',
                productType: 'Flowers',
                productNumber: 'PRD-FLOW-010',
                additionType: 'Flowers',
                additionNumber: 'ADD-FLOW-010',
                quantity: 1,
                price: 60.00,
                total: 60.00,
                notes: 'Roses bundle'
            }
        ],
        customer: {
            name: 'Laila Nasser',
            email: 'laila@example.com',
            phone: '+966500000001',
            avatar: '../../images/avater6.jpg',
            address: 'Al Malaz, Riyadh, Saudi Arabia',
            since: '2024-02-10',
            orderCount: 1
        },
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash on Delivery',
        cancellationRequest: null
    },
    {
        orderNumber: 'ORD-008',
        userNumber: 'USR-008',
        date: '2025-01-08',
        subtotal: 110.00,
        deliveryFee: 6.00,
        total: 116.00,
        status: 'cancelled',
        addressNumber: 'ADD-008',
        initialStatus: 'accepted',
        rejectionReason: 'Payment failed after retries',
        orderType: 'custom',
        priority: 'medium',
        notes: 'Order cancelled due to payment failure.',
        deliveryDate: '2025-01-14',
        illustrativeImages: ['../../images/ceek4.jpg'],
        illustrativeDescription: 'Custom theme order',
        orderDetails: [
            {
                orderNumber: 'ORD-008',
                productType: 'Cake',
                productNumber: 'PRD-CAKE-020',
                additionType: 'Cake',
                additionNumber: 'ADD-CAKE-020',
                quantity: 1,
                price: 110.00,
                total: 110.00,
                notes: 'Chocolate deluxe'
            }
        ],
        customer: {
            name: 'Yousef Al Qahtani',
            email: 'yousef@example.com',
            phone: '+966500000002',
            avatar: '../../images/avater5.jpg',
            address: 'Corniche, Jeddah, Saudi Arabia',
            since: '2024-06-01',
            orderCount: 6
        },
        paymentStatus: 'unpaid',
        paymentMethod: 'Credit Card',
        cancellationRequest: null
    }
];

// DOM Elements
const orderSearch = document.getElementById('orderSearch');
const statusFilter = document.getElementById('statusFilter');
const orderTypeFilter = document.getElementById('orderTypeFilter');
const ordersTable = document.getElementById('ordersTable');
const orderCount = document.getElementById('orderCount');
const orderDetailsModal = document.getElementById('orderDetailsModal');
const confirmModal = document.getElementById('confirmModal');
const signOutModal = document.getElementById('signOutModal');

// Statistics elements
const pendingOrders = document.getElementById('pendingOrders');
const processingOrders = document.getElementById('processingOrders');
const completedOrders = document.getElementById('completedOrders');
const cancelledOrders = document.getElementById('cancelledOrders');

// Current order being processed
let currentOrder = null;
let currentAction = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializeOrders();
    updateStatistics();
});

function initializeOrders() {
    renderOrdersTable(ordersData);
    updateOrderCount(ordersData.length);
}


function handleSearch() {
    if (!orderSearch) return;

    const searchTerm = orderSearch.value.toLowerCase();
    const filteredOrders = ordersData.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.userNumber.toLowerCase().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm) ||
        order.orderDetails.some(detail =>
            detail.productType.toLowerCase().includes(searchTerm) ||
            detail.productNumber.toLowerCase().includes(searchTerm)
        )
    );
    renderOrdersTable(filteredOrders);
    updateOrderCount(filteredOrders.length);
}

function handleFilter() {
    if (!statusFilter || !orderTypeFilter) return;

    const status = statusFilter.value;
    const orderType = orderTypeFilter.value;

    let filteredOrders = ordersData;

    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (orderType) {
        filteredOrders = filteredOrders.filter(order => order.orderType === orderType);
    }

    renderOrdersTable(filteredOrders);
    updateOrderCount(filteredOrders.length);
}


function handleTableClick(e) {
    if (!ordersTable) return;

    const button = e.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const row = button.closest('tr');
    if (!row) return;

    const orderId = row.dataset.orderId;
    if (!orderId) return;

    currentOrder = ordersData.find(order => order.orderNumber === orderId);
    if (!currentOrder) return;

    switch (action) {
        case 'view':
            showOrderDetails(currentOrder);
            break;
        case 'accept':
            showConfirmModal('accept', 'Accept Order');
            break;
        case 'reject':
            showConfirmModal('reject', 'Reject Order');
            break;
        case 'complete':
            showConfirmModal('complete', 'Mark Complete');
            break;
        case 'cancel-request':
            showConfirmModal('cancel-request', 'Request Cancellation');
            break;
        case 'approve-cancellation':
            showConfirmModal('approve-cancellation', 'Approve Cancellation');
            break;
        case 'reject-cancellation':
            showConfirmModal('reject-cancellation', 'Reject Cancellation');
            break;
    }
}

function showOrderDetails(order) {
    if (!order || !orderDetailsModal) return;

    // Simple order details population
    const orderIdEl = document.getElementById('orderId');
    const orderStatusEl = document.getElementById('orderStatus');
    const orderDateEl = document.getElementById('orderDate');
    const orderTotalEl = document.getElementById('orderTotal');
    const customerNameEl = document.getElementById('customerName');
    const customerEmailEl = document.getElementById('customerEmail');
    const customerPhoneEl = document.getElementById('customerPhone');

    if (orderIdEl) orderIdEl.textContent = `#${order.orderNumber}`;
    if (orderStatusEl) {
        orderStatusEl.textContent = formatStatusText(order.status);
        orderStatusEl.className = `status-badge ${order.status}`;
    }
    if (orderDateEl) orderDateEl.textContent = order.date;
    if (orderTotalEl) orderTotalEl.textContent = `﷼${order.total.toFixed(2)}`;
    if (customerNameEl) customerNameEl.textContent = order.customer.name;
    if (customerEmailEl) customerEmailEl.textContent = order.customer.email;
    if (customerPhoneEl) customerPhoneEl.textContent = order.customer.phone;

    // Populate order items
    setupSimpleOrderItems(order.orderDetails);

    // Show/hide action buttons based on status
    updateSimpleActionButtons(order.status);

    // Show modal
    if (orderDetailsModal) {
        orderDetailsModal.setAttribute('aria-hidden', 'false');
        orderDetailsModal.style.display = 'flex';
    }
}

function setupImageGallery(images) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.getElementById('illustrativeImages');

    // Set main image
    if (images.length > 0) {
        mainImage.src = images[0];
    }

    // Clear and populate thumbnails
    thumbnailsContainer.innerHTML = '';
    images.forEach((imageSrc, index) => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Order illustration ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        img.addEventListener('click', () => {
            mainImage.src = imageSrc;
            // Update active thumbnail
            thumbnailsContainer.querySelectorAll('img').forEach(thumb => thumb.classList.remove('active'));
            img.classList.add('active');
        });
        thumbnailsContainer.appendChild(img);
    });
}

function setupSimpleOrderItems(orderDetails) {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    // Clear existing items
    orderItemsContainer.innerHTML = '';

    orderDetails.forEach(detail => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';

        orderItem.innerHTML = `
            <div class="item-name">${detail.productType}</div>
            <div class="item-quantity">Qty: ${detail.quantity}</div>
            <div class="item-price">﷼${detail.total.toFixed(2)}</div>
        `;

        orderItemsContainer.appendChild(orderItem);
    });
}

function updateSimpleActionButtons(status) {
    const acceptBtn = document.getElementById('acceptOrderBtn');
    const rejectBtn = document.getElementById('rejectOrderBtn');
    const completeBtn = document.getElementById('completeOrderBtn');

    // Hide all buttons first
    [acceptBtn, rejectBtn, completeBtn].forEach(btn => {
        if (btn) btn.style.display = 'none';
    });

    // Show relevant buttons based on status
    switch (status) {
        case 'pending':
            if (acceptBtn) acceptBtn.style.display = 'inline-flex';
            if (rejectBtn) rejectBtn.style.display = 'inline-flex';
            break;
        case 'processing':
            if (acceptBtn) acceptBtn.style.display = 'inline-flex';
            if (rejectBtn) rejectBtn.style.display = 'inline-flex';
            break;
        case 'in-progress':
            if (completeBtn) completeBtn.style.display = 'inline-flex';
            break;
    }
}

function updateActionButtons(status) {
    const acceptBtn = document.getElementById('acceptOrderBtn');
    const rejectBtn = document.getElementById('rejectOrderBtn');
    const requestCancelBtn = document.getElementById('requestCancelBtn');
    const completeBtn = document.getElementById('completeOrderBtn');
    const approveCancelBtn = document.getElementById('approveCancelBtn');
    const rejectCancelBtn = document.getElementById('rejectCancelBtn');

    // Hide all buttons first
    [acceptBtn, rejectBtn, requestCancelBtn, completeBtn, approveCancelBtn, rejectCancelBtn].forEach(btn => {
        btn.style.display = 'none';
    });

    // Show relevant buttons based on status
    switch (status) {
        case 'pending':
            acceptBtn.style.display = 'inline-flex';
            rejectBtn.style.display = 'inline-flex';
            break;
        case 'processing':
            acceptBtn.style.display = 'inline-flex';
            rejectBtn.style.display = 'inline-flex';
            break;
        case 'in-progress':
            completeBtn.style.display = 'inline-flex';
            requestCancelBtn.style.display = 'inline-flex';
            break;
        case 'cancellation-requested':
            approveCancelBtn.style.display = 'inline-flex';
            rejectCancelBtn.style.display = 'inline-flex';
            break;
        case 'completed':
        case 'cancelled':
        case 'paid':
        case 'unpaid':
            // No action buttons for completed/cancelled/paid/unpaid orders
            break;
    }
}

function showConfirmModal(action, title) {
    currentAction = action;
    document.getElementById('confirmTitle').innerHTML = `<i class="fas fa-question-circle" style="color: var(--orange);"></i> ${title}`;

    let message = '';
    switch (action) {
        case 'accept':
            message = 'Are you sure you want to accept this order? This will move it to processing status.';
            break;
        case 'reject':
            message = 'Are you sure you want to reject this order? This action cannot be undone.';
            break;
        case 'complete':
            message = 'Are you sure you want to mark this order as complete?';
            break;
        case 'cancel-request':
            message = 'Are you sure you want to request cancellation for this order?';
            break;
        case 'approve-cancellation':
            message = 'Are you sure you want to approve the cancellation request? This will cancel the order and notify the customer.';
            break;
        case 'reject-cancellation':
            message = 'Are you sure you want to reject the cancellation request? The order will continue as normal.';
            break;
    }

    document.getElementById('confirmMessage').textContent = message;
    confirmModal.setAttribute('aria-hidden', 'false');
    confirmModal.style.display = 'flex';
}


function updateOrderStatus(orderNumber, newStatus) {
    const order = ordersData.find(o => o.orderNumber === orderNumber);
    if (order) {
        order.status = newStatus;

        // If approving cancellation, remove the cancellation request
        if (newStatus === 'cancelled' && currentAction === 'approve-cancellation') {
            order.cancellationRequest = null;
        }

        // If rejecting cancellation, remove the cancellation request but keep the order in progress
        if (newStatus === 'in-progress' && currentAction === 'reject-cancellation') {
            order.cancellationRequest = null;
        }

        renderOrdersTable(ordersData);
    }
}

function closeOrderDetails() {
    orderDetailsModal.setAttribute('aria-hidden', 'true');
    orderDetailsModal.style.display = 'none';
}

function closeConfirmModal() {
    confirmModal.setAttribute('aria-hidden', 'true');
    confirmModal.style.display = 'none';
    currentAction = null;
}

function closeSignOutModal() {
    signOutModal.setAttribute('aria-hidden', 'true');
    signOutModal.style.display = 'none';
}

function renderOrdersTable(orders) {
    if (!ordersTable || !Array.isArray(orders)) return;

    const tbody = ordersTable.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    orders.forEach(order => {
        if (order && order.orderNumber) {
            const row = createOrderRow(order);
            if (row) {
                tbody.appendChild(row);
            }
        }
    });
}

function createOrderRow(order) {
    if (!order || !order.orderNumber || !order.customer) {
        console.error('Invalid order data:', order);
        return null;
    }

    const row = document.createElement('tr');
    row.dataset.orderId = order.orderNumber;

    const statusClass = order.status;
    const statusText = formatStatusText(order.status);
    const initialStatusClass = order.initialStatus;
    const initialStatusText = formatStatusText(order.initialStatus);

    let actionButtons = '';
    switch (order.status) {
        case 'pending':
        case 'processing':
            actionButtons = `
                <button class="icon-btn view" data-action="view" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="icon-btn success" data-action="accept" title="Accept Order"><i class="fas fa-check"></i></button>
                <button class="icon-btn danger" data-action="reject" title="Reject Order"><i class="fas fa-times"></i></button>
            `;
            break;
        case 'in-progress':
            actionButtons = `
                <button class="icon-btn view" data-action="view" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="icon-btn success" data-action="complete" title="Mark Complete"><i class="fas fa-check-circle"></i></button>
                <button class="icon-btn warn" data-action="cancel-request" title="Request Cancellation"><i class="fas fa-ban"></i></button>
            `;
            break;
        case 'cancellation-requested':
            actionButtons = `
                <button class="icon-btn view" data-action="view" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="icon-btn success" data-action="approve-cancellation" title="Approve Cancellation"><i class="fas fa-check"></i></button>
                <button class="icon-btn danger" data-action="reject-cancellation" title="Reject Cancellation"><i class="fas fa-times"></i></button>
            `;
            break;
        case 'completed':
            actionButtons = `
                <button class="icon-btn view" data-action="view" title="View Details"><i class="fas fa-eye"></i></button>
            `;
            break;
        case 'cancelled':
        case 'paid':
        case 'unpaid':
            actionButtons = `
                <button class="icon-btn view" data-action="view" title="View Details"><i class="fas fa-eye"></i></button>
            `;
            break;
    }

    // Get primary product info for display
    const primaryProduct = order.orderDetails[0];

    row.innerHTML = `
        <td>
            <div class="order-number-cell">
                <div class="order-number">#${order.orderNumber}</div>
                <div class="order-sub-info">
                    <span class="user-number">User: #${order.userNumber}</span>
                    <span class="delivery-date">Delivery: ${order.deliveryDate}</span>
                </div>
            </div>
        </td>
        <td>
            <div class="customer-cell">
                <img src="${order.customer.avatar}" alt="${order.customer.name}">
                <div>
                    <div class="name">${order.customer.name}</div>
                    <div class="sub">${order.customer.email}</div>
                </div>
            </div>
        </td>
        <td>
            <div class="order-type-cell">
                <span class="badge type ${order.orderType}">${formatStatusText(order.orderType)}</span>
                <div class="initial-status">
                    <span class="badge initial ${initialStatusClass}" data-initial-status="${initialStatusClass}">${initialStatusText}</span>
                </div>
            </div>
        </td>
        <td>
            <div class="amount-cell">
                <div class="total-amount">﷼${order.total.toFixed(2)}</div>
                <div class="amount-breakdown">
                    <span class="subtotal">Sub: ﷼${order.subtotal.toFixed(2)}</span>
                    <span class="delivery">+ ﷼${order.deliveryFee.toFixed(2)} delivery</span>
                </div>
            </div>
        </td>
        <td><span class="badge status ${statusClass}" data-status="${statusClass}">${statusText}</span></td>
        <td>${order.date}</td>
        <td>
            <div class="row-actions">
                ${actionButtons}
            </div>
        </td>
    `;

    return row;
}

function formatStatusText(status) {
    return status.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getFilteredOrders() {
    let filteredOrders = ordersData;

    // Apply search filter
    if (orderSearch && orderSearch.value) {
        const searchTerm = orderSearch.value.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.userNumber.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.orderDetails.some(detail =>
                detail.productType.toLowerCase().includes(searchTerm) ||
                detail.productNumber.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Apply status filter
    if (statusFilter && statusFilter.value) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter.value);
    }

    // Apply order type filter
    if (orderTypeFilter && orderTypeFilter.value) {
        filteredOrders = filteredOrders.filter(order => order.orderType === orderTypeFilter.value);
    }

    return filteredOrders;
}

function updateOrderCount(count) {
    if (!orderCount) return;

    const validCount = typeof count === 'number' && count >= 0 ? count : 0;
    orderCount.textContent = `${validCount} orders`;
}

function updateStatistics() {
    const stats = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    pendingOrders.textContent = stats.pending || 0;
    processingOrders.textContent = stats.processing || 0;
    completedOrders.textContent = stats.completed || 0;
    cancelledOrders.textContent = (stats.cancelled || 0) + (stats['cancellation-requested'] || 0);
}

function renderOrderCards() {
    const ordersGrid = document.getElementById('ordersGrid');
    if (!ordersGrid) return;

    const orders = getFilteredOrders();

    ordersGrid.innerHTML = '';

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.onclick = () => showOrderDetails(order);

        card.innerHTML = `
            <div class="order-card-header">
                <div class="order-card-id">${order.orderNumber}</div>
                <div class="order-card-status ${order.status}">${formatStatusText(order.status)}</div>
            </div>
            <div class="order-card-body">
                <div class="order-card-customer">
                    <img src="${order.customer.avatar}" alt="Customer" class="customer-avatar">
                    <div class="customer-info">
                        <h4>${order.customer.name}</h4>
                        <p>${order.customer.email}</p>
                    </div>
                </div>
                <div class="order-card-amount">﷼${order.total.toFixed(2)}</div>
                <div class="order-card-date">${order.date}</div>
            </div>
            <div class="order-card-actions">
                <button class="btn-icon" onclick="event.stopPropagation(); showOrderDetails('${order.orderNumber}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="event.stopPropagation(); handleTableClick('${order.orderNumber}', 'edit')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;

        ordersGrid.appendChild(card);
    });
}

function setupTableSorting() {
    const sortableHeaders = document.querySelectorAll('.enhanced-table th.sortable');

    sortableHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const sortField = header.dataset.sort;
            const currentSort = header.classList.contains('sort-asc') ? 'asc' :
                header.classList.contains('sort-desc') ? 'desc' : 'none';

            // Remove active class from all headers
            sortableHeaders.forEach(h => {
                h.classList.remove('active', 'sort-asc', 'sort-desc');
                h.querySelector('.sort-icon').style.display = 'block';
                h.querySelector('.sort-asc').style.display = 'none';
                h.querySelector('.sort-desc').style.display = 'none';
            });

            // Determine new sort direction
            let newDirection = 'asc';
            if (currentSort === 'asc') {
                newDirection = 'desc';
            }

            // Apply new sort
            header.classList.add('active', `sort-${newDirection}`);
            header.querySelector('.sort-icon').style.display = 'none';
            header.querySelector(`.sort-${newDirection}`).style.display = 'block';

            // Sort the data
            sortOrders(sortField, newDirection);
        });
    });
}

function sortOrders(field, direction) {
    const orders = getFilteredOrders();

    orders.sort((a, b) => {
        let valueA, valueB;

        switch (field) {
            case 'orderNumber':
                valueA = a.orderNumber;
                valueB = b.orderNumber;
                break;
            case 'customer':
                valueA = a.customer.name.toLowerCase();
                valueB = b.customer.name.toLowerCase();
                break;
            case 'orderType':
                valueA = a.orderType;
                valueB = b.orderType;
                break;
            case 'total':
                valueA = parseFloat(a.total);
                valueB = parseFloat(b.total);
                break;
            case 'status':
                valueA = a.status;
                valueB = b.status;
                break;
            case 'date':
                valueA = new Date(a.date);
                valueB = new Date(b.date);
                break;
            default:
                return 0;
        }

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    renderOrdersTable(orders);
}


function showToast(type, title, message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastTemplate = document.getElementById('toast-template');
    const toast = toastTemplate.content.cloneNode(true);

    const toastElement = toast.querySelector('.toast');
    const icon = toast.querySelector('.toast-icon i');
    const titleElement = toast.querySelector('.toast-title');
    const messageElement = toast.querySelector('.toast-message');
    const closeBtn = toast.querySelector('.toast-close');

    // Set icon and colors based on type
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    icon.className = iconMap[type] || iconMap.info;
    toastElement.classList.add(type);

    titleElement.textContent = title;
    messageElement.textContent = message;

    closeBtn.addEventListener('click', () => {
        toastElement.remove();
    });

    toastContainer.appendChild(toastElement);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.remove();
        }
    }, 5000);
}