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

// Navigation functionality for SPA mode
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
        }
    }, 100);
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
            // Show login modal
            if (loginModal) {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        if (dropdownMenu) {
            dropdownMenu.classList.remove('active');
        }
    });
}

// Modal functionality
if (modalClose && loginModal) {
    modalClose.addEventListener('click', () => {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
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
            if (loginModal) {
                loginModal.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
            loginForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showNotification(`Welcome back, ${user.name}!`, 'success');
        } catch (error) {
            // Reset button
            const submitBtn = loginForm.querySelector('.btn-login');
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
            
            showNotification(error.message, 'error');
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

// Load clubs data with simple AJAX
async function loadClubs() {
    const container = document.querySelector('#clubs .clubs-grid');
    if (!container) return;
    
    // Show loading message
    container.innerHTML = '<div class="loading">Loading clubs...</div>';
    
    // Simple AJAX call to get clubs
    try {
        const clubs = await UniClubsAPI.getClubs();
        // Display clubs
        displayClubs(clubs);
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load clubs</div>';
        console.error('Error loading clubs:', error);
    }
}

// Display clubs in a simple way
function displayClubs(clubs) {
    const container = document.querySelector('#clubs .clubs-grid');
    if (!container) return;
    
    // Create HTML for all clubs
    let clubsHTML = '';
    clubs.forEach(club => {
        clubsHTML += `
            <div class="club-card glass-card tilt-card">
                <h3>${club.name}</h3>
                <p>${club.members} members</p>
                <button class="btn btn-join ripple" 
                        data-club-id="${club.id}"
                        ${club.joined ? 'disabled' : ''}>
                    ${club.joined ? 'Joined' : 'Join Club'}
                </button>
            </div>
        `;
    });
    
    // Put the HTML in the container
    container.innerHTML = clubsHTML;
    
    // Add click events to join buttons
    document.querySelectorAll('.btn-join').forEach(button => {
        button.addEventListener('click', function() {
            const clubId = parseInt(this.getAttribute('data-club-id'));
            joinClub(clubId, this);
        });
    });
}

// Join a club with simple AJAX
function joinClub(clubId, button) {
    // Check if user is logged in
    if (!UniClubsAPI.getCurrentUser()) {
        alert('Please login to join clubs');
        return;
    }
    
    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Joining...';
    button.disabled = true;
    
    // Simple AJAX call to join club
    UniClubsAPI.joinClub(clubId)
        .then(response => {
            // Update button
            button.textContent = 'Joined';
            alert(response.message);
        })
        .catch(error => {
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
            alert('Failed to join club: ' + error.message);
        });
}

// Load events data with simple AJAX
async function loadEvents() {
    const container = document.querySelector('#events .events-timeline');
    if (!container) return;
    
    // Show loading message
    container.innerHTML = '<div class="loading">Loading events...</div>';
    
    // Simple AJAX call to get events
    try {
        const events = await UniClubsAPI.getEvents();
        // Display events
        displayEvents(events);
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load events</div>';
        console.error('Error loading events:', error);
    }
}

// Display events in a simple way
function displayEvents(events) {
    const container = document.querySelector('#events .events-timeline');
    if (!container) return;
    
    // Create HTML for all events
    let eventsHTML = '';
    events.forEach(event => {
        eventsHTML += `
            <div class="event-card glass-card tilt-card">
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <button class="btn btn-rsvp ripple" 
                        data-event-id="${event.id}"
                        ${event.rsvpd ? 'disabled' : ''}>
                    ${event.rsvpd ? 'RSVP\'d' : 'RSVP'}
                </button>
            </div>
        `;
    });
    
    // Put the HTML in the container
    container.innerHTML = eventsHTML;
    
    // Add click events to RSVP buttons
    document.querySelectorAll('.btn-rsvp').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-event-id'));
            rsvpToEvent(eventId, this);
        });
    });
}

// RSVP to an event with simple AJAX
function rsvpToEvent(eventId, button) {
    // Check if user is logged in
    if (!UniClubsAPI.getCurrentUser()) {
        alert('Please login to RSVP to events');
        return;
    }
    
    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    
    // Simple AJAX call to RSVP
    UniClubsAPI.rsvpToEvent(eventId)
        .then(response => {
            // Update button
            button.textContent = 'RSVP\'d';
            alert(response.message);
        })
        .catch(error => {
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
            alert('Failed to RSVP: ' + error.message);
        });
}

// Simplified login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple AJAX call to login
        UniClubsAPI.login(email, password)
            .then(user => {
                alert(`Welcome ${user.name}!`);
                // Close modal
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                // Reset form
                loginForm.reset();
                // Update user interface
                updateUserInterface();
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    });
}

// Simplified modal close
if (modalClose) {
    modalClose.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
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
    // Show home section by default
    showSection('home');
});