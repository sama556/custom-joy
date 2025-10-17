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
    // Get values from the new admin-style form
    const sizeSelect = document.getElementById('size');
    const layersSelect = document.getElementById('layers');

    const sizePrice = sizeSelect ? parseInt(sizeSelect.selectedOptions[0]?.dataset.price || '0', 10) : 0;
    const layersPrice = layersSelect ? parseInt(layersSelect.selectedOptions[0]?.dataset.price || '0', 10) : 0;

    // Calculate decorations price using vanilla JavaScript
    let decorationsPrice = 0;
    const decorationsSelect = document.getElementById('decorations');
    if (decorationsSelect) {
        const selectedDecorations = Array.from(decorationsSelect.selectedOptions);
        selectedDecorations.forEach(option => {
            decorationsPrice += parseInt(option.dataset.price || '0', 10);
        });
    }

    const basePrice = 199;
    const totalPrice = basePrice + sizePrice + layersPrice + decorationsPrice;

    document.getElementById('basePrice').textContent = `SAR ${basePrice}`;
    document.getElementById('sizePrice').textContent = `+SAR ${sizePrice}`;
    document.getElementById('layersPrice').textContent = `+SAR ${layersPrice}`;
    document.getElementById('decorationsPrice').textContent = `+SAR ${decorationsPrice}`;
    document.getElementById('totalPrice').textContent = `SAR ${totalPrice}`;
}

function addCustomizedToCart() {
    // Get all form values from the new admin-style form
    const flavor = document.getElementById('flavor')?.value || 'chocolate';

    // Get multiselect values using vanilla JavaScript
    const fillings = Array.from(document.getElementById('fillings')?.selectedOptions || []).map(option => option.value);
    const frosting = Array.from(document.getElementById('frosting')?.selectedOptions || []).map(option => option.value);
    const colors = Array.from(document.getElementById('colors')?.selectedOptions || []).map(option => option.value);
    const decorations = Array.from(document.getElementById('decorations')?.selectedOptions || []).map(option => option.value);

    const shape = document.getElementById('shape')?.value || 'round';
    const size = document.getElementById('size')?.value || '6';
    const layers = document.getElementById('layers')?.value || '1';
    const specialMessage = document.getElementById('special-message')?.value || '';
    const allergies = document.getElementById('allergies')?.value || '';
    const deliveryDate = document.getElementById('delivery-date')?.value || '';
    const deliveryTime = document.getElementById('delivery-time')?.value || '';
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
        `Flavor: ${flavor.charAt(0).toUpperCase() + flavor.slice(1).replace('_', ' ')}`,
        `Shape: ${shape.charAt(0).toUpperCase() + shape.slice(1)}`,
        `Size: ${size}"`,
        `Layers: ${layers}`
    ];

    if (fillings.length) summaryParts.push(`Fillings: ${fillings.join(', ').replace(/_/g, ' ')}`);
    if (frosting.length) summaryParts.push(`Frosting: ${frosting.join(', ').replace(/_/g, ' ')}`);
    if (colors.length) summaryParts.push(`Colors: ${colors.join(', ')}`);
    if (decorations.length) summaryParts.push(`Decorations: ${decorations.join(', ').replace(/_/g, ' ')}`);
    if (specialMessage) summaryParts.push(`Message: "${specialMessage}"`);
    if (allergies) summaryParts.push(`Allergies: ${allergies}`);
    if (deliveryDate) summaryParts.push(`Delivery: ${deliveryDate}`);
    if (deliveryTime) summaryParts.push(`Time: ${deliveryTime}`);

    Toastify({
        text: `Added customized cake to cart!\n${summaryParts.join('\n')}\n\nTotal: ${totalPrice}`,
        duration: 5000,
        gravity: 'top',
        position: 'right',
        close: true,
        stopOnFocus: true,
        style: {
            background: 'linear-gradient(to right, #FF4FA1, #e03d8c)',
            whiteSpace: 'pre-line'
        }
    }).showToast();
}

// Initialize customization summary on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCustomizationSummary();

    // Initialize Select2 for multiselect fields using vanilla JavaScript
    initializeSelect2();

    // Add event listeners for regular select fields
    const sizeSelect = document.getElementById('size');
    const layersSelect = document.getElementById('layers');

    if (sizeSelect) sizeSelect.addEventListener('change', updateCustomizationSummary);
    if (layersSelect) layersSelect.addEventListener('change', updateCustomizationSummary);
});

// Custom multiselect implementation without jQuery
function initializeSelect2() {
    const selectElements = document.querySelectorAll('.select2-multiple:not([data-customized])');

    selectElements.forEach(select => {
        createCustomMultiselect(select);
        // Mark as customized to prevent re-initialization
        select.setAttribute('data-customized', 'true');
    });

    if (selectElements.length > 0) {
        console.log('Custom multiselect initialized for', selectElements.length, 'elements');
    }
}

function createCustomMultiselect(selectElement) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-multiselect-wrapper';

    // Create display area for chips
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'custom-multiselect-chips';

    // Create dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.type = 'button';
    dropdownButton.className = 'custom-multiselect-button';
    dropdownButton.innerHTML = 'Select options... <i class="fas fa-chevron-down"></i>';

    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'custom-multiselect-dropdown';

    // Populate dropdown with options
    Array.from(selectElement.options).forEach(option => {
        if (option.value) {
            const menuItem = document.createElement('div');
            menuItem.className = 'custom-multiselect-option';
            menuItem.dataset.value = option.value;
            menuItem.innerHTML = `
                <input type="checkbox" id="${selectElement.id}_${option.value}" value="${option.value}">
                <label for="${selectElement.id}_${option.value}">${option.textContent}</label>
            `;
            dropdownMenu.appendChild(menuItem);
        }
    });

    // Assemble wrapper
    wrapper.appendChild(chipsContainer);
    wrapper.appendChild(dropdownButton);
    wrapper.appendChild(dropdownMenu);

    // Hide original select but keep it for form submission
    selectElement.style.display = 'none';
    selectElement.parentNode.insertBefore(wrapper, selectElement);

    // Add event listeners
    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
        dropdownButton.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            dropdownButton.classList.remove('active');
        }
    });

    // Handle option selection
    dropdownMenu.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            // Update the hidden select element
            const option = selectElement.querySelector(`option[value="${e.target.value}"]`);
            if (option) {
                option.selected = e.target.checked;
            }
            updateChips(selectElement, chipsContainer);
            updateCustomizationSummary();
        }
    });

    // Initialize chips
    updateChips(selectElement, chipsContainer);
}


function updateChips(selectElement, chipsContainer) {
    chipsContainer.innerHTML = '';

    // Get selected options
    const selectedOptions = Array.from(selectElement.selectedOptions);

    selectedOptions.forEach(option => {
        const chip = document.createElement('span');
        chip.className = 'custom-multiselect-chip';
        chip.innerHTML = `
            ${option.textContent}
            <button type="button" class="chip-remove" data-value="${option.value}">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add remove functionality
        chip.querySelector('.chip-remove').addEventListener('click', () => {
            option.selected = false;
            // Also uncheck the corresponding checkbox
            const checkbox = document.querySelector(`input[value="${option.value}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
            updateChips(selectElement, chipsContainer);
            updateCustomizationSummary();
        });

        chipsContainer.appendChild(chip);
    });
}

// Re-initialize Select2 when modal is shown (only if not already initialized)
document.addEventListener('shown.bs.modal', function (event) {
    if (event.target.id === 'customizeModal') {
        // Only initialize if there are uninitialized elements
        const uninitializedElements = document.querySelectorAll('.select2-multiple:not([data-customized])');
        if (uninitializedElements.length > 0) {
            setTimeout(() => {
                initializeSelect2();
            }, 100);
        }
    }
});
