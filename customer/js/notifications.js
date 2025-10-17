// Notification System for Customer Pages
let notificationCounter = 0;
let notifications = [];

function updateNotificationBadge() {
    const notificationBadge = document.getElementById('notificationCount');
    if (notificationBadge) {
        notificationBadge.textContent = notificationCounter;
        notificationBadge.style.display = notificationCounter > 0 ? 'block' : 'none';
    }
}

function addNotification(title, message, type = 'info', orderId = null) {
    const notification = {
        id: Date.now(),
        title: title,
        message: message,
        type: type,
        orderId: orderId,
        timestamp: new Date(),
        read: false
    };

    notifications.unshift(notification);
    notificationCounter++;
    updateNotificationBadge();
    loadNotifications();
}

function loadNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;

    if (notifications.length === 0) {
        notificationList.innerHTML = '<li class="dropdown-item text-muted text-center">No notifications</li>';
        return;
    }

    notificationList.innerHTML = notifications.slice(0, 5).map(notification => `
        <li class="dropdown-item notification-item ${notification.read ? '' : 'unread'}" onclick="markAsRead(${notification.id})">
            <div class="d-flex align-items-start">
                <div class="notification-icon me-2">
                    <i class="fas fa-${getNotificationIcon(notification.type)} text-${getNotificationColor(notification.type)}"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-bold">${notification.title}</div>
                    <div class="small text-muted">${notification.message}</div>
                    <div class="small text-muted">${formatTime(notification.timestamp)}</div>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            </div>
        </li>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'order': 'shopping-bag',
        'status': 'info-circle',
        'payment': 'credit-card',
        'delivery': 'truck',
        'info': 'bell'
    };
    return icons[type] || 'bell';
}

function getNotificationColor(type) {
    const colors = {
        'order': 'primary',
        'status': 'success',
        'payment': 'warning',
        'delivery': 'info',
        'info': 'secondary'
    };
    return colors[type] || 'secondary';
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        notificationCounter--;
        updateNotificationBadge();
        loadNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(notification => {
        if (!notification.read) {
            notification.read = true;
            notificationCounter--;
        }
    });
    updateNotificationBadge();
    loadNotifications();
}

// Initialize notifications with some demo data
function initializeNotifications() {
    // Add some demo notifications
    addNotification('Order Status Update', 'Your order #12345 has been confirmed and is being prepared', 'status', '12345');
    addNotification('Payment Received', 'Payment for order #12344 has been successfully processed', 'payment', '12344');
    addNotification('Delivery Update', 'Your order #12343 is out for delivery', 'delivery', '12343');
    addNotification('New Order', 'You have a new order #12342', 'order', '12342');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeNotifications();
    loadNotifications();
});
