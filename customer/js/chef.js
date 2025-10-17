// Chef Page JavaScript

AOS.init({ duration: 800, once: true });

// Smooth scrolling for anchor links
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

// Chef card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const chefCards = document.querySelectorAll('.chef-card');
    
    chefCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// View chef profile function
function viewChefProfile(chefId) {
    // Redirect to individual chef profile page
    window.location.href = `chef-profile.html?id=${chefId}`;
}

// Social media link handlers
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add a nice ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Show toast notification
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

// Philosophy section parallax effect
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const philosophySection = document.querySelector('.chef-philosophy');
    
    if (philosophySection) {
        const rect = philosophySection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const parallaxSpeed = 0.5;
            philosophySection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }
});

// Awards counter animation
function animateCounters() {
    const awardCards = document.querySelectorAll('.award-card');
    
    awardCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    card.style.animation = `fadeInUp 0.6s ease forwards`;
                    card.style.animationDelay = `${index * 0.1}s`;
                    
                    // Add hover effect
                    card.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-5px) scale(1.02)';
                    });
                    
                    card.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0) scale(1)';
                    });
                }
            });
        });
        
        observer.observe(card);
    });
}

// Initialize animations
animateCounters();

// Navbar scroll effect
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

// Chef specialty tags interaction
document.querySelectorAll('.specialty-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        // Add pulse effect
        this.style.animation = 'pulse 0.6s ease';
        
        // Show related products toast
        const specialty = this.textContent;
        Toastify({
            text: `Looking for ${specialty}? Check our products page!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #667eea, #764ba2)",
            stopOnFocus: true,
            onClick: function() {
                window.location.href = '../pages/products.html';
            }
        }).showToast();
        
        // Reset animation
        setTimeout(() => {
            this.style.animation = '';
        }, 600);
    });
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Philosophy items hover effect
document.querySelectorAll('.philosophy-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// CTA buttons interaction
document.querySelectorAll('.cta-section .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Add click effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Add loading animation for chef cards
document.addEventListener('DOMContentLoaded', function() {
    const chefCards = document.querySelectorAll('.chef-card');
    
    chefCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add floating animation to hero image
const heroImage = document.querySelector('.chef-hero-image img');
if (heroImage) {
    setInterval(() => {
        heroImage.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            heroImage.style.transform = 'translateY(0)';
        }, 2000);
    }, 4000);
}

// Add typing effect to hero title
const heroTitle = document.querySelector('.chef-hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

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

// Add smooth reveal animation for sections
const sections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.classList.add('reveal');
    revealObserver.observe(section);
});

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);
