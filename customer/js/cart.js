// Cart page interactions and mock data (front-end only)

AOS.init({ duration: 800, once: true });

// Mock: load from localStorage (if you later implement add-to-cart, persist there)
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

function renderCart() {
    const items = loadCart();
    const emptyEl = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');
    const listEl = document.getElementById('cartItems');
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
    items.forEach((item, index) => {
        const line = document.createElement('div');
        line.className = 'cart-item';
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;

        line.innerHTML = `
            <div class="cart-thumb">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-info">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="cart-title">${item.title}</div>
                        <div class="text-muted small">${item.variant || ''}</div>
                    </div>
                    <button class="btn btn-link p-0 remove-item" data-index="${index}"><i class="fa fa-trash"></i></button>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="qty-control" data-index="${index}">
                        <button class="btn-qty" data-delta="-1" aria-label="Decrease">-</button>
                        <span class="qty">${item.qty}</span>
                        <button class="btn-qty" data-delta="1" aria-label="Increase">+</button>
                    </div>
                    <div class="price">${formatSar(lineTotal)}</div>
                </div>
            </div>
        `;

        listEl.appendChild(line);
    });

    const delivery = items.length ? 15 : 0;
    subtotalEl.textContent = formatSar(subtotal);
    deliveryEl.textContent = formatSar(delivery);
    totalEl.textContent = formatSar(subtotal + delivery);
    updateBadge(items.reduce((sum, i) => sum + i.qty, 0));
}

function updateBadge(count) {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

document.addEventListener('click', function (e) {
    // Remove item
    if (e.target.closest && e.target.closest('.remove-item')) {
        const index = parseInt(e.target.closest('.remove-item').dataset.index);
        const items = loadCart();
        items.splice(index, 1);
        saveCart(items);
        renderCart();
        return;
    }

    // Quantity change
    if (e.target.closest && e.target.closest('.qty-control') && e.target.classList.contains('btn-qty')) {
        const control = e.target.closest('.qty-control');
        const index = parseInt(control.dataset.index);
        const delta = parseInt(e.target.dataset.delta);
        const items = loadCart();
        const nextQty = Math.min(99, Math.max(1, (items[index]?.qty || 1) + delta));
        items[index].qty = nextQty;
        saveCart(items);
        renderCart();
        return;
    }
});

document.getElementById('checkoutBtn')?.addEventListener('click', function () {
    const items = loadCart();
    if (!items.length) return;
    window.location.href = 'checkout.html';
});

// Demo: seed some sample items on first visit if cart empty
(function seedDemo() {
    const items = loadCart();
    if (items.length) return renderCart();
    const demo = [
        { title: 'Royal Chocolate Cake', price: 199, qty: 1, image: '../images/ceek2.jpg', variant: '1kg' },
        { title: 'Premium Rose Bouquet', price: 149, qty: 2, image: '../images/flower2.jpg', variant: 'Red' }
    ];
    saveCart(demo);
    renderCart();
})();

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('active'); } else { scrollTopBtn.classList.remove('active'); }
});
scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });


