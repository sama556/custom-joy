// overview.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initRevenueChart();
    initOrderStatusChart();
    
    // Sign out modal functionality
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
        // In a real application, you would handle sign out logic here
        showToast('Signed out successfully', 'You have been signed out of your account.', 'success');
        signOutModal.classList.remove('open');
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    // Close modal when clicking outside
    signOutModal.addEventListener('click', function(e) {
        if (e.target === signOutModal) {
            signOutModal.classList.remove('open');
        }
    });
    
    // Revenue period selector
    const revenuePeriod = document.getElementById('revenuePeriod');
    revenuePeriod.addEventListener('change', function() {
        updateRevenueChart(this.value);
    });
});

// Initialize Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Sample data for revenue chart
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue (SAR)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            backgroundColor: 'rgba(54, 139, 255, 0.2)',
            borderColor: 'rgba(54, 139, 255, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: revenueData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `SAR ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'SAR ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Store chart instance for updates
    window.revenueChart = revenueChart;
}

// Initialize Order Status Chart
function initOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    
    // Sample data for order status
    const orderStatusData = {
        labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
        datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
                'rgba(46, 204, 113, 0.8)',
                'rgba(54, 139, 255, 0.8)',
                'rgba(255, 177, 27, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(54, 139, 255, 1)',
                'rgba(255, 177, 27, 1)',
                'rgba(231, 76, 60, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: orderStatusData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update Revenue Chart based on selected period
function updateRevenueChart(period) {
    // In a real application, you would fetch new data based on the period
    // For now, we'll just simulate with different data
    
    let newData;
    let newLabels;
    
    switch(period) {
        case 'week':
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [3500, 4200, 3800, 5100, 4900, 6200, 5800];
            break;
        case 'month':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [15000, 18000, 22000, 19000];
            break;
        case 'quarter':
            newLabels = ['Month 1', 'Month 2', 'Month 3'];
            newData = [65000, 72000, 81000];
            break;
        default:
            return;
    }
    
    window.revenueChart.data.labels = newLabels;
    window.revenueChart.data.datasets[0].data = newData;
    window.revenueChart.update();
    
    showToast('Chart Updated', `Revenue data for ${period} displayed.`, 'info');
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
            bgColor = '#2ecc71';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            bgColor = '#f39c12';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            bgColor = '#e74c3c';
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