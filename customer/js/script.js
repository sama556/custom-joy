
// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        },
    },
});

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission with toast notification
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    Toastify({
        text: "✨ Thank you! Your message has been sent successfully.",
        duration: 5000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(135deg, #FF4FA1 0%, #e03d8c 100%)",
            borderRadius: "15px",
            padding: "15px 25px",
            fontSize: "16px",
            fontWeight: "600"
        },
        stopOnFocus: true,
    }).showToast();

    this.reset();
});

// Login button handler (guard: may not exist on auth pages)
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        // Prefer redirect to dedicated page
        window.location.href = 'auth/login.html';
    });
}

// Register button handler (guard)
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', function () {
        window.location.href = 'auth/register.html';
    });
}

// Register form logic now lives on register.html only

// Open Forgot Password from Login modal
const openForgot = document.getElementById('openForgot');
if (openForgot) {
    openForgot.addEventListener('click', function () {
        const loginEl = document.getElementById('loginModal');
        const forgotEl = document.getElementById('forgotModal');
        if (loginEl && forgotEl) {
            const loginInstance = bootstrap.Modal.getInstance(loginEl) || new bootstrap.Modal(loginEl);
            loginInstance.hide();
            const forgotInstance = new bootstrap.Modal(forgotEl);
            forgotInstance.show();
        }
    });
}

// Login form validation and success toast
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const emailValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value);
        const passwordValid = password.value.length >= 6;
        if (!emailValid) { email.focus(); return; }
        if (!passwordValid) { password.focus(); return; }

        Toastify({
            text: "✅ Logged in successfully!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(135deg, #7ED7FF 0%, #368BFF 100%)",
                borderRadius: "15px",
                padding: "12px 20px",
                fontSize: "15px",
                fontWeight: "700"
            },
            stopOnFocus: true,
        }).showToast();

        const modalEl = document.getElementById('loginModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
        loginForm.reset();
    });
}

// Forgot password form validation and success toast
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
    forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail');
        const emailValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value);
        if (!emailValid) { email.focus(); return; }

        Toastify({
            text: "📧 Password reset link sent to your email.",
            duration: 3500,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(135deg, #FFB11B 0%, #FF8C00 100%)",
                borderRadius: "15px",
                padding: "12px 20px",
                fontSize: "15px",
                fontWeight: "700"
            },
            stopOnFocus: true,
        }).showToast();

        const modalEl = document.getElementById('forgotModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
        forgotForm.reset();
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') { return; }
        const target = document.querySelector(href);
        if (!target) { return; }
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Image fallback for broken URLs in services/products
document.addEventListener('DOMContentLoaded', function () {
    const fallbackUrl = 'https://placehold.co/600x400?text=Image+Unavailable';
    const imgs = document.querySelectorAll('.service-image img, .product-img img');
    imgs.forEach(img => {
        img.addEventListener('error', function onError() {
            if (!img.dataset.fallbackApplied) {
                img.src = fallbackUrl;
                img.dataset.fallbackApplied = 'true';
            }
        }, { once: true });
    });
});

// Add to cart functionality
document.querySelectorAll('.btn-action').forEach(button => {
    button.addEventListener('click', function () {
        if (this.querySelector('.fa-shopping-cart')) {
            Toastify({
                text: "🛒 Product added to cart!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(135deg, #FFB11B 0%, #FF8C00 100%)",
                    borderRadius: "15px",
                    padding: "12px 20px",
                    fontSize: "15px",
                    fontWeight: "600"
                },
                stopOnFocus: true,
            }).showToast();
        }
    });
});

// Add to Cart buttons -> require login (Toastify glass popup)
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
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
            gravity: 'top',
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
                maxWidth: '360px'
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
    });
});
