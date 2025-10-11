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
            window.location.href = '../../index.html';
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
    const canvas = document.getElementById('revenueChart');
    canvas.style.height = '80vh';
    const ctx = canvas.getContext('2d');
    
    // Sample data for revenue chart
    const revenueData = {
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1200, 1800, 1500, 2200, 1900, 2500, 2100]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [6800, 7200, 8100, 8900]
        },
        quarter: {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            data: [28500, 31200, 28900]
        }
    };
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueData.month.labels,
            datasets: [{
                label: 'Revenue (SAR)',
                data: revenueData.month.data,
                borderColor: '#368BFF',
                backgroundColor: 'rgba(54, 139, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#368BFF',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'SAR ' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

// Initialize Order Status Chart
function initOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
            datasets: [{
                data: [65, 20, 12, 3],
                backgroundColor: [
                    '#10b981',
                    '#368BFF',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Update Revenue Chart based on period
function updateRevenueChart(period) {
    const revenueData = {
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1200, 1800, 1500, 2200, 1900, 2500, 2100]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [6800, 7200, 8100, 8900]
        },
        quarter: {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            data: [28500, 31200, 28900]
        }
    };
    
    const chart = Chart.getChart('revenueChart');
    if (chart) {
        chart.data.labels = revenueData[period].labels;
        chart.data.datasets[0].data = revenueData[period].data;
        chart.update();
    }
    
    showToast('Chart Updated', `Revenue chart updated to show ${period} data`, 'info');
}

// Toast notification system
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toastTemplate = document.getElementById('toast-template');
    const toast = toastTemplate.content.cloneNode(true);
    
    const toastElement = toast.querySelector('.toast');
    const toastIcon = toast.querySelector('.toast-icon i');
    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');
    const toastClose = toast.querySelector('.toast-close');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#368BFF'
    };
    
    toastIcon.className = icons[type] || icons.info;
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastElement.style.borderLeftColor = colors[type] || colors.info;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const toastEl = toastContainer.querySelector('.toast:last-child');
        if (toastEl) {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.parentNode.removeChild(toastEl);
                }
            }, 300);
        }
    }, 5000);
    
    // Close button functionality
    toastClose.addEventListener('click', function() {
        const toastEl = this.closest('.toast');
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toastEl.parentNode) {
                toastEl.parentNode.removeChild(toastEl);
            }
        }, 300);
    });
}
