// Main JavaScript for Cybersecurity Portfolio

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypingEffect();
    initMatrixRain();
    initAnimations();
    initScrollIndicator();
    initMobileMenu();
    initTooltips();
    initContactForm();
    initParallaxEffects();
    initSkillBars();
});

// Typing Effect
function initTypingEffect() {
    const texts = [
        "Penetration Tester...",
        "Security Researcher...",
        "Python Developer...",
        "ML Engineer...",
        "Bug Bounty Hunter..."
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    const typingElement = document.getElementById('typing-text');
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    typingElement.parentNode.appendChild(cursor);

    function type() {
        if (isPaused) return;

        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        // Add random speed variation for natural feel
        typeSpeed += Math.random() * 50;

        if (!isDeleting && charIndex === currentText.length) {
            isPaused = true;
            typeSpeed = 2000; // Pause at end
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                type();
            }, typeSpeed);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect after 1 second
    setTimeout(type, 1000);
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}ソマナット";
    const matrixArray = matrix.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    const colors = ['#00ff88', '#00d4ff', '#ffffff', '#ff006e'];
    
    // Initialize drops
    for (let x = 0; x < columns; x++) {
        drops[x] = {
            y: Math.random() * -canvas.height,
            speed: 2 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            char: matrixArray[Math.floor(Math.random() * matrixArray.length)]
        };
    }

    function drawMatrix() {
        // Semi-transparent black rectangle for trailing effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];
            
            // Draw character
            ctx.fillStyle = drop.color;
            ctx.fillText(drop.char, i * fontSize, drop.y);

            // Move drop
            drop.y += drop.speed;

            // Randomly change character
            if (Math.random() > 0.97) {
                drop.char = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            }

            // Reset drop if it goes beyond canvas
            if (drop.y > canvas.height) {
                drop.y = Math.random() * -100;
                drop.speed = 2 + Math.random() * 5;
                drop.color = colors[Math.floor(Math.random() * colors.length)];
            }
        }
    }

    // Set animation interval
    const matrixInterval = setInterval(drawMatrix, 35);

    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reset drops for new width
        drops.length = 0;
        for (let x = 0; x < columns; x++) {
            drops[x] = {
                y: Math.random() * -canvas.height,
                speed: 2 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                char: matrixArray[Math.floor(Math.random() * matrixArray.length)]
            };
        }
    });

    // Cleanup on page hide
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(matrixInterval);
        }
    });
}

// Initialize Animations
function initAnimations() {
    // Animate skill bars on scroll
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
        gsap.to(bar, {
            width: bar.getAttribute('data-width'),
            duration: 2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bar.parentElement.parentElement,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animate cards on scroll
    gsap.utils.toArray('.card-hover').forEach(card => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animate section headings
    gsap.utils.toArray('section').forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            gsap.from(heading, {
                y: 30,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });

    // Floating animation for decorative elements
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(el => {
        gsap.to(el, {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // Glitch effect on hover
    document.querySelectorAll('.glitch-text').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glitch-1 0.3s linear infinite';
        });
        el.addEventListener('mouseleave', () => {
            el.style.animation = 'none';
        });
    });
}

// Scroll Indicator
function initScrollIndicator() {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
    const dots = document.querySelectorAll('.scroll-dot');

    function updateScrollIndicator() {
        let current = '';
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = section;
                }
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    }

    // Click on dots to scroll
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = document.getElementById(dot.getAttribute('data-section'));
            if (section) {
                section.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update on scroll
    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator(); // Initial call
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    }
}

// Tooltips
function initTooltips() {
    // Initialize tooltips for tool items
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = item.getAttribute('data-tool');
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#00ff88';
            tooltip.style.color = '#0a0a0f';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.fontFamily = "'JetBrains Mono', monospace";
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            const rect = item.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            
            document.body.appendChild(tooltip);
            item._tooltip = tooltip;
        });

        item.addEventListener('mouseleave', () => {
            if (item._tooltip) {
                item._tooltip.remove();
                item._tooltip = null;
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // In a real application, you would send this to your backend
            // For now, simulate API call
            await simulateAPICall(formData);
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Log to console (for demo)
            console.log('Contact form submitted:', formData);
            
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Form validation on input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form validation helper
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (fieldId === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#ff006e';
    error.style.fontSize = '12px';
    error.style.marginTop = '4px';
    error.style.fontFamily = "'JetBrains Mono', monospace";
    
    field.parentNode.appendChild(error);
    field.classList.add('error-border');
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error-border');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate API call
function simulateAPICall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.fontFamily = "'JetBrains Mono', monospace";
    notification.style.fontSize = '14px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.3s ease';
    
    if (type === 'success') {
        notification.style.background = '#00ff88';
        notification.style.color = '#0a0a0f';
        notification.style.border = '1px solid rgba(0, 255, 136, 0.3)';
    } else {
        notification.style.background = '#ff006e';
        notification.style.color = '#ffffff';
        notification.style.border = '1px solid rgba(255, 0, 110, 0.3)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .error-border {
            border-color: #ff006e !important;
        }
    `;
    document.head.appendChild(style);
}

// Parallax Effects
function initParallaxEffects() {
    // Create parallax layers
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    parallaxContainer.style.position = 'absolute';
    parallaxContainer.style.top = '0';
    parallaxContainer.style.left = '0';
    parallaxContainer.style.width = '100%';
    parallaxContainer.style.height = '100%';
    parallaxContainer.style.overflow = 'hidden';
    parallaxContainer.style.pointerEvents = 'none';
    
    // Create parallax elements
    for (let i = 0; i < 5; i++) {
        const layer = document.createElement('div');
        layer.className = 'parallax-layer';
        layer.style.position = 'absolute';
        layer.style.width = '100%';
        layer.style.height = '100%';
        layer.style.background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
            rgba(${i * 20}, 255, ${136 + i * 20}, 0.${i + 1}), transparent)`;
        layer.style.opacity = '0.1';
        layer.style.filter = 'blur(40px)';
        layer.setAttribute('data-depth', (i + 1) * 0.1);
        parallaxContainer.appendChild(layer);
    }
    
    heroSection.appendChild(parallaxContainer);
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const layers = document.querySelectorAll('.parallax-layer');
        
        layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth'));
            const yPos = -(scrolled * depth);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Skill Bars with Intersection Observer
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL hash
            history.pushState(null, null, href);
        }
    });
});

// Active navigation state
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', function() {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
    let current = '';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-cyber-primary', 'border-cyber-primary');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-cyber-primary');
        }
    });
});

// Particle System for Hero Section
function createParticleSystem() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '1';
    
    heroSection.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const colors = ['#00ff88', '#00d4ff', '#ff006e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply styles
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.opacity = '0.3';
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    // Animation
    particle.style.animation = `
        float ${duration}s ease-in-out ${delay}s infinite,
        pulse ${duration / 2}s ease-in-out infinite alternate
    `;
    
    container.appendChild(particle);
    
    // Clean up particles that go out of bounds
    setTimeout(() => {
        if (particle.parentNode === container) {
            particle.remove();
            createParticle(container);
        }
    }, duration * 1000);
}

// Initialize particle system after DOM load
setTimeout(createParticleSystem, 1000);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const menuBtn = document.getElementById('mobile-menu-btn');
            if (menuBtn) {
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    }
    
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement search functionality here
        console.log('Search triggered');
    }
    
    // Arrow keys for navigation (when focused)
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
        }
    }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        }
    });
    
    observer.observe({ entryTypes: ['longtask', 'measure', 'navigation'] });
}

// Lazy loading for images (if added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Initialize everything when window loads
window.addEventListener('load', function() {
    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any remaining components
    console.log('Portfolio loaded successfully!');
    
    // Check for service worker support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
});