
// Enhanced Orders Management JavaScript

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
    setupEventListeners();
    updateStatistics();
});

function initializeOrders() {
    renderOrdersTable(ordersData);
    updateOrderCount(ordersData.length);
}

function setupEventListeners() {
    // Search functionality
    if (orderSearch) orderSearch.addEventListener('input', handleSearch);
    if (statusFilter) statusFilter.addEventListener('change', handleFilter);
    if (orderTypeFilter) orderTypeFilter.addEventListener('change', handleFilter);

    // Table actions
    ordersTable.addEventListener('click', handleTableClick);

    // Enhanced table head sorting
    setupTableSorting();

    // Modal controls
    const closeOrderDetailsBtn = document.getElementById('closeOrderDetails');
    const cancelOrderDetailsBtn = document.getElementById('cancelOrderDetails');
    const cancelConfirmBtn = document.getElementById('cancelConfirm');
    const confirmActionBtn = document.getElementById('confirmAction');

    if (closeOrderDetailsBtn) closeOrderDetailsBtn.addEventListener('click', closeOrderDetails);
    if (cancelOrderDetailsBtn) cancelOrderDetailsBtn.addEventListener('click', closeOrderDetails);
    if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    if (confirmActionBtn) confirmActionBtn.addEventListener('click', executeAction);

    // Order action buttons
    const acceptOrderBtn = document.getElementById('acceptOrderBtn');
    const rejectOrderBtn = document.getElementById('rejectOrderBtn');
    const requestCancelBtn = document.getElementById('requestCancelBtn');
    const completeOrderBtn = document.getElementById('completeOrderBtn');

    if (acceptOrderBtn) acceptOrderBtn.addEventListener('click', () => showConfirmModal('accept', 'Accept Order'));
    if (rejectOrderBtn) rejectOrderBtn.addEventListener('click', () => showConfirmModal('reject', 'Reject Order'));
    if (requestCancelBtn) requestCancelBtn.addEventListener('click', () => showConfirmModal('cancel-request', 'Request Cancellation'));
    if (completeOrderBtn) completeOrderBtn.addEventListener('click', () => showConfirmModal('complete', 'Mark Complete'));

    // New cancellation handling buttons
    const approveCancelBtn = document.getElementById('approveCancelBtn');
    const rejectCancelBtn = document.getElementById('rejectCancelBtn');

    if (approveCancelBtn) {
        approveCancelBtn.addEventListener('click', () => showConfirmModal('approve-cancellation', 'Approve Cancellation'));
    }
    if (rejectCancelBtn) {
        rejectCancelBtn.addEventListener('click', () => showConfirmModal('reject-cancellation', 'Reject Cancellation'));
    }

    // Sign out functionality
    const openSignOutBtn = document.getElementById('openSignOut');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');

    if (openSignOutBtn) {
        openSignOutBtn.addEventListener('click', () => {
            if (signOutModal) {
                signOutModal.setAttribute('aria-hidden', 'false');
                signOutModal.style.display = 'flex';
            }
        });
    }
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', closeSignOutModal);
    if (confirmSignOutBtn) {
        confirmSignOutBtn.addEventListener('click', () => {
            window.location.href = '../../auth/login.html';
        });
    }

    // View toggle functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active button
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle views
            if (view === 'table') {
                tableView.style.display = 'block';
                cardView.style.display = 'none';
            } else {
                tableView.style.display = 'none';
                cardView.style.display = 'block';
                renderOrderCards();
            }
        });
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.setAttribute('aria-hidden', 'true');
                this.style.display = 'none';
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            if (orderDetailsModal && orderDetailsModal.style.display === 'flex') {
                closeOrderDetails();
            }
            if (confirmModal && confirmModal.style.display === 'flex') {
                closeConfirmModal();
            }
            if (signOutModal && signOutModal.style.display === 'flex') {
                closeSignOutModal();
            }
        }
    });
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
    if (orderTotalEl) orderTotalEl.textContent = `$${order.total.toFixed(2)}`;
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
            <div class="item-price">$${detail.total.toFixed(2)}</div>
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

function executeAction() {
    if (!currentOrder || !currentAction) return;

    switch (currentAction) {
        case 'accept':
            updateOrderStatus(currentOrder.orderNumber, 'in-progress');
            showToast('success', 'Order Accepted', `Order ${currentOrder.orderNumber} has been accepted and moved to in-progress.`);
            break;
        case 'reject':
            updateOrderStatus(currentOrder.orderNumber, 'cancelled');
            showToast('success', 'Order Rejected', `Order ${currentOrder.orderNumber} has been rejected.`);
            break;
        case 'complete':
            updateOrderStatus(currentOrder.orderNumber, 'completed');
            showToast('success', 'Order Completed', `Order ${currentOrder.orderNumber} has been marked as complete.`);
            break;
        case 'cancel-request':
            // In a real app, this would send a cancellation request to the customer
            showToast('info', 'Cancellation Requested', `Cancellation request has been sent for order ${currentOrder.orderNumber}.`);
            break;
        case 'approve-cancellation':
            updateOrderStatus(currentOrder.orderNumber, 'cancelled');
            showToast('success', 'Cancellation Approved', `Order ${currentOrder.orderNumber} has been cancelled. Customer has been notified.`);
            break;
        case 'reject-cancellation':
            updateOrderStatus(currentOrder.orderNumber, 'in-progress');
            showToast('success', 'Cancellation Rejected', `Cancellation request for order ${currentOrder.orderNumber} has been rejected. Order continues as normal.`);
            break;
    }

    closeConfirmModal();
    closeOrderDetails();
    updateStatistics();
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
                <div class="total-amount">$${order.total.toFixed(2)}</div>
                <div class="amount-breakdown">
                    <span class="subtotal">Sub: $${order.subtotal.toFixed(2)}</span>
                    <span class="delivery">+ $${order.deliveryFee.toFixed(2)} delivery</span>
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
                <div class="order-card-amount">$${order.total.toFixed(2)}</div>
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