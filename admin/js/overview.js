
// Initialize Charts
document.addEventListener('DOMContentLoaded', function () {
    // Sign out modal wiring
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

    if (openSignOutBtn) {
        openSignOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (cancelSignOutBtn) {
        cancelSignOutBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    if (signOutModal) {
        signOutModal.addEventListener('click', (e) => {
            if (e.target === signOutModal) {
                closeModal();
            }
        });
    }

    if (confirmSignOutBtn) {
        confirmSignOutBtn.addEventListener('click', () => {
            closeModal();
            showToast('Signed out', 'You have been signed out successfully.', 'success');
            // Redirect placeholder: replace with real sign-out route if available
            // window.location.href = '/login';
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 22000, 18000, 24000, 24580],
                borderColor: '#368BFF',
                backgroundColor: 'rgba(54, 139, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Order Status Chart
    const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
    const orderStatusChart = new Chart(orderStatusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#2ecc71',
                    '#368BFF',
                    '#FFB11B',
                    '#e74c3c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Show sample toast notifications
    setTimeout(() => {
        showToast('New Order Received', 'Order #ORD-7843 for a custom wedding cake has been placed.', 'info');
    }, 1000);

    setTimeout(() => {
        showToast('Payment Processed', 'Payment of $245 for order #ORD-7838 has been completed.', 'success');
    }, 4000);

    setTimeout(() => {
        showToast('Low Stock Alert', 'Balloon decorations are running low. Consider restocking.', 'warning');
    }, 7000);
});

// Toast Notification Function
function showToast(title, message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const template = document.getElementById('toast-template');
    const toast = template.content.firstElementChild.cloneNode(true);

    let iconClass = 'fas fa-info-circle';
    let iconColor = '#368BFF';

    if (type === 'success') {
        iconClass = 'fas fa-check-circle';
        iconColor = '#2ecc71';
    } else if (type === 'warning') {
        iconClass = 'fas fa-exclamation-triangle';
        iconColor = '#FFB11B';
    } else if (type === 'error') {
        iconClass = 'fas fa-times-circle';
        iconColor = '#e74c3c';
    }

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

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
}
