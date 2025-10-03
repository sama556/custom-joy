document.addEventListener('DOMContentLoaded', function () {
    // Sign out modal
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');
    function openModal() { signOutModal.classList.add('open'); signOutModal.setAttribute('aria-hidden', 'false'); }
    function closeModal() { signOutModal.classList.remove('open'); signOutModal.setAttribute('aria-hidden', 'true'); }
    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', closeModal);
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeModal(); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => { closeModal(); showToast('Signed out', 'You have been signed out successfully.', 'success'); });

    const rangeFilter = document.getElementById('rangeFilter');
    const groupFilter = document.getElementById('groupFilter');
    const refreshBtn = document.getElementById('refreshBtn');

    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');

    let revenueChart, ordersChart, categoriesChart;

    function formatCurrency(num) { return `SAR ${num.toLocaleString('en-US')}`; }

    function generateLabels(days, group) {
        const labels = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            if (group === 'day') labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
            else if (group === 'week') labels.push(`W${getWeekNumber(d)}`);
            else labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
        return labels;
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function generateData(points, min, max) {
        const arr = [];
        for (let i = 0; i < points; i++) arr.push(Math.round(min + Math.random() * (max - min)));
        return arr;
    }

    function updateKpis(revenueData, ordersData) {
        const revenueSum = revenueData.reduce((a, b) => a + b, 0);
        const ordersSum = ordersData.reduce((a, b) => a + b, 0);
        const aov = ordersSum ? Math.round(revenueSum / ordersSum) : 0;
        const conv = Math.max(2, Math.min(9, Math.round(ordersSum / 10)));
        document.getElementById('kpiRevenue').textContent = formatCurrency(revenueSum);
        document.getElementById('kpiOrders').textContent = ordersSum.toLocaleString('en-US');
        document.getElementById('kpiAov').textContent = formatCurrency(aov);
        document.getElementById('kpiConversion').textContent = `${conv}%`;
        document.getElementById('kpiRevenueChange').innerHTML = '<i class="fas fa-arrow-up"></i> 8.3%';
        document.getElementById('kpiOrdersChange').innerHTML = '<i class="fas fa-arrow-up"></i> 5.1%';
        document.getElementById('kpiAovChange').innerHTML = '<i class="fas fa-arrow-up"></i> 3.2%';
        document.getElementById('kpiConversionChange').innerHTML = '<i class="fas fa-arrow-down"></i> 1.1%';
    }

    function buildCharts() {
        const days = parseInt(rangeFilter.value, 10);
        const group = groupFilter.value;
        const labels = generateLabels(days, group);
        const revenueData = generateData(labels.length, 500, 3000);
        const ordersData = generateData(labels.length, 10, 120);
        const categoriesData = [
            Math.round(revenueData.reduce((a, b) => a + b, 0) * 0.35),
            Math.round(revenueData.reduce((a, b) => a + b, 0) * 0.25),
            Math.round(revenueData.reduce((a, b) => a + b, 0) * 0.20),
            Math.round(revenueData.reduce((a, b) => a + b, 0) * 0.20)
        ];

        updateKpis(revenueData, ordersData);

        if (revenueChart) revenueChart.destroy();
        if (ordersChart) ordersChart.destroy();
        if (categoriesChart) categoriesChart.destroy();

        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: { labels, datasets: [{ label: 'Revenue', data: revenueData, borderColor: '#368BFF', backgroundColor: 'rgba(54,139,255,.15)', fill: true, tension: .35 }] },
            options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => `SAR ${v}` } } } }
        });

        ordersChart = new Chart(ordersCtx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Orders', data: ordersData, backgroundColor: '#FFB11B' }] },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });

        categoriesChart = new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cakes', 'Flowers', 'Balloons', 'Events'],
                datasets: [{ data: categoriesData, backgroundColor: ['#FF4FA1', '#7ED7FF', '#FFB11B', '#368BFF'] }]
            },
            options: { plugins: { legend: { position: 'bottom' } }, cutout: '60%' }
        });
    }

    if (rangeFilter) rangeFilter.addEventListener('change', buildCharts);
    if (groupFilter) groupFilter.addEventListener('change', buildCharts);
    if (refreshBtn) refreshBtn.addEventListener('click', () => { showToast('Refreshed', 'Charts updated.', 'success'); buildCharts(); });

    buildCharts();
});

function showToast(title, message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const template = document.getElementById('toast-template');
    const toast = template.content.firstElementChild.cloneNode(true);
    let iconClass = 'fas fa-info-circle';
    let iconColor = '#368BFF';
    if (type === 'success') { iconClass = 'fas fa-check-circle'; iconColor = '#2ecc71'; }
    else if (type === 'warning') { iconClass = 'fas fa-exclamation-triangle'; iconColor = '#FFB11B'; }
    else if (type === 'error') { iconClass = 'fas fa-times-circle'; iconColor = '#e74c3c'; }
    const iconWrap = toast.querySelector('.toast-icon');
    const iconEl = toast.querySelector('.toast-icon i');
    const titleEl = toast.querySelector('.toast-title');
    const msgEl = toast.querySelector('.toast-message');
    const closeBtn = toast.querySelector('.toast-close');
    iconWrap.style.backgroundColor = iconColor; iconEl.className = iconClass; titleEl.textContent = title; msgEl.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) { toast.style.animation = 'slideIn .3s ease-out reverse'; setTimeout(() => { if (toast.parentNode) toast.parentNode.remove(); }, 300); } }, 5000);
    closeBtn.addEventListener('click', () => { toast.style.animation = 'slideIn .3s ease-out reverse'; setTimeout(() => { if (toast.parentNode) toast.parentNode.remove(); }, 300); });
}


