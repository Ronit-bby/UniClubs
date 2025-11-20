// Simple Mock API Service for UniClubs
// Simple data storage (in a real app, this would be on a server)
let currentUser = null;
let clubs = [
    { id: 1, name: 'Robotics Club', members: 245, joined: false },
    { id: 2, name: 'Drama Society', members: 189, joined: true },
    { id: 3, name: 'Music Club', members: 312, joined: true },
    { id: 4, name: 'Literature Society', members: 156, joined: false },
    { id: 5, name: 'Sports Club', members: 428, joined: false },
    { id: 6, name: 'Art & Design', members: 203, joined: true }
];

let events = [
    { id: 1, title: 'Tech Innovation Summit', date: '2024-01-15', rsvpd: false },
    { id: 2, title: 'Cultural Night', date: '2024-01-22', rsvpd: true },
    { id: 3, title: 'Career Fair 2024', date: '2024-01-28', rsvpd: false }
];

// Simple API functions 
const UniClubsAPI = {
    // Login user
    login: function(email, password) {
        // In a real app, this would check with a server
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = {
                    name: email.split('@')[0],
                    email: email
                };
                resolve(currentUser);
            }, 500); // Simulate network delay
        });
    },
    
    // Logout user
    logout: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = null;
                resolve({ success: true });
            }, 300);
        });
    },
    
    // Get current user
    getCurrentUser: function() {
        return currentUser;
    },
    
    // Get all clubs
    getClubs: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(clubs);
            }, 500); // Simulate network delay
        });
    },
    
    // Join a club
    joinClub: function(clubId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const club = clubs.find(c => c.id === clubId);
                if (club) {
                    club.joined = true;
                    club.members += 1;
                    resolve({ success: true, message: `Joined ${club.name}!` });
                } else {
                    reject(new Error('Club not found'));
                }
            }, 1000); // Simulate network delay
        });
    },
    
    // Get all events
    getEvents: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(events);
            }, 500); // Simulate network delay
        });
    },
    
    // RSVP to an event
    rsvpToEvent: function(eventId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const event = events.find(e => e.id === eventId);
                if (event) {
                    event.rsvpd = true;
                    resolve({ success: true, message: `RSVP'd to ${event.title}!` });
                } else {
                    reject(new Error('Event not found'));
                }
            }, 1000); // Simulate network delay
        });
    }
};

// Make API available globally
window.UniClubsAPI = UniClubsAPI;
