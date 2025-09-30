// Products Page JavaScript

AOS.init({ duration: 800, once: true });

// Sample catalog (can be replaced with API later)
const CATALOG = [
    { id: 1, name: 'Royal Chocolate Cake', price: 199, category: 'cakes', rating: 4.8, reviews: 124, img: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=1229&q=80' },
    { id: 2, name: 'Vanilla Dream Cake', price: 179, category: 'cakes', rating: 4.6, reviews: 89, img: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1283&q=80' },
    { id: 3, name: 'Strawberry Delight Cake', price: 189, category: 'cakes', rating: 4.9, reviews: 156, img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1089&q=80' },
    { id: 4, name: 'Red Velvet Cake', price: 219, category: 'cakes', rating: 4.7, reviews: 98, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80' },
    { id: 5, name: 'Premium Rose Bouquet', price: 149, category: 'flowers', rating: 4.9, reviews: 203, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1170&q=80' },
    { id: 6, name: 'Mixed Flower Arrangement', price: 129, category: 'flowers', rating: 4.5, reviews: 67, img: 'https://images.unsplash.com/photo-1487070183336-b8639229991c?auto=format&fit=crop&w=1173&q=80' },
    { id: 7, name: 'Tulip Bouquet', price: 99, category: 'flowers', rating: 4.4, reviews: 45, img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80' },
    { id: 8, name: 'Sunflower Collection', price: 119, category: 'flowers', rating: 4.6, reviews: 78, img: 'https://images.unsplash.com/photo-1597848212624-e17eb5d6e0e4?auto=format&fit=crop&w=1000&q=80' },
    { id: 9, name: 'Birthday Balloon Set', price: 89, category: 'balloons', rating: 4.3, reviews: 34, img: 'https://images.unsplash.com/photo-1580516094686-3d5d45f9450c?auto=format&fit=crop&w=1170&q=80' },
    { id: 10, name: 'Heart Balloon Bouquet', price: 69, category: 'balloons', rating: 4.7, reviews: 56, img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1000&q=80' },
    { id: 11, name: 'Number Balloon Set', price: 79, category: 'balloons', rating: 4.5, reviews: 42, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' },
    { id: 12, name: 'Celebration Gift Box', price: 249, category: 'gifts', rating: 4.8, reviews: 112, img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1160&q=80' },
    { id: 13, name: 'Luxury Gift Basket', price: 299, category: 'gifts', rating: 4.9, reviews: 89, img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1000&q=80' },
    { id: 14, name: 'Chocolate Gift Set', price: 159, category: 'gifts', rating: 4.6, reviews: 73, img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=80' },
    { id: 15, name: 'Wedding Cake', price: 399, category: 'cakes', rating: 4.9, reviews: 167, img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80' },
    { id: 16, name: 'Orchid Arrangement', price: 179, category: 'flowers', rating: 4.7, reviews: 91, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80' },
    { id: 17, name: 'Confetti Balloons', price: 49, category: 'balloons', rating: 4.2, reviews: 28, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' },
    { id: 18, name: 'Premium Gift Hamper', price: 349, category: 'gifts', rating: 4.8, reviews: 134, img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1000&q=80' }
];

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
    grid.innerHTML = items.map(p => `
        <div class="col-6 col-md-4 col-lg-3 col-xl-2">
            <div class="product-card h-100" data-aos="zoom-in" onclick="viewProduct(${p.id})" style="cursor: pointer;">
                <div class="product-img">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <h6 class="product-title">${p.name}</h6>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(p.rating)}
                        </div>
                        <span class="rating-text">${p.rating} (${p.reviews})</span>
                    </div>
                    <p class="product-price">SAR ${p.price}</p>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Image fallback
    const fallbackUrl = 'https://placehold.co/600x400?text=Image+Unavailable';
    grid.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (!img.dataset.fallbackApplied) {
                img.src = fallbackUrl;
                img.dataset.fallbackApplied = 'true';
            }
        }, { once: true });
    });

    resultsCount.textContent = `${items.length} result${items.length !== 1 ? 's' : ''}`;
}

function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const activePill = document.querySelector('.filter-pill.active');
    const cat = activePill ? activePill.dataset.filter : 'all';
    const price = priceFilter.value;

    const filtered = CATALOG.filter(p => {
        const matchesText = !term || p.name.toLowerCase().includes(term);
        const matchesCat = cat === 'all' || p.category === cat;
        const matchesPrice = !price || checkPriceRange(p.price, price);
        return matchesText && matchesCat && matchesPrice;
    });

    // Show "No results" message if no products match
    if (filtered.length === 0) {
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
    } else {
        renderProducts(filtered);
    }
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

    applyFilters();
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
    const product = CATALOG.find(p => p.id === productId);
    if (product) {
        Toastify({
            text: `Added ${product.name} to cart!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #FF4FA1, #e03d8c)",
            stopOnFocus: true
        }).showToast();
    }
}

// Initial render
renderProducts(CATALOG);
// Ensure AOS animations are calculated after dynamic render
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
