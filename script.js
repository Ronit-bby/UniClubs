// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const profileBtn = document.querySelector('.profile-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const loginItem = document.querySelector('.login-item');
const loginModal = document.getElementById('login');
const modalClose = document.querySelector('.modal-close');
const loginForm = document.getElementById('loginForm');
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
const tiltCards = document.querySelectorAll('.tilt-card');
const rippleButtons = document.querySelectorAll('.ripple');
const statNumbers = document.querySelectorAll('.stat-number');

// Always use JavaScript-based navigation for SPA
const isSPAMode = true;

// Create custom cursor elements
const cursor = document.createElement('div');
const cursorInner = document.createElement('div');
cursor.classList.add('cursor');
cursorInner.classList.add('cursor-inner');
document.body.appendChild(cursor);
document.body.appendChild(cursorInner);

// Custom cursor functionality - Simplified for better performance
let mouseX = 0;
let mouseY = 0;

// Mouse move event - Direct positioning for better performance
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position both cursors directly for better performance
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursorInner.style.left = `${mouseX}px`;
    cursorInner.style.top = `${mouseY}px`;
});

// Add hover effect to interactive elements
const hoverElements = document.querySelectorAll(
    'a, button, .nav-link, .dropdown-item, .btn, .club-card, .event-card, .stat-card, .modal-close'
);

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});

// Navigation functionality for SPA mode
function showSection(targetSection) {
    // Show loader
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('active');
    }
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    setTimeout(() => {
        // Show target section
        const target = document.getElementById(targetSection);
        if (target) {
            target.classList.add('active');
        }
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetSection}`) {
                link.classList.add('active');
            }
        });
        
        // Close dropdown if open
        if (dropdownMenu) {
            dropdownMenu.classList.remove('active');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger scroll animations for newly visible section
        setTimeout(() => {
            revealElements();
            if (targetSection === 'home') {
                animateStats();
            } else if (targetSection === 'clubs') {
                loadClubs();
            } else if (targetSection === 'events') {
                loadEvents();
            } else if (targetSection === 'profile') {
                loadProfile();
            } else if (targetSection === 'attendance') {
                loadAttendance();
            } else if (targetSection === 'teams') {
                // Teams section loaded
                console.log('Teams section loaded');
            }
        }, 100);
        
        // Hide loader after a delay
        setTimeout(() => {
            if (loader) {
                loader.classList.remove('active');
            }
        }, 200); // Reduced to 200ms
    }, 100); // Reduced to 100ms
}

// Add click events to nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Prevent default and handle with JavaScript
        e.preventDefault();
        const section = link.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Add click events to hero buttons
heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const section = button.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Add click events to dropdown items
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Profile dropdown functionality
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('active');
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (profileBtn && dropdownMenu && 
        !profileBtn.contains(e.target) && 
        !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Login/Logout functionality
if (loginItem) {
    loginItem.addEventListener('click', async (e) => {
        e.preventDefault();
        const currentUser = UniClubsAPI.getCurrentUser();
        
        if (currentUser) {
            // Logout
            try {
                await UniClubsAPI.logout();
                updateUserInterface();
                showNotification('Logged out successfully!', 'success');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        } else {
            // Show login modal using hash navigation to trigger CSS :target
            window.location.hash = 'login';
        }
        if (dropdownMenu) {
            dropdownMenu.classList.remove('active');
        }
    });
}

// Modal functionality - close when close button is clicked
if (modalClose) {
    modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
    });
}

// Close modal when clicking outside
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            window.location.hash = '';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.location.hash = '';
    }
});

// Form validation and submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        try {
            // Show loading state
            const submitBtn = loginForm.querySelector('.btn-login');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            // Login via API
            const user = await UniClubsAPI.login(email, password);
            
            // Update UI
            updateUserInterface();
            
            // Close modal
            window.location.hash = '';
            loginForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success notification
            showNotification('Login successful! Welcome back.', 'success');
        } catch (error) {
            // Reset button
            const submitBtn = loginForm.querySelector('.btn-login');
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
            
            // Show error notification
            showNotification(error.message || 'Login failed. Please try again.', 'error');
        }
    });
}

// Update user interface based on login state
function updateUserInterface() {
    const currentUser = UniClubsAPI.getCurrentUser();
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const loginText = document.querySelector('.login-text');
    
    if (userName) userName.textContent = currentUser ? currentUser.name : 'Guest User';
    if (userEmail) userEmail.textContent = currentUser ? currentUser.email : 'guest@uniclubs.edu';
    if (loginText) {
        loginText.textContent = currentUser ? 'Logout' : 'Login';
    }
}

// Load clubs data - handled by React
function loadClubs() {
    // Clubs are now fully managed by React
    console.log('Clubs loaded by React');
}

// Load events data - handled by React
function loadEvents() {
    // Events are now fully managed by React
    console.log('Events loaded by React');
}

// Keep existing navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Prevent default and handle with JavaScript
        e.preventDefault();
        const section = link.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Add click events to hero buttons
heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const section = button.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Add click events to dropdown items
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('href').substring(1); // Remove #
        if (section) {
            showSection(section);
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
    const sectionId = window.location.hash.substring(1) || 'home';
    showSection(sectionId);
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader on initial page load
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('active'); // Show initially
        setTimeout(() => {
            loader.classList.remove('active');
        }, 300); // Reduced to 300ms
    }
    
    // Show home section by default
    showSection('home');
    
    // Animate stats on load
    animateStats();
    
    // Add scroll reveal animations
    setupScrollReveal();
    
    // Setup ripple effects
    setupRippleEffects();
});

// Animate stat numbers
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (!target) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Setup scroll reveal animations
function setupScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Setup ripple effects
function setupRippleEffects() {
    const rippleButtons = document.querySelectorAll('.ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Reveal elements when scrolled into view
function revealElements() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Load profile data
function loadProfile() {
    // Profile data is handled by React
}

// Load attendance data
function loadAttendance() {
    // Attendance data is handled by React
}