// sales-reports.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initRevenueChart();
    initOrdersChart();
    initCategoriesChart();

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
    const generateReport = document.getElementById('generateReport');
    const reportModal = document.getElementById('reportModal');
    const closeReportModal = document.getElementById('closeReportModal');
    const cancelReport = document.getElementById('cancelReport');
    const generateReportBtn = document.getElementById('generateReportBtn');

    generateReport.addEventListener('click', function() {
        reportModal.classList.add('open');
    });

    closeReportModal.addEventListener('click', closeReportModalFunc);
    cancelReport.addEventListener('click', closeReportModalFunc);

    generateReportBtn.addEventListener('click', function() {
        const reportType = document.getElementById('reportType').value;
        const reportFormat = document.getElementById('reportFormat').value;
        const reportStartDate = document.getElementById('reportStartDate').value;
        const reportEndDate = document.getElementById('reportEndDate').value;
        
        generateReportFile(reportType, reportFormat, reportStartDate, reportEndDate);
    });

    // Refresh data
    const refreshData = document.getElementById('refreshData');
    refreshData.addEventListener('click', function() {
        showToast('Refreshing Data', 'Updating sales data and statistics...', 'info');
        setTimeout(() => {
            showToast('Data Updated', 'All reports have been refreshed with latest data.', 'success');
        }, 1500);
    });

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
        showToast('Signed out successfully', 'You have been signed out of your account.', 'success');
        signOutModal.classList.remove('open');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    // Close modals when clicking outside
    [reportModal, signOutModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                if (modal === reportModal) closeReportModalFunc();
                if (modal === signOutModal) signOutModal.classList.remove('open');
            }
        });
    });
});

function updateDateRange(range) {
    const today = new Date();
    let start, end;

    switch(range) {
        case 'week':
            start = new Date(today);
            start.setDate(today.getDate() - 7);
            break;
        case 'month':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            start = new Date(today.getFullYear(), quarter * 3, 1);
            end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
            break;
        case 'year':
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
    }

    document.getElementById('startDate').value = formatDate(start);
    if (end) {
        document.getElementById('endDate').value = formatDate(end);
    } else {
        document.getElementById('endDate').value = formatDate(today);
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue (SAR)',
            data: [32000, 28500, 36500, 29800, 41200, 38600, 45800, 39200, 47600, 43800, 51200, 48600],
            backgroundColor: 'rgba(54, 139, 255, 0.1)',
            borderColor: 'rgba(54, 139, 255, 1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]
    };
    
    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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
                            return 'SAR ' + (value / 1000) + 'K';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
    
    const ordersData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Orders',
            data: [32, 28, 41, 38],
            backgroundColor: [
                'rgba(255, 79, 161, 0.8)',
                'rgba(54, 139, 255, 0.8)',
                'rgba(255, 177, 27, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
                'rgba(255, 79, 161, 1)',
                'rgba(54, 139, 255, 1)',
                'rgba(255, 177, 27, 1)',
                'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    window.ordersChart = new Chart(ctx, {
        type: 'bar',
        data: ordersData,
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
                    ticks: {
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
    
    const categoriesData = {
        labels: ['Birthday', 'Anniversary', 'Custom'],
        datasets: [{
            data: [ 70, 18, 12],
            backgroundColor: [
                'rgba(255, 79, 161, 0.8)',
                'rgba(255, 177, 27, 0.8)',
              
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
                'rgba(255, 79, 161, 1)',
                'rgba(255, 177, 27, 1)',
                
                'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    window.categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: categoriesData,
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value}% (SAR ${(value * 45680 / 100).toLocaleString()})`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function updateRevenueChart(type) {
    let newData, newLabels;

    switch(type) {
        case 'daily':
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [4200, 3800, 5100, 4500, 6200, 5800, 4800];
            break;
        case 'weekly':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [15800, 14200, 18600, 17200];
            break;
        case 'monthly':
            newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            newData = [32000, 28500, 36500, 29800, 41200, 38600, 45800, 39200, 47600, 43800, 51200, 48600];
            break;
    }

    window.revenueChart.data.labels = newLabels;
    window.revenueChart.data.datasets[0].data = newData;
    window.revenueChart.update();
}

function updateOrdersChart(type) {
    let newData, newLabels;

    switch(type) {
        case 'daily':
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [8, 6, 12, 9, 15, 13, 10];
            break;
        case 'weekly':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [32, 28, 41, 38];
            break;
    }

    window.ordersChart.data.labels = newLabels;
    window.ordersChart.data.datasets[0].data = newData;
    window.ordersChart.update();
}

function closeReportModalFunc() {
    document.getElementById('reportModal').classList.remove('open');
}

function generateReportFile(type, format, startDate, endDate) {
    showToast('Generating Report', `Creating ${type} report in ${format} format...`, 'info');

    setTimeout(() => {
        showToast('Report Generated', `Your ${type} report has been downloaded successfully.`, 'success');
        closeReportModalFunc();
        
        // In real application, you would generate and download the actual file
        console.log(`Generated ${type} report in ${format} format for period ${startDate} to ${endDate}`);
    }, 2000);
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

// Initialize with current month
updateDateRange('month');