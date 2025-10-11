// order-management.js

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Order Details Modal
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const viewOrderBtns = document.querySelectorAll('.btn-view');
    const closeDetailsModal = document.getElementById('closeDetailsModal');
    const closeDetails = document.getElementById('closeDetails');

    viewOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order');
            showOrderDetails(orderId);
        });
    });

    closeDetailsModal.addEventListener('click', closeOrderDetails);
    closeDetails.addEventListener('click', closeOrderDetails);

    // Action Modal (Accept/Reject)
    const actionModal = document.getElementById('actionModal');
    const closeActionModal = document.getElementById('closeActionModal');
    const cancelAction = document.getElementById('cancelAction');
    const confirmAction = document.getElementById('confirmAction');
    const actionTitle = document.getElementById('actionTitle');
    const actionMessage = document.getElementById('actionMessage');
    const reasonInput = document.getElementById('reasonInput');
    const rejectionReason = document.getElementById('rejectionReason');

    let currentOrderId = '';
    let currentAction = '';

    // Accept Order buttons
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', function() {
            currentOrderId = this.getAttribute('data-order');
            currentAction = 'accept';
            showActionModal('Accept Order', `Please determine the price for order ${currentOrderId} and confirm acceptance.`, false, true);
        });
    });

    // Reject Order buttons
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            currentOrderId = this.getAttribute('data-order');
            currentAction = 'reject';
            showActionModal('Reject Order', `Are you sure you want to reject order ${currentOrderId}?`, true, false);
        });
    });

    closeActionModal.addEventListener('click', closeActionModalFunc);
    cancelAction.addEventListener('click', closeActionModalFunc);

    confirmAction.addEventListener('click', function() {
        handleOrderAction(currentOrderId, currentAction);
    });

    // Update Status buttons
    document.querySelectorAll('.btn-update-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order');
            updateOrderStatus(orderId);
        });
    });

    // Delivery buttons
    document.querySelectorAll('.btn-start-delivery').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order');
            startDelivery(orderId);
        });
    });

    document.querySelectorAll('.btn-mark-delivered').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order');
            markAsDelivered(orderId);
        });
    });

    // Search functionality
    setupSearchFunctionality();

    // Filter functionality
    setupFilterFunctionality();

    // Sign out modal functionality
    setupSignOutModal();

    // Close modals when clicking outside
    setupModalCloseHandlers();
});

function showOrderDetails(orderId) {
    // Update modal title
    document.getElementById('orderIdTitle').textContent = `#${orderId}`;
    
    // Get order data
    const orderData = getOrderData(orderId);
    
    // Generate order details HTML
    const orderDetailsHTML = generateOrderDetailsHTML(orderData);
    
    // Update modal content
    document.getElementById('orderDetailsContent').innerHTML = orderDetailsHTML;
    
    // Show modal
    document.getElementById('orderDetailsModal').classList.add('open');
}

function closeOrderDetails() {
    document.getElementById('orderDetailsModal').classList.remove('open');
}

// Order data structure for florist
function getOrderData(orderId) {
    const orderDatabase = {
        'ORD-FL-001': {
            orderId: 'ORD-FL-001',
            userId: 'USR-FL-001',
            customerName: 'Sarah Ahmed',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-20',
            orderType: 'Custom',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            initialStatus: 'Accepted',
            subtotal: 'SAR 180.00',
            deliveryFee: 'SAR 25.00',
            total: 'SAR 205.00',
            addressId: 'ADD-FL-001',
            notes: 'Please use pink and white roses only. Need delivery before 6 PM. Special arrangement for wedding.',
            descriptiveNotes: 'Elegant wedding flower arrangement with pink and white roses. The bride wants a modern design with baby breath accents. Large centerpiece for wedding ceremony.',
            referenceImages: [
                '../../../images/rose.jpg',
                '../../../images/flower1.jpg'
            ],
            address: {
                id: 'ADD-FL-001',
                name: 'Sarah Ahmed',
                street: 'Al-Olaya District, Riyadh',
                building: 'Building 123, Street 45',
                phone: '+966501234567'
            },
            customer: {
                name: 'Sarah Ahmed',
                email: 'sarah@example.com',
                phone: '+966501234567',
                avatar: '../../../images/woman.jpg',
                address: 'Al-Olaya District, Riyadh, Saudi Arabia',
                since: '2024-03-15',
                orderCount: 3
            },
            paymentMethod: 'Credit Card (****1234)',
            priority: 'High',
            items: [
                {
                    orderId: 'ORD-FL-001',
                    productType: 'Flowers',
                    productId: 'PRD-FLOW-001',
                    addonType: 'Wedding Arrangement',
                    addonId: 'ADD-FLOW-001',
                    quantity: 1,
                    price: 'SAR 205.00',
                    total: 'SAR 205.00',
                    notes: 'Pink and white roses, baby breath, large centerpiece'
                }
            ]
        },
        'ORD-FL-002': {
            orderId: 'ORD-FL-002',
            userId: 'USR-FL-002',
            customerName: 'Mohammed Ali',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-18',
            orderType: 'From Products',
            paymentStatus: 'Paid',
            orderStatus: 'In Progress',
            initialStatus: 'Accepted',
            subtotal: 'SAR 120.00',
            deliveryFee: 'SAR 25.00',
            total: 'SAR 145.00',
            addressId: 'ADD-FL-002',
            notes: 'Birthday celebration with mixed flowers',
            descriptiveNotes: 'Beautiful mixed flower bouquet for birthday celebration',
            referenceImages: [],
            address: {
                id: 'ADD-FL-002',
                name: 'Mohammed Ali',
                street: 'Al-Malqa District, Riyadh',
                building: 'Building 456, Street 78',
                phone: '+966501234568'
            },
            customer: {
                name: 'Mohammed Ali',
                email: 'mohammed@example.com',
                phone: '+966501234568',
                avatar: '../../../images/avater2.jpg',
                address: 'Al-Malqa District, Riyadh, Saudi Arabia',
                since: '2024-05-20',
                orderCount: 2
            },
            paymentMethod: 'Apple Pay',
            priority: 'Medium',
            items: [
                {
                    orderId: 'ORD-FL-002',
                    productType: 'Flowers',
                    productId: 'PRD-FLOW-002',
                    addonType: 'Mixed Bouquet',
                    addonId: 'ADD-FLOW-002',
                    quantity: 1,
                    price: 'SAR 145.00',
                    total: 'SAR 145.00',
                    notes: 'Mixed seasonal flowers with baby breath'
                }
            ]
        },
        'ORD-FL-003': {
            orderId: 'ORD-FL-003',
            userId: 'USR-FL-003',
            customerName: 'Fatima Hassan',
            orderDate: '2025-01-14',
            deliveryDate: '2025-01-17',
            orderType: 'Custom',
            paymentStatus: 'Unpaid',
            orderStatus: 'Canceled',
            initialStatus: 'Rejected',
            rejectionReason: 'Unable to fulfill custom requirements within timeframe',
            subtotal: 'SAR 250.00',
            deliveryFee: 'SAR 25.00',
            total: 'SAR 275.00',
            addressId: 'ADD-FL-003',
            notes: 'Need a special flower arrangement for anniversary. Theme should be romantic.',
            descriptiveNotes: 'Romantic anniversary flower arrangement with red roses and candles. Special request for heart-shaped design.',
            referenceImages: [],
            address: {
                id: 'ADD-FL-003',
                name: 'Fatima Hassan',
                street: 'Al-Narjis, Riyadh',
                building: 'Building 789, Street 12',
                phone: '+966501234569'
            },
            customer: {
                name: 'Fatima Hassan',
                email: 'fatima@example.com',
                phone: '+966501234569',
                avatar: '../../../images/wowan2.jpg',
                address: 'Al-Narjis, Riyadh, Saudi Arabia',
                since: '2024-08-10',
                orderCount: 1
            },
            paymentMethod: 'Cash on Delivery',
            priority: 'Low',
            items: [
                {
                    orderId: 'ORD-FL-003',
                    productType: 'Flowers',
                    productId: 'PRD-FLOW-003',
                    addonType: 'Romantic Arrangement',
                    addonId: 'ADD-FLOW-003',
                    quantity: 1,
                    price: 'SAR 275.00',
                    total: 'SAR 275.00',
                    notes: 'Red roses, heart-shaped design, romantic theme'
                }
            ]
        },
        'ORD-FL-004': {
            orderId: 'ORD-FL-004',
            userId: 'USR-FL-004',
            customerName: 'Layla Mohammed',
            orderDate: '2025-01-16',
            deliveryDate: '2025-01-18',
            orderType: 'From Products',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            initialStatus: 'Accepted',
            subtotal: 'SAR 70.00',
            deliveryFee: 'SAR 25.00',
            total: 'SAR 95.00',
            addressId: 'ADD-FL-004',
            notes: 'Office decoration with fresh flowers',
            descriptiveNotes: 'Fresh flower arrangement for office reception area',
            referenceImages: [],
            address: {
                id: 'ADD-FL-004',
                name: 'Layla Mohammed',
                street: 'Al-Malqa District, Riyadh',
                building: 'Building 101, Street 22',
                phone: '+966501234570'
            },
            customer: {
                name: 'Layla Mohammed',
                email: 'layla@example.com',
                phone: '+966501234570',
                avatar: '../../../images/avater3.jpg',
                address: 'Al-Malqa District, Riyadh, Saudi Arabia',
                since: '2024-01-15',
                orderCount: 4
            },
            paymentMethod: 'Bank Transfer',
            priority: 'Low',
            items: [
                {
                    orderId: 'ORD-FL-004',
                    productType: 'Flowers',
                    productId: 'PRD-FLOW-004',
                    addonType: 'Office Arrangement',
                    addonId: 'ADD-FLOW-004',
                    quantity: 1,
                    price: 'SAR 95.00',
                    total: 'SAR 95.00',
                    notes: 'Fresh seasonal flowers, office decoration'
                }
            ]
        },
        'ORD-FL-005': {
            orderId: 'ORD-FL-005',
            userId: 'USR-FL-005',
            customerName: 'Khalid Omar',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-19',
            orderType: 'Custom',
            paymentStatus: 'Paid',
            orderStatus: 'In Progress',
            initialStatus: 'Accepted',
            subtotal: 'SAR 295.00',
            deliveryFee: 'SAR 25.00',
            total: 'SAR 320.00',
            addressId: 'ADD-FL-005',
            notes: 'Wedding flower decoration with specific design requirements',
            descriptiveNotes: 'Complete wedding flower decoration package including centerpieces, bouquets, and ceremony flowers',
            referenceImages: [
                '../../../images/flower1.jpg',
                '../../../images/rose.jpg'
            ],
            address: {
                id: 'ADD-FL-005',
                name: 'Khalid Omar',
                street: 'Al-Olaya, Riyadh',
                building: 'Building 202, Street 33',
                phone: '+966501234571'
            },
            customer: {
                name: 'Khalid Omar',
                email: 'khalid@example.com',
                phone: '+966501234571',
                avatar: '../../../images/avater4.jpg',
                address: 'Al-Olaya, Riyadh, Saudi Arabia',
                since: '2024-06-01',
                orderCount: 2
            },
            paymentMethod: 'Credit Card (****5678)',
            priority: 'High',
            items: [
                {
                    orderId: 'ORD-FL-005',
                    productType: 'Flowers',
                    productId: 'PRD-FLOW-005',
                    addonType: 'Wedding Package',
                    addonId: 'ADD-FLOW-005',
                    quantity: 1,
                    price: 'SAR 320.00',
                    total: 'SAR 320.00',
                    notes: 'Complete wedding flower package, centerpieces, bouquets'
                }
            ]
        }
    };
    
    // Return order data or null if not found
    return orderDatabase[orderId] || null;
}

function generateOrderDetailsHTML(orderData) {
    // If no order data, create a default order structure
    if (!orderData) {
        orderData = {
            orderId: 'ORD-FL-000',
            userId: 'USR-FL-000',
            customerName: 'Unknown Customer',
            orderDate: '2025-10-01',
            deliveryDate: '2025-10-02',
            orderType: 'From Products',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            initialStatus: 'Accepted',
            subtotal: 'SAR 0.00',
            deliveryFee: 'SAR 0.00',
            total: 'SAR 0.00',
            addressId: 'ADD-FL-000',
            notes: 'No additional notes available.',
            descriptiveNotes: 'Order details are being loaded.',
            referenceImages: [],
            address: {
                id: 'ADD-FL-000',
                name: 'Unknown Customer',
                street: 'Address not available',
                building: 'Building not specified',
                phone: 'Phone not available'
            },
            items: [
                {
                    orderId: 'ORD-FL-000',
                    productType: 'Flowers',
                    productId: 'PROD-FLOW-000',
                    addonType: 'None',
                    addonId: '',
                    quantity: 1,
                    price: 'SAR 0.00',
                    notes: 'No item details available'
                }
            ]
        };
    }
    
    const badgeClass = orderData.orderType === 'Custom' ? 'badge-special' : 'badge-products';
    const statusClass = `status-${orderData.orderStatus.toLowerCase().replace(' ', '-')}`;
    const paymentClass = `status-${orderData.paymentStatus.toLowerCase()}`;
    const initialStatusClass = `status-${orderData.initialStatus.toLowerCase()}`;
    
    let rejectionReasonHTML = '';
    if (orderData.initialStatus === 'Rejected' && orderData.rejectionReason) {
        rejectionReasonHTML = `
            <div class="info-item">
                <label>Rejection Reason:</label>
                <span class="rejection-reason">${orderData.rejectionReason}</span>
            </div>
        `;
    }
    
    let referenceImagesHTML = '';
    if (orderData.referenceImages && orderData.referenceImages.length > 0) {
        referenceImagesHTML = `
            <div class="reference-images-section">
                <h4><i class="fas fa-images"></i> Reference Images</h4>
                <div class="images-grid">
                    ${orderData.referenceImages.map(img => `
                        <div class="image-item">
                            <img src="${img}" alt="Reference Image">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    return `
        <div class="details-grid">
            <div class="order-info-section">
                <h4><i class="fas fa-info-circle"></i> Order Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Order ID:</label>
                        <span class="order-id">${orderData.orderId}</span>
                    </div>
                    <div class="info-item">
                        <label>User ID:</label>
                        <span class="user-id">${orderData.userId}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Date:</label>
                        <span>${orderData.orderDate}</span>
                    </div>
                    <div class="info-item">
                        <label>Delivery Date:</label>
                        <span>${orderData.deliveryDate}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Type:</label>
                        <span class="badge ${badgeClass}">${orderData.orderType}</span>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <span class="status ${statusClass}">${orderData.orderStatus}</span>
                    </div>
                    <div class="info-item">
                        <label>Payment Status:</label>
                        <span class="status ${paymentClass}">${orderData.paymentStatus}</span>
                    </div>
                    <div class="info-item">
                        <label>Address ID:</label>
                        <span class="address-id">${orderData.addressId}</span>
                    </div>
                    <div class="info-item">
                        <label>Initial Status:</label>
                        <span class="status ${initialStatusClass}">${orderData.initialStatus}</span>
                    </div>
                    ${orderData.priority ? `
                        <div class="info-item">
                            <label>Priority:</label>
                            <span class="priority-badge priority-${orderData.priority.toLowerCase()}">${orderData.priority}</span>
                        </div>
                    ` : ''}
                    ${rejectionReasonHTML}
                </div>
            </div>

            <div class="customer-section">
                <h4><i class="fas fa-user"></i> Customer Information</h4>
                <div class="customer-content">
                    <div class="customer-header">
                        <img src="${orderData.customer?.avatar || '../../../images/ceek1.jpg'}" alt="Customer Avatar" class="customer-avatar">
                        <div class="customer-details">
                            <h5>${orderData.customerName}</h5>
                            <p><i class="fas fa-envelope"></i> ${orderData.customer?.email || 'N/A'}</p>
                            <p><i class="fas fa-phone"></i> ${orderData.customer?.phone || orderData.address.phone}</p>
                            <p><i class="fas fa-calendar"></i> Customer since: ${orderData.customer?.since || 'N/A'}</p>
                            <p><i class="fas fa-shopping-bag"></i> Total orders: ${orderData.customer?.orderCount || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pricing-section">
                <h4><i class="fas fa-calculator"></i> Pricing Details</h4>
                <div class="pricing-grid">
                    <div class="price-item">
                        <label>Subtotal:</label>
                        <span>${orderData.subtotal}</span>
                    </div>
                    <div class="price-item">
                        <label>Delivery Fee:</label>
                        <span>${orderData.deliveryFee}</span>
                    </div>
                    <div class="price-item total">
                        <label>Total Amount:</label>
                        <span class="price-total">${orderData.total}</span>
                    </div>
                    ${orderData.paymentMethod ? `
                        <div class="price-item">
                            <label>Payment Method:</label>
                            <span class="payment-method">${orderData.paymentMethod}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="address-section">
                <h4><i class="fas fa-map-marker-alt"></i> Delivery Address</h4>
                <div class="address-content">
                    <p><strong>Address ID:</strong> ${orderData.address.id}</p>
                    <p><strong>${orderData.address.name}</strong></p>
                    <p>${orderData.address.street}</p>
                    <p>${orderData.address.building}</p>
                    <p>Phone: ${orderData.address.phone}</p>
                </div>
            </div>

            <div class="notes-section">
                <h4><i class="fas fa-sticky-note"></i> Order Notes</h4>
                <div class="notes-content">
                    <div class="notes-item">
                        <label>Customer Notes:</label>
                        <div class="notes-text">${orderData.notes}</div>
                    </div>
                    <div class="notes-item">
                        <label>Descriptive Notes:</label>
                        <div class="notes-text">${orderData.descriptiveNotes}</div>
                    </div>
                </div>
            </div>

            ${referenceImagesHTML}

            <div class="order-items-section">
                <h4><i class="fas fa-shopping-bag"></i> Product Details</h4>
                <div class="items-list">
                    ${orderData.items.map(item => `
                        <div class="item-card">
                            <div class="item-header">
                                <span class="item-name">${item.productType} - ${item.productId}</span>
                                <span class="item-price">${item.price}</span>
                            </div>
                            <div class="item-details">
                                <div class="detail-row">
                                    <span class="detail-label">Order ID:</span>
                                    <span class="detail-value">${item.orderId}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Product Type:</span>
                                    <span class="detail-value">${item.productType}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Product ID:</span>
                                    <span class="detail-value product-id">${item.productId}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Add-on Type:</span>
                                    <span class="detail-value">${item.addonType}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Add-on ID:</span>
                                    <span class="detail-value addon-id">${item.addonId || 'N/A'}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Quantity:</span>
                                    <span class="detail-value">${item.quantity}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Price:</span>
                                    <span class="detail-value price">${item.price}</span>
                                </div>
                                ${item.total ? `
                                    <div class="detail-row">
                                        <span class="detail-label">Total:</span>
                                        <span class="detail-value total">${item.total}</span>
                                    </div>
                                ` : ''}
                                <div class="detail-row notes-row">
                                    <span class="detail-label">Notes:</span>
                                    <span class="detail-value notes">${item.notes}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function showActionModal(title, message, showReason, showPrice) {
    actionTitle.textContent = title;
    actionMessage.textContent = message;
    reasonInput.style.display = showReason ? 'block' : 'none';
    priceInput.style.display = showPrice ? 'block' : 'none';
    
    if (showReason) {
        rejectionReason.value = '';
    }
    
    if (showPrice) {
        // Reset price inputs
        document.getElementById('totalPrice').value = '';
        document.getElementById('priceNotes').value = '';
    }
    
    actionModal.classList.add('open');
}

function closeActionModalFunc() {
    actionModal.classList.remove('open');
    currentOrderId = '';
    currentAction = '';
}

// Removed setupPriceCalculation function as we only need total price input

function handleOrderAction(orderId, action) {
    if (action === 'reject' && !rejectionReason.value.trim()) {
        showToast('Reason Required', 'Please provide a reason for rejection.', 'error');
        return;
    }

    if (action === 'accept') {
        const total = parseFloat(document.getElementById('totalPrice').value);
        const priceNotes = document.getElementById('priceNotes').value;

        if (!total || total <= 0) {
            showToast('Price Required', 'Please enter a valid total price.', 'error');
            return;
        }
    }

    showToast('Processing...', `${action === 'accept' ? 'Accepting' : 'Rejecting'} order ${orderId}...`, 'info');

    setTimeout(() => {
        if (action === 'accept') {
            const total = document.getElementById('totalPrice').value;
            const priceNotes = document.getElementById('priceNotes').value;

            showToast('Order Accepted', `Order ${orderId} has been accepted with price SAR ${total}.`, 'success');
            
            // Remove from incoming orders table
            const orderRow = document.querySelector(`[data-order="${orderId}"]`);
            if (orderRow) {
                orderRow.style.opacity = '0';
                setTimeout(() => {
                    orderRow.remove();
                    // You could add logic here to move the row to the processing table
                }, 300);
            }
        } else {
            showToast('Order Rejected', `Order ${orderId} has been rejected.`, 'success');
            // Remove from incoming orders table
            const orderRow = document.querySelector(`[data-order="${orderId}"]`);
            if (orderRow) {
                orderRow.style.opacity = '0';
                setTimeout(() => {
                    orderRow.remove();
                }, 300);
            }
        }
        
        closeActionModalFunc();
    }, 1500);
}

function updateOrderStatus(orderId) {
    showToast('Updating Status', `Updating status for order ${orderId}...`, 'info');

    setTimeout(() => {
        showToast('Status Updated', `Order ${orderId} status updated successfully.`, 'success');
        
        // In real application, you would update the status in the backend
        const statusElement = document.querySelector(`[data-order="${orderId}"]`).querySelector('.status');
        if (statusElement.classList.contains('status-processing')) {
            statusElement.textContent = 'In Progress';
            statusElement.className = 'status status-in-progress';
        } else if (statusElement.classList.contains('status-in-progress')) {
            statusElement.textContent = 'Completed';
            statusElement.className = 'status status-completed';
        }
    }, 1500);
}

function startDelivery(orderId) {
    showToast('Starting Delivery', `Starting delivery for order ${orderId}...`, 'info');

    setTimeout(() => {
        showToast('Delivery Started', `Delivery for order ${orderId} has started.`, 'success');
        
        const statusElement = document.querySelector(`[data-order="${orderId}"]`).querySelector('.status');
        statusElement.textContent = 'In Delivery';
        statusElement.className = 'status status-in-delivery';
    }, 1500);
}

function markAsDelivered(orderId) {
    showToast('Marking Delivered', `Marking order ${orderId} as delivered...`, 'info');

    setTimeout(() => {
        showToast('Order Delivered', `Order ${orderId} has been marked as delivered.`, 'success');
        
        const statusElement = document.querySelector(`[data-order="${orderId}"]`).querySelector('.status');
        statusElement.textContent = 'Delivered';
        statusElement.className = 'status status-delivered';
    }, 1500);
}

function setupSearchFunctionality() {
    const searchInputs = {
        incoming: document.getElementById('searchIncoming'),
        processing: document.getElementById('searchProcessing'),
        delivery: document.getElementById('searchDelivery')
    };

    Object.keys(searchInputs).forEach(tab => {
        if (searchInputs[tab]) {
            searchInputs[tab].addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const table = document.querySelector(`#${tab} .orders-table tbody`);
                const rows = table.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    });
}

function setupFilterFunctionality() {
    const filterOrderType = document.getElementById('filterOrderType');
    const filterProcessingStatus = document.getElementById('filterProcessingStatus');
    const filterDeliveryStatus = document.getElementById('filterDeliveryStatus');

    if (filterOrderType) {
        filterOrderType.addEventListener('change', function() {
            filterTableByType(this.value, 'incoming');
        });
    }

    if (filterProcessingStatus) {
        filterProcessingStatus.addEventListener('change', function() {
            filterTableByStatus(this.value, 'processing');
        });
    }

    if (filterDeliveryStatus) {
        filterDeliveryStatus.addEventListener('change', function() {
            filterTableByStatus(this.value, 'delivery');
        });
    }
}

function filterTableByType(type, tab) {
    const table = document.querySelector(`#${tab} .orders-table tbody`);
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const typeElement = row.querySelector('.badge');
        const rowType = typeElement.classList.contains('badge-special') ? 'special' : 'products';
        
        if (!type || rowType === type) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterTableByStatus(status, tab) {
    const table = document.querySelector(`#${tab} .orders-table tbody`);
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const statusElement = row.querySelector('.status');
        const rowStatus = statusElement.className.replace('status ', '').replace('status-', '');
        
        if (!status || rowStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function setupSignOutModal() {
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');
    
    openSignOutBtn.addEventListener('click', function() {
        signOutModal.classList.add('open');
    });
    
    cancelSignOutBtn.addEventListener('click', function() {
        signOutModal.classList.remove('open');
    });
    
    confirmSignOutBtn.addEventListener('click', function() {
        showToast('Signed out successfully', 'You have been signed out of your account.', 'success');
        signOutModal.classList.remove('open');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

function setupModalCloseHandlers() {
    const modals = ['orderDetailsModal', 'actionModal', 'signOutModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('open');
                }
            });
        }
    });
}

// Toast notification function
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toastTemplate = document.getElementById('toast-template');
    const toastClone = toastTemplate.content.cloneNode(true);
    const toast = toastClone.querySelector('.toast');
    const toastIcon = toast.querySelector('.toast-icon i');
    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set toast content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    let iconClass, bgColor;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            bgColor = '#10b981';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            bgColor = '#f59e0b';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            bgColor = '#ef4444';
            break;
        default:
            iconClass = 'fas fa-info-circle';
            bgColor = 'var(--bright-blue)';
    }
    
    toastIcon.className = iconClass;
    toast.querySelector('.toast-icon').style.backgroundColor = bgColor;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Add slideOut animation for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
