// Product Details Page JavaScript

// Initialize AOS animations
AOS.init({ duration: 800, once: true });

// Image gallery functionality
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');

    // Add loading state
    mainImage.style.opacity = '0.5';

    // Create a new image to preload
    const newImage = new Image();
    newImage.onload = function () {
        mainImage.src = thumbnail.src;
        mainImage.style.opacity = '1';

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
    };

    newImage.onerror = function () {
        // If image fails to load, show error message
        console.warn('Failed to load image:', thumbnail.src);
        mainImage.style.opacity = '1';

        // Still update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
    };

    newImage.src = thumbnail.src;
}

// Add error handling for all images
document.addEventListener('DOMContentLoaded', function () {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function () {
            console.warn('Image failed to load:', this.src);
            this.classList.add('error');
            // Set a fallback image or placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
        });
    });
});

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add to cart functionality
function addToCart() {
    const quantity = document.getElementById('quantity').value;

    // Build glassmorphism content
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'stretch';
    container.style.gap = '14px';

    const title = document.createElement('div');
    title.textContent = 'Login Required';
    title.style.fontWeight = '800';
    title.style.fontSize = '16px';
    title.style.letterSpacing = '-0.2px';

    const msg = document.createElement('div');
    msg.textContent = 'Please login before adding items to your cart.';
    msg.style.opacity = '0.9';
    msg.style.fontSize = '14px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '10px';
    actions.style.marginTop = '4px';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '10px 16px';
    cancelBtn.style.borderRadius = '30px';
    cancelBtn.style.border = '1px solid rgba(255,255,255,0.35)';
    cancelBtn.style.background = 'rgba(255,255,255,0.12)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.backdropFilter = 'blur(12px)';

    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.textContent = 'Login';
    loginBtn.style.padding = '10px 18px';
    loginBtn.style.borderRadius = '30px';
    loginBtn.style.border = 'none';
    loginBtn.style.color = '#fff';
    loginBtn.style.fontWeight = '700';
    loginBtn.style.background = 'linear-gradient(135deg, var(--pink) 0%, #e03d8c 100%)';
    loginBtn.className = 'btn-register';

    actions.appendChild(cancelBtn);
    actions.appendChild(loginBtn);

    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(actions);

    const toast = Toastify({
        node: container,
        duration: -1, // stay until user acts
        close: false,
        gravity: 'center',
        position: 'center',
        stopOnFocus: true,
        style: {
            background: 'rgba(9, 21, 35, 0.55)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '20px',
            padding: '18px 20px',
            color: '#fff',
            maxWidth: '360px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999'
        }
    });

    cancelBtn.addEventListener('click', () => {
        toast.hideToast();
    });

    loginBtn.addEventListener('click', () => {
        toast.hideToast();
        // Reuse existing login toast behavior
        Toastify({
            text: '🔐 Redirecting to login page...',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'linear-gradient(135deg, #7ED7FF 0%, #368BFF 100%)',
                borderRadius: '15px',
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: '600'
            },
            stopOnFocus: true,
        }).showToast();
        // Optional redirect
        // window.location.href = '/login';
    });

    toast.showToast();
}

// Scroll to customization section
function scrollToCustomization() {
    const customizationSection = document.querySelector('.customization-section');
    if (customizationSection) {
        customizationSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Force navbar to appear dark on this page
const navbar = document.querySelector('.navbar');
if (navbar && !navbar.classList.contains('scrolled')) {
    navbar.classList.add('scrolled');
}

// Scroll to top functionality
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Related products functionality
function viewRelatedProduct(productId) {
    // For now, redirect to the product details page
    // In a real application, you would pass the product ID as a parameter
    window.location.href = 'product-details.html';
}

function addRelatedToCart(productId) {
    const productNames = {
        2: 'Vanilla Dream Cake',
        4: 'Red Velvet Cake',
        15: 'Wedding Cake'
    };

    const productName = productNames[productId] || 'Product';

    // Build glassmorphism content
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'stretch';
    container.style.gap = '14px';

    const title = document.createElement('div');
    title.textContent = 'Login Required';
    title.style.fontWeight = '800';
    title.style.fontSize = '16px';
    title.style.letterSpacing = '-0.2px';

    const msg = document.createElement('div');
    msg.textContent = 'Please login before adding items to your cart.';
    msg.style.opacity = '0.9';
    msg.style.fontSize = '14px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '10px';
    actions.style.marginTop = '4px';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '10px 16px';
    cancelBtn.style.borderRadius = '30px';
    cancelBtn.style.border = '1px solid rgba(255,255,255,0.35)';
    cancelBtn.style.background = 'rgba(255,255,255,0.12)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.backdropFilter = 'blur(12px)';

    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.textContent = 'Login';
    loginBtn.style.padding = '10px 18px';
    loginBtn.style.borderRadius = '30px';
    loginBtn.style.border = 'none';
    loginBtn.style.color = '#fff';
    loginBtn.style.fontWeight = '700';
    loginBtn.style.background = 'linear-gradient(135deg, var(--pink) 0%, #e03d8c 100%)';
    loginBtn.className = 'btn-register';

    actions.appendChild(cancelBtn);
    actions.appendChild(loginBtn);

    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(actions);

    const toast = Toastify({
        node: container,
        duration: -1, // stay until user acts
        close: false,
        gravity: 'center',
        position: 'center',
        stopOnFocus: true,
        style: {
            background: 'rgba(9, 21, 35, 0.55)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '20px',
            padding: '18px 20px',
            color: '#fff',
            maxWidth: '360px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999'
        }
    });

    cancelBtn.addEventListener('click', () => {
        toast.hideToast();
    });

    loginBtn.addEventListener('click', () => {
        toast.hideToast();
        // Reuse existing login toast behavior
        Toastify({
            text: '🔐 Redirecting to login page...',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'linear-gradient(135deg, #7ED7FF 0%, #368BFF 100%)',
                borderRadius: '15px',
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: '600'
            },
            stopOnFocus: true,
        }).showToast();
        // Optional redirect
        // window.location.href = '/login';
    });

    toast.showToast();
}

// Customization functionality
function updateCustomizationSummary() {
    const basePrice = 199;
    const sizePrice = parseInt(document.querySelector('input[name="size"]:checked').dataset.price);
    const decorationPrice = parseInt(document.querySelector('input[name="decoration"]:checked').dataset.price);

    const totalPrice = basePrice + sizePrice + decorationPrice;

    document.getElementById('basePrice').textContent = `SAR ${basePrice}`;
    document.getElementById('sizePrice').textContent = `+SAR ${sizePrice}`;
    document.getElementById('decorationPrice').textContent = `+SAR ${decorationPrice}`;
    document.getElementById('totalPrice').textContent = `SAR ${totalPrice}`;
}

function addCustomizedToCart() {
    const size = document.querySelector('input[name="size"]:checked')?.value || 'small';
    const flavor = document.querySelector('input[name="flavor"]:checked')?.value || 'chocolate';
    const decoration = document.querySelector('input[name="decoration"]:checked')?.value || 'classic';
    const specialMessage = document.getElementById('special-message')?.value || '';
    const deliveryDate = document.getElementById('delivery-date')?.value || '';
    const totalPrice = document.getElementById('totalPrice')?.textContent || 'SAR 199';

    // Increment cart badge directly
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        const current = parseInt(cartBadge.textContent || '0', 10) || 0;
        cartBadge.textContent = current + 1;
    }

    // Hide the customization modal if open
    const modalEl = document.getElementById('customizeModal');
    if (modalEl) {
        try {
            const existing = window.bootstrap ? window.bootstrap.Modal.getInstance(modalEl) : null;
            const modal = existing || (window.bootstrap ? new window.bootstrap.Modal(modalEl) : null);
            if (modal) modal.hide();
        } catch (_) { /* no-op */ }
    }

    // Show success toast summarizing customization
    const summaryParts = [
        `Size: ${size}`,
        `Flavor: ${flavor}`,
        `Decoration: ${decoration}`,
    ];
    if (specialMessage) summaryParts.push(`Message: "${specialMessage}"`);
    if (deliveryDate) summaryParts.push(`Date: ${deliveryDate}`);

    Toastify({
        text: `Added customized cake to cart (${summaryParts.join(', ')}) • ${totalPrice}`,
        duration: 3500,
        gravity: 'top',
        position: 'right',
        close: true,
        stopOnFocus: true,
        style: { background: 'linear-gradient(to right, #FF4FA1, #e03d8c)' }
    }).showToast();
}

// Initialize customization summary on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCustomizationSummary();

    // Add event listeners for customization options
    document.querySelectorAll('input[name="size"], input[name="decoration"]').forEach(input => {
        input.addEventListener('change', updateCustomizationSummary);
    });
});
