// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const profileBtn = document.querySelector('.profile-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const loginItem = document.querySelector('.login-item');
const loginModal = document.getElementById('loginModal');
const modalClose = document.querySelector('.modal-close');
const loginForm = document.getElementById('loginForm');
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
const tiltCards = document.querySelectorAll('.tilt-card');
const rippleButtons = document.querySelectorAll('.ripple');
const statNumbers = document.querySelectorAll('.stat-number');

// User state
let currentUser = {
    isLoggedIn: false,
    name: 'Guest User',
            email: 'guest@uniclubs.edu'
};

// Navigation functionality
function showSection(targetSection) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const target = document.getElementById(targetSection);
    if (target) {
        target.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === targetSection) {
            link.classList.add('active');
        }
    });
    
    // Close dropdown if open
    dropdownMenu.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger scroll animations for newly visible section
    setTimeout(() => {
        revealElements();
        if (targetSection === 'home') {
            animateStats();
        }
    }, 100);
}

// Add click events to nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) {
            showSection(section);
        }
    });
});

// Add click events to hero buttons
heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const section = button.dataset.section;
        if (section) {
            showSection(section);
        }
    });
});

// Profile dropdown functionality
profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

// Add click events to dropdown items
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        if (section) {
            showSection(section);
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Login/Logout functionality
loginItem.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser.isLoggedIn) {
        // Logout
        currentUser.isLoggedIn = false;
        currentUser.name = 'Guest User';
        currentUser.email = 'guest@uniclubs.edu';
        updateUserInterface();
        showNotification('Logged out successfully!', 'success');
    } else {
        // Show login modal
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    dropdownMenu.classList.remove('active');
});

// Modal functionality
modalClose.addEventListener('click', () => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Form validation and submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate login process
    const submitBtn = loginForm.querySelector('.btn-login');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Update user state
        currentUser.isLoggedIn = true;
        currentUser.name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        currentUser.email = email;
        
        updateUserInterface();
        
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        loginForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showNotification(`Welcome back, ${currentUser.name}!`, 'success');
    }, 1500);
});

// Update user interface based on login state
function updateUserInterface() {
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const loginText = document.querySelector('.login-text');
    
    if (userName) userName.textContent = currentUser.name;
    if (userEmail) userEmail.textContent = currentUser.email;
    if (loginText) {
        loginText.textContent = currentUser.isLoggedIn ? 'Logout' : 'Login';
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced 3D Tilt Effect
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
        card.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(0, 0, 0, 0.2)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.boxShadow = '';
    });
});

// Enhanced Ripple Effect
rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// CSS for enhanced ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: rgba(5, 150, 105, 0.9);
    }
    
    .notification.error {
        background: rgba(239, 68, 68, 0.9);
    }
`;
document.head.appendChild(style);

// Animated Statistics Counter
function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Enhanced scroll animations with stagger effect
function revealElements() {
    const reveals = document.querySelectorAll('.club-card, .event-card, .stat-card, .feature-card');
    
    reveals.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            setTimeout(() => {
                element.classList.add('scroll-reveal', 'revealed');
            }, index * 150);
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.club-card, .event-card, .stat-card, .feature-card');
    scrollElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
    
    // Animate stats on home page load
    animateStats();
});

// Enhanced parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    const floatElements = document.querySelectorAll('.float-element');
    
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        const rotate = scrolled * 0.02;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${rotate}deg) translateZ(${Math.sin(scrolled * 0.01) * 10}px)`;
    });
    
    floatElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.05);
        const rotate = scrolled * 0.01;
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${rotate}deg)`;
    });
});

// Enhanced mouse tracking for 3D effects
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;
    
    // Update background elements based on mouse position
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.02 + (index * 0.01);
        const x = (mouseX - 50) * speed;
        const y = (mouseY - 50) * speed;
        shape.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Club join functionality
const joinButtons = document.querySelectorAll('.btn-join');
joinButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!currentUser.isLoggedIn) {
            showNotification('Please login to join clubs', 'error');
            return;
        }
        
        const clubCard = e.target.closest('.club-card');
        const clubName = clubCard.querySelector('h3').textContent;
        
        // Simulate joining process
        const originalText = button.textContent;
        button.textContent = 'Joining...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Joined!';
            button.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            
            setTimeout(() => {
                showNotification(`Successfully joined ${clubName}!`, 'success');
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 1000);
        }, 1000);
    });
});

// RSVP functionality
const rsvpButtons = document.querySelectorAll('.btn-rsvp');
rsvpButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!currentUser.isLoggedIn) {
            showNotification('Please login to RSVP for events', 'error');
            return;
        }
        
        const eventCard = e.target.closest('.event-card');
        const eventName = eventCard.querySelector('h3').textContent;
        
        // Simulate RSVP process
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'RSVP\'d!';
            button.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            
            setTimeout(() => {
                showNotification(`RSVP confirmed for ${eventName}!`, 'success');
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 1000);
        }, 1000);
    });
});

// Attendance marking functionality
const attendanceButton = document.querySelector('.btn-attendance');
if (attendanceButton) {
    attendanceButton.addEventListener('click', () => {
        if (!currentUser.isLoggedIn) {
            showNotification('Please login to mark attendance', 'error');
            return;
        }
        
        const originalText = attendanceButton.textContent;
        const statusText = document.querySelector('.status-text');
        
        attendanceButton.textContent = 'Marking...';
        attendanceButton.disabled = true;
        
        setTimeout(() => {
            attendanceButton.textContent = 'Attendance Marked!';
            attendanceButton.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            statusText.textContent = `Marked at ${new Date().toLocaleTimeString()}`;
            statusText.style.color = '#059669';
            
            setTimeout(() => {
                showNotification('Attendance marked successfully!', 'success');
                attendanceButton.textContent = originalText;
                attendanceButton.disabled = false;
                attendanceButton.style.background = '';
            }, 1500);
        }, 1000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Settings toggle functionality
const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const settingName = e.target.id.replace(/([A-Z])/g, ' $1').toLowerCase();
        const status = e.target.checked ? 'enabled' : 'disabled';
        showNotification(`${settingName} ${status}`, 'success');
    });
});

// Initialize on page load
window.addEventListener('load', () => {
    revealElements();
    animateStats();
    updateUserInterface();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reset any transforms that might be affected by resize
    tiltCards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.boxShadow = '';
    });
});

// Smooth cursor following enhancement
let mouseTrail = [];
document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    // Keep only recent trail points
    mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
    
    // Update cursor effect
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const cursorElement = document.createElement('div');
        cursorElement.classList.add('custom-cursor');
        cursorElement.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, rgba(220, 38, 38, 0.4), rgba(220, 38, 38, 0.1), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: multiply;
        `;
        document.body.appendChild(cursorElement);
    }
    
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        customCursor.style.left = e.clientX - 15 + 'px';
        customCursor.style.top = e.clientY - 15 + 'px';
    }
});

// Performance optimization for animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    // Disable complex animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}