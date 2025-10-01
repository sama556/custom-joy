// Static Chef Profile Page JavaScript

AOS.init({ duration: 800, once: true });

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #FF4FA1, #667eea);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Add navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add social media link handlers
    document.querySelectorAll('.social-link-large').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            Toastify({
                text: "Chef's social media coming soon!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF4FA1, #e03d8c)",
                stopOnFocus: true
            }).showToast();
        });
    });
    
    // Add consultation booking handler
    const consultationBtn = document.querySelector('.btn-hero');
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            Toastify({
                text: "Consultation booking feature coming soon!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
                stopOnFocus: true
            }).showToast();
        });
    }

    // Reviews filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter review cards
            reviewCards.forEach(card => {
                const rating = card.getAttribute('data-rating');
                
                if (filter === 'all' || rating === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'slideInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Review actions functionality
    const writeReviewBtn = document.querySelector('.reviews-actions .btn-outline-primary');
    const viewAllReviewsBtn = document.querySelector('.reviews-actions .btn-primary');
    
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            Toastify({
                text: "Review submission feature coming soon!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF4FA1, #e03d8c)",
                stopOnFocus: true
            }).showToast();
        });
    }
    
    if (viewAllReviewsBtn) {
        viewAllReviewsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            Toastify({
                text: "Loading all reviews...",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
                stopOnFocus: true
            }).showToast();
        });
    }

    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
});

// Product interaction functions
function viewProduct(productId) {
    // Redirect to product details page
    window.location.href = `../pages/product-details.html?id=${productId}`;
}

function addToCart(productId) {
    // Show toast notification for add to cart
    Toastify({
        text: `Product ${productId} added to cart!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #28a745, #20c997)",
        stopOnFocus: true
    }).showToast();
    
    // Here you would typically add the product to a cart array or send to backend
    console.log(`Added product ${productId} to cart`);
}

// Add CSS for scroll to top button
const scrollTopStyle = document.createElement('style');
scrollTopStyle.textContent = `
    .scroll-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #FF4FA1, #667eea);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .scroll-top.active {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-top:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(scrollTopStyle);
