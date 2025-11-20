// MOCK API SERVICE FOR UNICLUBS (FULL VERSION)
// =====================================================

// Current logged-in user
let currentUser = null;

// ======================== CLUBS DATA ========================
let clubs = [
    { id: 1, name: 'Robotics Club', members: 245, joined: false },
    { id: 2, name: 'Drama Society', members: 189, joined: true },
    { id: 3, name: 'Music Club', members: 312, joined: true },
    { id: 4, name: 'Literature Society', members: 156, joined: false },
    { id: 5, name: 'Sports Club', members: 428, joined: false },
    { id: 6, name: 'Art & Design', members: 203, joined: true }
];

// ======================== EVENTS DATA ========================
let events = [
    { id: 1, title: 'Tech Innovation Summit', date: '2024-01-15', rsvpd: false },
    { id: 2, title: 'Cultural Night', date: '2024-01-22', rsvpd: true },
    { id: 3, title: 'Career Fair 2024', date: '2024-01-28', rsvpd: false }
];

// ======================== TEAMS DATA (NEW) ========================
let teams = [
    {
        id: 1,
        name: "Robotics Squad",
        stream: "CSE",
        year: "3rd",
        icon: "🤖",
        members: [
            { name: "Aarav", specialty: "AI & ML" },
            { name: "Kavya", specialty: "Sensors & Circuits" }
        ]
    },
    {
        id: 2,
        name: "Cultural Crew",
        stream: "Humanities",
        year: "2nd",
        icon: "🎭",
        members: [
            { name: "Rohan", specialty: "Dance" },
            { name: "Meera", specialty: "Music" }
        ]
    },
    {
        id: 3,
        name: "Tech Ninjas",
        stream: "IT",
        year: "1st",
        icon: "💻",
        members: [
            { name: "Nitin", specialty: "Frontend" },
            { name: "Simran", specialty: "Backend" }
        ]
    },
    {
        id: 4,
        name: "Sports Warriors",
        stream: "Sports",
        year: "2nd",
        icon: "🏆",
        members: [
            { name: "Kabir", specialty: "Football" },
            { name: "Tanya", specialty: "Athletics" }
        ]
    }
];

// =====================================================
// MAIN UniClubsAPI OBJECT
// =====================================================

const UniClubsAPI = {

    // ---------------- LOGIN ----------------
    login: function(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = {
                    name: email.split('@')[0],
                    email: email
                };
                resolve(currentUser);
            }, 500);
        });
    },

    // ---------------- LOGOUT ----------------
    logout: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = null;
                resolve({ success: true });
            }, 300);
        });
    },

    // ---------------- GET CURRENT USER ----------------
    getCurrentUser: function() {
        return currentUser;
    },

    // ---------------- CLUB FUNCTIONS ----------------
    getClubs: function() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(clubs), 500);
        });
    },

    joinClub: function(clubId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const club = clubs.find(c => c.id === clubId);
                if (club) {
                    club.joined = true;
                    club.members += 1;
                    resolve({ success: true, message: `Joined ${club.name}!` });
                } else {
                    reject(new Error("Club not found"));
                }
            }, 700);
        });
    },

    // ---------------- EVENT FUNCTIONS ----------------
    getEvents: function() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(events), 500);
        });
    },

    rsvpToEvent: function(eventId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const event = events.find(e => e.id === eventId);
                if (event) {
                    event.rsvpd = !event.rsvpd;   // Toggle RSVP
                    resolve({ 
                        success: true, 
                        message: event.rsvpd 
                            ? `RSVP'd to ${event.title}!`
                            : `Removed RSVP for ${event.title}!`
                    });
                } else {
                    reject(new Error("Event not found"));
                }
            }, 700);
        });
    },

    // ---------------- TEAM FUNCTIONS (NEW) ----------------

    // Get all teams
    getTeams: function() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(teams), 500);
        });
    },

    // Add a new team
    addTeam: function(teamData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTeam = {
                    id: teams.length + 1,
                    name: teamData.name || "Untitled Team",
                    stream: teamData.stream || "Unknown",
                    year: teamData.year || "N/A",
                    icon: teamData.icon || "👥",
                    members: teamData.members || []
                };

                teams.push(newTeam);

                resolve({
                    success: true,
                    message: `${newTeam.name} has been added!`,
                    team: newTeam
                });
            }, 800);
        });
    },

    // Add member to existing team
    addTeamMember: function(teamId, memberData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const team = teams.find(t => t.id === teamId);
                if (!team) return reject(new Error("Team not found"));

                team.members.push({
                    name: memberData.name || "Unnamed Member",
                    specialty: memberData.specialty || "General"
                });

                resolve({
                    success: true,
                    message: `Member added to ${team.name}!`,
                    team
                });

            }, 600);
        });
    }
};

// ---------------- EXPORT TO GLOBAL ----------------
window.UniClubsAPI = UniClubsAPI;