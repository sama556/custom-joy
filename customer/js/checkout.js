// Checkout page logic (front-end only)

AOS.init({ duration: 800, once: true });

// Navbar scroll behavior (match home)
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function loadCart() {
    try {
        const raw = localStorage.getItem('cj_cart');
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem('cj_cart', JSON.stringify(items));
}

function formatSar(amount) {
    return `SAR ${amount}`;
}

function updateBadge(count) {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

function renderSummary() {
    const items = loadCart();
    const emptyEl = document.getElementById('checkoutEmpty');
    const contentEl = document.getElementById('checkoutContent');
    const listEl = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryEl = document.getElementById('delivery');
    const totalEl = document.getElementById('total');

    if (!items.length) {
        emptyEl.style.display = 'block';
        contentEl.style.display = 'none';
        updateBadge(0);
        return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = 'flex';
    listEl.innerHTML = '';

    let subtotal = 0;
    items.forEach((item) => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;
        const line = document.createElement('div');
        line.className = 'd-flex align-items-center justify-content-between mb-2';
        line.innerHTML = `
			<div class="d-flex align-items-center" style="gap:10px">
				<img src="${item.image}" alt="${item.title}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #eee;">
				<div>
					<div class="fw-semibold">${item.title}</div>
					<div class="text-muted small">${item.variant || ''} x ${item.qty}</div>
				</div>
			</div>
			<div class="fw-semibold">${formatSar(lineTotal)}</div>
		`;
        listEl.appendChild(line);
    });

    // Calculate delivery cost based on selected option
    const selectedDelivery = document.querySelector('input[name="deliveryOption"]:checked');
    const delivery = selectedDelivery && selectedDelivery.value === 'fast' ? 50 : (items.length ? 15 : 0);
    
    subtotalEl.textContent = formatSar(subtotal);
    deliveryEl.textContent = formatSar(delivery);
    totalEl.textContent = formatSar(subtotal + delivery);
    updateBadge(items.reduce((sum, i) => sum + i.qty, 0));
}

function initPaymentSelection() {
    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardFields = document.getElementById('cardFields');
    radios.forEach(r => {
        r.addEventListener('change', () => {
            cardFields.style.display = (r.value === 'card' && r.checked) ? 'grid' : 'none';
        });
    });
    // initialize visibility
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    cardFields.style.display = selected && selected.value === 'card' ? 'grid' : 'none';
}

// Shipping validation removed - no longer needed

function validateCardIfNeeded() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selected || selected.value !== 'card') return true;
    const number = document.getElementById('cardNumber');
    const expiry = document.getElementById('cardExpiry');
    const cvc = document.getElementById('cardCvc');
    if (!/\d{12,19}/.test(number.value.replace(/\s+/g, ''))) return number.focus(), false;
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry.value.trim())) return expiry.focus(), false;
    if (!/^\d{3,4}$/.test(cvc.value.trim())) return cvc.focus(), false;
    return true;
}

function loadOrders() {
    try { return JSON.parse(localStorage.getItem('cj_orders') || '[]'); } catch { return []; }
}

function saveOrders(list) {
    localStorage.setItem('cj_orders', JSON.stringify(list));
}

document.getElementById('payNowBtn')?.addEventListener('click', function () {
    const items = loadCart();
    if (!items.length) return;
    if (!validateCardIfNeeded()) return;

    // compute totals
    const subtotal = items.reduce((s, it) => s + (it.price * it.qty), 0);
    const selectedDelivery = document.querySelector('input[name="deliveryOption"]:checked');
    const deliveryFee = selectedDelivery && selectedDelivery.value === 'fast' ? 50 : (items.length ? 15 : 0);
    const total = subtotal + deliveryFee;

    // capture delivery option
    const deliveryOption = selectedDelivery ? selectedDelivery.value : 'standard';

    const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
    const status = method === 'cod' ? 'unpaid' : 'paid';
    const now = new Date();
    const id = Math.floor(now.getTime() / 1000); // simple timestamp id
    const order = {
        id,
        userId: 501,
        date: now.toISOString().slice(0, 10),
        subtotal,
        deliveryFee,
        total,
        status,
        addressId: null,
        deliveryOption,
        initialReview: { state: 'accepted', reason: '' },
        type: 'products',
        notes: '',
        deliveryDate: '',
        images: items.slice(0, 3).map(i => i.image).filter(Boolean),
        description: '',
        paymentMethod: method,
        items: items.map(it => ({
            orderId: id,
            category: 'products',
            productId: it.id || 0,
            addonCategory: null,
            addonId: null,
            qty: it.qty,
            price: it.price,
            notes: it.variant || ''
        }))
    };

    const existing = loadOrders();
    existing.unshift(order);
    saveOrders(existing);

    Toastify({
        text: status === 'unpaid' ? '🧾 Order placed. Pay on delivery.' : '✅ Payment successful! Order confirmed.',
        duration: 2500,
        gravity: 'top',
        position: 'right',
        style: { background: 'linear-gradient(135deg, #7ED7FF, #368BFF)' }
    }).showToast();

    setTimeout(() => {
        saveCart([]);
        window.location.href = 'orders.html';
    }, 1000);
});

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('active'); } else { scrollTopBtn.classList.remove('active'); }
});
scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// Logout functionality (match home page)
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            Toastify({
                text: 'Logged out',
                duration: 2500,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'linear-gradient(135deg, #7a7a7a, #4a4a4a)'
            }).showToast();
            setTimeout(() => window.location.reload(), 600);
        });
    }
});

// Add delivery option change listener
function initDeliveryOptions() {
    const deliveryRadios = document.querySelectorAll('input[name="deliveryOption"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', renderSummary);
    });
}

// Kickoff
renderSummary();
initPaymentSelection();
initDeliveryOptions();


