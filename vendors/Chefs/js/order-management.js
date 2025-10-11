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
    const orderDetailsContents = document.querySelectorAll('.order-details-content');

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
    
    // Get order data and generate HTML
    
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

// Order data structure
function getOrderData(orderId) {
    const orderDatabase = {
        'ORD-2401001': {
            orderId: 'ORD-2401001',
            userId: 'USR-001',
            customerName: 'Ahmed Al-Rashid',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-20',
            orderType: 'Custom',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            initialStatus: 'Accepted',
            subtotal: 'SAR 420.00',
            deliveryFee: 'SAR 30.00',
            total: 'SAR 450.00',
            addressId: 'ADD-001',
            notes: 'Please make sure the flowers are pink and white colors only. The cake should serve 50 people. Need delivery before 6 PM.',
            descriptiveNotes: 'Elegant wedding cake with fresh flower decoration. The couple wants a modern design with gold leaf details. Three-layer vanilla cake with buttercream frosting.',
            referenceImages: [
                '../../../images/ceek3.jpg',
                '../../../images/ceek4.jpg'
            ],
            address: {
                id: 'ADD-001',
                name: 'Ahmed Al-Rashid',
                street: 'Al-Olaya District, Riyadh',
                building: 'Building 123, Street 45',
                phone: '+966501234567'
            },
            customer: {
                name: 'Ahmed Al-Rashid',
                email: 'ahmed@example.com',
                phone: '+966501234567',
                avatar: '../../../images/ceek1.jpg',
                address: 'Al-Olaya District, Riyadh, Saudi Arabia',
                since: '2024-03-15',
                orderCount: 5
            },
            paymentMethod: 'Credit Card (****1234)',
            priority: 'High',
            items: [
                {
                    orderId: 'ORD-2401001',
                    productType: 'Cake',
                    productId: 'PRD-CAKE-001',
                    addonType: 'Cake Decorations',
                    addonId: 'ADD-CAKE-001',
                    quantity: 1,
                    price: 'SAR 450.00',
                    total: 'SAR 450.00',
                    notes: 'Gold leaf decoration, fresh flowers, 3-tier design'
                }
            ]
        },
        'ORD-2401002': {
            orderId: 'ORD-2401002',
            userId: 'USR-002',
            customerName: 'Sarah Mohammed',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-18',
            orderType: 'From Products',
            paymentStatus: 'Paid',
            orderStatus: 'In Progress',
            initialStatus: 'Accepted',
            subtotal: 'SAR 250.00',
            deliveryFee: 'SAR 30.00',
            total: 'SAR 280.00',
            addressId: 'ADD-002',
            notes: 'Add "Happy Birthday Sarah" in pink writing',
            descriptiveNotes: 'Birthday celebration order with cake and flowers',
            referenceImages: [],
            address: {
                id: 'ADD-002',
                name: 'Sarah Mohammed',
                street: 'Al-Malqa District, Riyadh',
                building: 'Building 456, Street 78',
                phone: '+966501234568'
            },
            items: [
                {
                    orderId: 'ORD-2401002',
                    productType: 'Cake',
                    productId: 'CAKE-002',
                    addonType: 'None',
                    addonId: '',
                    quantity: 1,
                    price: 'SAR 180.00',
                    notes: 'Add "Happy Birthday Sarah" in pink writing'
                },
                {
                    orderId: 'ORD-2401002',
                    productType: 'Flowers',
                    productId: 'FLWR-001',
                    addonType: 'Seasonal Flowers',
                    addonId: 'ADDON-002',
                    quantity: 1,
                    price: 'SAR 100.00',
                    notes: 'Include baby breath'
                }
            ]
        },
        'ORD-2401003': {
            orderId: 'ORD-2401003',
            userId: 'USR-003',
            customerName: 'Mohammed Hassan',
            orderDate: '2025-01-14',
            deliveryDate: '2025-01-17',
            orderType: 'Custom',
            paymentStatus: 'Unpaid',
            orderStatus: 'Canceled',
            initialStatus: 'Rejected',
            rejectionReason: 'Unable to fulfill custom requirements within timeframe',
            subtotal: 'SAR 290.00',
            deliveryFee: 'SAR 30.00',
            total: 'SAR 320.00',
            addressId: 'ADD-003',
            notes: 'Need a birthday cake for a 5-year-old boy. Theme should be superhero.',
            descriptiveNotes: 'Colorful superhero themed cake with action figures. Chocolate cake with vanilla frosting.',
            referenceImages: [],
            address: {
                id: 'ADD-003',
                name: 'Mohammed Hassan',
                street: 'Al-Narjis, Riyadh',
                building: 'Building 789, Street 12',
                phone: '+966501234569'
            },
            items: [
                {
                    orderId: 'ORD-2401003',
                    productType: 'Cake',
                    productId: 'CAKE-003',
                    addonType: 'Custom Decorations',
                    addonId: 'ADDON-003',
                    quantity: 1,
                    price: 'SAR 320.00',
                    notes: 'Superhero theme, action figures, colorful design'
                }
            ]
        },
        'ORD-2401004': {
            orderId: 'ORD-2401004',
            userId: 'USR-004',
            customerName: 'Fatima Ahmed',
            orderDate: '2025-01-16',
            deliveryDate: '2025-01-18',
            orderType: 'From Products',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            initialStatus: 'Accepted',
            subtotal: 'SAR 150.00',
            deliveryFee: 'SAR 30.00',
            total: 'SAR 180.00',
            addressId: 'ADD-004',
            notes: 'Birthday celebration with flowers',
            descriptiveNotes: 'Beautiful flower arrangement for birthday party',
            referenceImages: [],
            address: {
                id: 'ADD-004',
                name: 'Fatima Ahmed',
                street: 'Al-Malqa District, Riyadh',
                building: 'Building 101, Street 22',
                phone: '+966501234570'
            },
            items: [
                {
                    orderId: 'ORD-2401004',
                    productType: 'Flowers',
                    productId: 'FLWR-002',
                    addonType: 'Seasonal Flowers',
                    addonId: 'ADDON-004',
                    quantity: 1,
                    price: 'SAR 180.00',
                    notes: 'Mixed seasonal flowers with baby breath'
                }
            ]
        },
        'ORD-2401005': {
            orderId: 'ORD-2401005',
            userId: 'USR-005',
            customerName: 'Khalid Omar',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-19',
            orderType: 'Custom',
            paymentStatus: 'Paid',
            orderStatus: 'In Progress',
            initialStatus: 'Accepted',
            subtotal: 'SAR 380.00',
            deliveryFee: 'SAR 30.00',
            total: 'SAR 410.00',
            addressId: 'ADD-005',
            notes: 'Wedding cake with specific design requirements',
            descriptiveNotes: 'Three-tier wedding cake with gold accents and fresh flowers',
            referenceImages: [
                '../../../images/ceek3.jpg',
                '../../../images/ceek4.jpg'
            ],
            address: {
                id: 'ADD-005',
                name: 'Khalid Omar',
                street: 'Al-Olaya, Riyadh',
                building: 'Building 202, Street 33',
                phone: '+966501234571'
            },
            items: [
                {
                    orderId: 'ORD-2401005',
                    productType: 'Cake',
                    productId: 'CAKE-004',
                    addonType: 'Wedding Decorations',
                    addonId: 'ADDON-005',
                    quantity: 1,
                    price: 'SAR 410.00',
                    notes: 'Three-tier design with gold leaf and fresh flowers'
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
            orderId: 'ORD-000000',
            userId: 'USR-000',
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
            addressId: 'ADD-000',
            notes: 'No additional notes available.',
            descriptiveNotes: 'Order details are being loaded.',
            referenceImages: [],
            address: {
                id: 'ADD-000',
                name: 'Unknown Customer',
                street: 'Address not available',
                building: 'Building not specified',
                phone: 'Phone not available'
            },
            items: [
                {
                    orderId: 'ORD-000000',
                    productType: 'Unknown',
                    productId: 'PROD-000',
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