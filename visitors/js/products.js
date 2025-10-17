// Products Page JavaScript

AOS.init({ duration: 800, once: true });

// Static product data is now in HTML - no need for CATALOG array

const grid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const priceFilter = document.getElementById('priceFilter');
const resultsCount = document.getElementById('resultsCount');
const clearFilters = document.getElementById('clearFilters');
const clearSearch = document.getElementById('clearSearch');
const filterPills = document.querySelectorAll('.filter-pill');

// Function to generate star ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function renderProducts(items) {
    // Get all product cards
    const allCards = grid.querySelectorAll('.product-card');
    
    // Hide all cards first
    allCards.forEach(card => {
        card.closest('.col-6').style.display = 'none';
    });

    // Show only matching cards
    let visibleCount = 0;
    allCards.forEach(card => {
        const productName = card.querySelector('.product-title').textContent.toLowerCase();
        const productCategory = card.dataset.category;
        const productPrice = parseInt(card.querySelector('.product-price').textContent.replace('SAR ', ''));
        
        const term = searchInput.value.trim().toLowerCase();
        const activePill = document.querySelector('.filter-pill.active');
        const cat = activePill ? activePill.dataset.filter : 'all';
        const price = priceFilter.value;

        const matchesText = !term || productName.includes(term);
        const matchesCat = cat === 'all' || productCategory === cat;
        const matchesPrice = !price || checkPriceRange(productPrice, price);

        if (matchesText && matchesCat && matchesPrice) {
            card.closest('.col-6').style.display = 'block';
            visibleCount++;
        }
    });

    // Show "No results" message if no products match
    if (visibleCount === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="card border-0 shadow-sm" style="background: rgba(255, 255, 255, 0.8);">
                    <div class="card-body py-5">
                        <i class="fas fa-search" style="font-size: 3rem; color: #FF4FA1; margin-bottom: 1rem;"></i>
                        <h4 class="text-muted">No products found</h4>
                        <p class="text-muted">Try adjusting your search or filter criteria</p>
                        <button class="btn btn-hero btn-sm" onclick="clearAllFilters()">
                            <i class="fa fa-times me-1"></i> Clear All Filters
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    resultsCount.textContent = `${visibleCount} result${visibleCount !== 1 ? 's' : ''}`;
}

function applyFilters() {
    renderProducts();
    AOS.refreshHard();
}

function clearAllFilters() {
    searchInput.value = '';
    priceFilter.value = '';

    // Reset filter pills
    filterPills.forEach(pill => pill.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');

    // Hide clear search button
    clearSearch.style.display = 'none';

    // Show all product cards
    const allCards = grid.querySelectorAll('.product-card');
    allCards.forEach(card => {
        card.closest('.col-6').style.display = 'block';
    });

    resultsCount.textContent = `${allCards.length} result${allCards.length !== 1 ? 's' : ''}`;
}

function checkPriceRange(price, range) {
    switch (range) {
        case '0-100': return price < 100;
        case '100-200': return price >= 100 && price < 200;
        case '200-300': return price >= 200 && price < 300;
        case '300+': return price >= 300;
        default: return true;
    }
}

// Debounced search for better performance
let searchTimeout;
searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);

    // Show/hide clear search button
    if (this.value.trim()) {
        clearSearch.style.display = 'block';
    } else {
        clearSearch.style.display = 'none';
    }
});

// Clear search functionality
clearSearch.addEventListener('click', function () {
    searchInput.value = '';
    this.style.display = 'none';
    applyFilters();
});

// Filter pills functionality
filterPills.forEach(pill => {
    pill.addEventListener('click', function () {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        applyFilters();
    });
});

priceFilter.addEventListener('change', applyFilters);

// Clear filters functionality
clearFilters.addEventListener('click', clearAllFilters);

// Product navigation and cart functions
function viewProduct(productId) {
    // For now, redirect to the product details page
    // In a real application, you would pass the product ID as a parameter
    window.location.href = 'product-details.html';
}

function addToCart(productId) {
    // Require login before adding to cart (popup with Login button)
    const productCard = document.querySelector(`[onclick*="viewProduct(${productId})"]`);
    const productName = productCard ? productCard.querySelector('.product-title').textContent : 'Product';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';

    const title = document.createElement('div');
    title.textContent = 'Login Required';
    title.style.fontWeight = '800';
    title.style.fontSize = '16px';

    const msg = document.createElement('div');
    msg.textContent = `Please login before adding "${productName}" to your cart.`;
    msg.style.opacity = '0.9';
    msg.style.fontSize = '14px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '10px';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '8px 14px';
    cancelBtn.style.borderRadius = '24px';
    cancelBtn.style.border = '1px solid rgba(255,255,255,0.35)';
    cancelBtn.style.background = 'rgba(255,255,255,0.12)';
    cancelBtn.style.color = '#fff';

    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.textContent = 'Login';
    loginBtn.style.padding = '8px 16px';
    loginBtn.style.borderRadius = '24px';
    loginBtn.style.border = 'none';
    loginBtn.style.color = '#fff';
    loginBtn.style.fontWeight = '700';
    loginBtn.style.background = 'linear-gradient(135deg, var(--pink) 0%, #e03d8c 100%)';

    actions.appendChild(cancelBtn);
    actions.appendChild(loginBtn);
    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(actions);

    const toast = Toastify({
        node: container,
        duration: -1,
        gravity: 'top',
        position: 'center',
        stopOnFocus: true,
        style: {
            background: 'rgba(9, 21, 35, 0.55)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '18px',
            padding: '16px 18px',
            color: '#fff',
            maxWidth: '360px'
        }
    });

    cancelBtn.addEventListener('click', () => toast.hideToast());
    loginBtn.addEventListener('click', () => {
        toast.hideToast();
        window.location.href = '../auth/login.html';
    });

    toast.showToast();
}

// Initial setup - show all products
const allCards = grid.querySelectorAll('.product-card');
resultsCount.textContent = `${allCards.length} result${allCards.length !== 1 ? 's' : ''}`;

// Ensure AOS animations are calculated
setTimeout(() => { try { AOS.refreshHard(); } catch (e) { } }, 0);

// Force navbar to appear dark on this page (no hero overlap here)
const navbar = document.querySelector('.navbar');
if (navbar && !navbar.classList.contains('scrolled')) {
    navbar.classList.add('scrolled');
}

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('active'); } else { scrollTopBtn.classList.remove('active'); }
});
scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
