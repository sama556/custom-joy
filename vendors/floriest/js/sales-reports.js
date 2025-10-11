// sales-reports.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initRevenueChart();
    initOrdersChart();
    initCategoriesChart();
    initSeasonalChart();

    // Date range functionality
    const dateRangeBtns = document.querySelectorAll('.date-controls .btn');
    const applyDateRange = document.getElementById('applyDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    dateRangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            dateRangeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const range = this.getAttribute('data-range');
            updateDateRange(range);
        });
    });

    applyDateRange.addEventListener('click', function() {
        showToast('Date Range Applied', `Showing data from ${startDate.value} to ${endDate.value}`, 'info');
        // In real application, you would reload data based on selected range
    });

    // Chart type selectors
    const revenueChartType = document.getElementById('revenueChartType');
    const ordersChartType = document.getElementById('ordersChartType');

    revenueChartType.addEventListener('change', function() {
        updateRevenueChart(this.value);
    });

    ordersChartType.addEventListener('change', function() {
        updateOrdersChart(this.value);
    });

    // Report generation
    const reportModal = document.getElementById('reportModal');
    const closeReportModal = document.getElementById('closeReportModal');
    const cancelReport = document.getElementById('cancelReport');
  
    // Add generate report button if it doesn't exist
  

   
  
   
    
    // Sign out functionality
    setupSignOutModal();
});

// Chart initialization functions
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue (SAR)',
                data: [2200, 2800, 3200, 2900, 3500, 4200, 3800, 4100, 3600, 3300, 2800, 2400],
                borderColor: '#368BFF',
                backgroundColor: 'rgba(54, 139, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
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
}

function initOrdersChart() {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Orders',
                data: [12, 19, 15, 22],
                backgroundColor: '#FF4FA1',
                borderColor: '#FF4FA1',
                borderWidth: 1
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
}

function initCategoriesChart() {
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Roses', 'Tulips', 'Lilies', 'Orchids', 'Mixed Bouquets', 'Seasonal'],
            datasets: [{
                data: [25, 20, 15, 12, 18, 10],
                backgroundColor: [
                    '#FF4FA1',
                    '#368BFF',
                    '#10b981',
                    '#FFB11B',
                    '#7ED7FF',
                    '#f59e0b'
                ],
                borderWidth: 0
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
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function initSeasonalChart() {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Spring', 'Summer', 'Autumn', 'Winter', 'Valentine\'s', 'Mother\'s Day', 'Wedding Season', 'Holidays'],
            datasets: [{
                label: 'Flower Demand',
                data: [85, 70, 60, 45, 95, 90, 80, 75],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#10b981'
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
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Chart update functions
function updateRevenueChart(type) {
    showToast('Chart Updated', `Revenue chart switched to ${type} view`, 'info');
    // In real application, you would update the chart data here
}

function updateOrdersChart(type) {
    showToast('Chart Updated', `Orders chart switched to ${type} view`, 'info');
    // In real application, you would update the chart data here
}

function updateDateRange(range) {
    const ranges = {
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year'
    };
    
    showToast('Date Range Changed', `Showing data for ${ranges[range]}`, 'info');
    // In real application, you would update the data based on the selected range
}

// Sign out modal functionality
function setupSignOutModal() {
    const openSignOut = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOut = document.getElementById('cancelSignOut');
    const confirmSignOut = document.getElementById('confirmSignOut');

    openSignOut.addEventListener('click', function() {
        signOutModal.classList.add('open');
    });

    cancelSignOut.addEventListener('click', function() {
        signOutModal.classList.remove('open');
    });

    confirmSignOut.addEventListener('click', function() {
        showToast('Signed Out', 'You have been successfully signed out.', 'success');
        signOutModal.classList.remove('open');
        // In real application, redirect to login page
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
