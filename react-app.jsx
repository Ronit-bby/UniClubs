// React App for UniClubs - Powers animations and interactive features
const { useState, useEffect, useRef, useCallback } = React;

// ==================== ANIMATION UTILITIES ====================

// Loading Component
const LoadingSpinner = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(25px)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 12px 40px rgba(220, 38, 38, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '3rem',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }}>🎓</div>
        <div style={{
          color: '#374151',
          fontWeight: 600,
          fontSize: '1.1rem',
        }}>Loading...</div>
      </div>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  const [show, setShow] = useState(true);
  const opacity = useSpring(show ? 1 : 0, { stiffness: 300, damping: 25 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: 'rgba(5, 150, 105, 0.2)', border: '#059669', text: '#059669' },
    error: { bg: 'rgba(220, 38, 38, 0.2)', border: '#dc2626', text: '#dc2626' },
    info: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#3b82f6' },
  };

  const color = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      background: color.bg,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${color.border}`,
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 10002,
      opacity: opacity,
      transform: `translateY(${(1 - opacity) * -20}px)`,
      transition: 'all 0.3s ease',
      maxWidth: '400px',
      minWidth: '250px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
          {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
        </span>
        <span style={{ 
          color: color.text, 
          fontWeight: 600, 
          flex: 1,
          whiteSpace: 'pre-line',
          lineHeight: 1.5,
        }}>{message}</span>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: color.text,
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Simple spring animation using requestAnimationFrame
const useSpring = (targetValue, config = { stiffness: 170, damping: 26 }) => {
  const [value, setValue] = useState(targetValue);
  const velocity = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const animate = () => {
      const delta = targetValue - value;
      const acceleration = delta * (config.stiffness / 100);
      velocity.current = (velocity.current + acceleration) * (config.damping / 100);
      const newValue = value + velocity.current;

      setValue(newValue);

      if (Math.abs(delta) > 0.01 || Math.abs(velocity.current) > 0.01) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [targetValue, value]);

  return value;
};

// Typing effect for chat messages
const useTypingEffect = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayText, isTyping };
};

// ==================== ANIMATED MODAL COMPONENT ====================

const AnimatedModal = ({ isOpen, onClose, title, children }) => {
  const [show, setShow] = useState(false);
  const opacity = useSpring(show ? 1 : 0, { stiffness: 200, damping: 20 });
  const scale = useSpring(show ? 1 : 0.8, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && opacity < 0.01) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `rgba(0, 0, 0, ${opacity * 0.5})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: opacity,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '500px',
          width: '90%',
          padding: '2rem',
          transform: `scale(${scale}) translateY(${(1 - scale) * 50}px)`,
          opacity: opacity,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#374151', fontSize: '1.5rem' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: 0,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ==================== JOIN CLUB FORM COMPONENT ====================

const JoinClubForm = ({ clubId, clubName, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(clubId, formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>Department</label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>Year</label>
        <select
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
          }}
        >
          <option value="">Select Year</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={isSubmitting}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          {isSubmitting ? 'Submitting...' : 'Join Club'}
        </button>
      </div>
    </form>
  );
};

// ==================== RSVP BUTTON COMPONENT ====================

const RSVPButton = ({ eventId, initialRsvpd = false, onToggle }) => {
  const [isRsvpd, setIsRsvpd] = useState(initialRsvpd);
  const [isAnimating, setIsAnimating] = useState(false);
  const scale = useSpring(isAnimating ? 1.15 : 1, { stiffness: 300, damping: 20 });

  useEffect(() => {
    setIsRsvpd(initialRsvpd);
  }, [initialRsvpd]);

  const handleClick = () => {
    const newState = !isRsvpd;
    setIsAnimating(true);
    setIsRsvpd(newState);
    onToggle(eventId, newState);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className="btn ripple"
      style={{
        background: isRsvpd 
          ? 'linear-gradient(135deg, #059669, #10b981)' 
          : 'linear-gradient(135deg, #dc2626, #ef4444)',
        color: 'white',
        padding: '0.75rem 1.5rem',
        transform: `scale(${scale})`,
        transition: 'background 0.3s ease',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1rem',
        boxShadow: isRsvpd
          ? '0 6px 20px rgba(5, 150, 105, 0.4)'
          : '0 6px 20px rgba(220, 38, 38, 0.4)',
      }}
    >
      {isRsvpd ? 'Joined ✓' : 'RSVP'}
    </button>
  );
};

// ==================== TEAM CHAT MODAL ====================

const TeamChatModal = ({ isOpen, onClose, teamName, teamId }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the team chat!', user: 'system', timestamp: Date.now() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      user: 'me',
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} title={`${teamName} Chat`}>
      <div
        style={{
          height: '350px',
          overflowY: 'auto',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
          }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Send
        </button>
      </form>
    </AnimatedModal>
  );
};

// ==================== CHAT MESSAGE WITH TYPING ANIMATION ====================

const ChatMessage = ({ message }) => {
  const { displayText, isTyping } = useTypingEffect(message.text, 30);
  const isMe = message.user === 'me';

  return (
    <div
      style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
        padding: '0.75rem 1rem',
        borderRadius: '15px',
        background: isMe ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.6)',
        color: '#374151',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div>{displayText}</div>
      {isTyping && message.user !== 'me' && (
        <div style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#6b7280', marginTop: '0.2rem' }}>
          typing...
        </div>
      )}
    </div>
  );
};

// ==================== TEAM CARD COMPONENT ====================

const TeamCard = ({ team, onChatClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Trigger bounce animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="glass-card tilt-card team-card"
      style={{
        padding: '2rem',
        textAlign: 'center',
        animation: team.isNew ? 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
      }}
    >
      {/* Team Header - Clickable */}
      <div 
        onClick={toggleExpand}
        style={{ cursor: 'pointer' }}
      >
        <div className="team-icon">  
          {team.icon || '👥'}
        </div>
        <h3 style={{ color: '#374151', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 700 }}>  
          {team.name}
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Stream: {team.stream}</p>
        <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>Year: {team.year}</p>
        
        {/* Expand Indicator */}
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#dc2626', 
          fontWeight: 600,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3rem'
        }}>
          {isExpanded ? '▲' : '▼'} {isExpanded ? 'Hide Members' : 'View Members'}
        </div>
      </div>

      {/* Expandable Members Section */}
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div style={{
          padding: '1rem',
          background: 'rgba(220, 38, 38, 0.05)',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'left',
        }}>
          <h4 style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            marginBottom: '0.8rem',
            textAlign: 'center'
          }}>
            Team Members
          </h4>
          {team.members && team.members.length > 0 ? (
            team.members.map((member, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600, color: '#374151' }}>👤 {member.name}</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>{member.specialty}</span>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>No members yet</p>
          )}
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => onChatClick(team)}
        className="btn btn-primary ripple"
        style={{ padding: '0.75rem 1.5rem', width: '100%' }}
      >
        💬 Open Chat
      </button>
    </div>
  );
};

// ==================== ADD TEAM MODAL ====================

const AddTeamModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    stream: '',
    year: '',
  });
  
  const [members, setMembers] = useState([
    { name: '', specialty: '' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamData = {
      ...formData,
      members: members.filter(m => m.name.trim() !== '' || m.specialty.trim() !== '')
    };
    onAdd(teamData);
    setFormData({ name: '', stream: '', year: '' });
    setMembers([{ name: '', specialty: '' }]);
  };
  
  const addMemberField = () => {
    setMembers([...members, { name: '', specialty: '' }]);
  };
  
  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };
  
  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0.5rem' }}>
        {/* Team Info */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
            Team Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Robotics Squad"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
            Stream
          </label>
          <input
            type="text"
            value={formData.stream}
            onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
            placeholder="e.g., Computer Science, Engineering"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
            Year
          </label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
            }}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        
        {/* Members Section */}
        <div style={{
          padding: '1rem',
          background: 'rgba(220, 38, 38, 0.05)',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: '#374151', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Team Members (Optional)
            </h4>
            <button
              type="button"
              onClick={addMemberField}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              + Add Member
            </button>
          </div>
          
          {members.map((member, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.6)',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '0.75rem',
              position: 'relative'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                  Member Name
                </label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(index, 'name', e.target.value)}
                  placeholder="e.g., John Doe"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                  Specialty/Role
                </label>
                <input
                  type="text"
                  value={member.specialty}
                  onChange={(e) => updateMember(index, 'specialty', e.target.value)}
                  placeholder="e.g., Web Development"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#dc2626',
                    fontWeight: 'bold',
                  }}
                  title="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Create Team
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
};

// ==================== MAIN APP COMPONENT ====================

const App = () => {
  // State management
  const [joinedClubs, setJoinedClubs] = useState([
    { id: 1, name: 'Robotics Club', icon: '🤖', role: 'Member' },
    { id: 3, name: 'Music Club', icon: '🎵', role: 'Vice President' },
    { id: 6, name: 'Art & Design', icon: '🎨', role: 'Member' },
  ]);
  
  const [rsvpEvents, setRsvpEvents] = useState({});
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  
  const [teams, setTeams] = useState([
    { id: 1, name: 'Robotics Squad', stream: 'CSE', year: '3rd Year', icon: '🤖', isNew: false, members: [
      { name: 'Alex Chen', specialty: 'AI & Machine Learning' },
      { name: 'Sarah Williams', specialty: 'Hardware Design' },
      { name: 'Mike Johnson', specialty: 'Software Engineering' },
    ]},
    { id: 2, name: 'Cultural Crew', stream: 'Humanities', year: '2nd Year', icon: '🎭', isNew: false, members: [
      { name: 'Priya Sharma', specialty: 'Event Coordination' },
      { name: 'David Lee', specialty: 'Choreography' },
    ]},
    { id: 3, name: 'Tech Ninjas', stream: 'IT', year: '1st Year', icon: '💻', isNew: false, members: [
      { name: 'Emma Davis', specialty: 'Web Development' },
      { name: 'Chris Taylor', specialty: 'Cybersecurity' },
      { name: 'Lisa Anderson', specialty: 'Database Management' },
    ]},
    { id: 4, name: 'Sports Warriors', stream: 'Sports', year: '2nd Year', icon: '⚽', isNew: false, members: [
      { name: 'Jason Smith', specialty: 'Team Captain' },
      { name: 'Maria Garcia', specialty: 'Fitness Coach' },
    ]},
    { id: 5, name: 'Design Masters', stream: 'Design', year: '3rd Year', icon: '🎨', isNew: false, members: [
      { name: 'Sophia Brown', specialty: 'UI/UX Design' },
      { name: 'Oliver White', specialty: 'Graphic Design' },
      { name: 'Ava Martinez', specialty: '3D Modeling' },
    ]},
    { id: 6, name: 'Music Legends', stream: 'Music', year: '4th Year', icon: '🎵', isNew: false, members: [
      { name: 'Noah Wilson', specialty: 'Vocals' },
      { name: 'Isabella Thomas', specialty: 'Guitar' },
      { name: 'Ethan Moore', specialty: 'Drums' },
    ]},
  ]);

  // Modal states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Toast state
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Club data
  const clubsData = {
    1: { name: 'Robotics Club', icon: '🤖' },
    2: { name: 'Drama Society', icon: '🎭' },
    3: { name: 'Music Club', icon: '🎵' },
    4: { name: 'Literature Society', icon: '📚' },
    5: { name: 'Sports Club', icon: '⚽' },
    6: { name: 'Art & Design', icon: '🎨' },
  };
  
  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  
  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Open join club modal - Direct join/unjoin toggle
  const openJoinModal = (clubId) => {
    // Check if already joined
    const alreadyJoined = joinedClubs.some(c => c.id === clubId);
    
    if (alreadyJoined) {
      // Unjoin the club
      setJoinedClubs(joinedClubs.filter(c => c.id !== clubId));
      showToast(`You have left the club.`, 'info');
      return;
    }
    
    // Join the club
    const club = clubsData[clubId];
    const newClub = {
      id: clubId,
      name: club.name,
      icon: club.icon,
      role: 'Member',
      isNew: true,
    };

    setJoinedClubs([...joinedClubs, newClub]);
    showToast(`Successfully joined ${club.name}! Check your profile.`, 'success');

    // Remove the "new" flag after animation
    setTimeout(() => {
      setJoinedClubs(clubs => clubs.map(c => c.id === clubId ? { ...c, isNew: false } : c));
    }, 1000);
  };

  // Handle RSVP toggle
  const handleRSVPToggle = (eventId, isRsvpd) => {
    setRsvpEvents({ ...rsvpEvents, [eventId]: isRsvpd });
    
    if (isRsvpd) {
      showToast('RSVP successful! Check Attendance page for event details.', 'success');
    } else {
      showToast('RSVP cancelled.', 'info');
    }
  };

  // Mark attendance
  const markAttendance = (eventId) => {
    const now = new Date();
    const eventsData = {
      1: { name: 'Tech Innovation Summit', location: 'Main Auditorium' },
      2: { name: 'Cultural Night', location: 'Student Center' },
      3: { name: 'Career Fair 2024', location: 'Sports Complex' },
    };
    
    const event = eventsData[eventId] || eventsData[1];
    
    const log = {
      eventId,
      eventName: event.name,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      location: event.location,
      status: 'Demo Mode: You are not at the event location (demo mode).',
    };

    setAttendanceLogs([log, ...attendanceLogs]);
    showToast(`Attendance marked for ${event.name}!\nLocation: ${event.location}\nStatus: ${log.status}`, 'success');
  };

  // Add new team
  const handleAddTeam = (teamData) => {
    // Array of random emojis for teams
    const teamEmojis = ['🚀', '🎓', '💡', '🏆', '🎯', '🌟', '🔥', '⚡', '🎮', '🎤', '🎸', '🎬', '📚', '🔬', '✈️', '🏋️'];
    const randomIcon = teamEmojis[Math.floor(Math.random() * teamEmojis.length)];
    
    const newTeam = {
      id: Date.now(),
      name: teamData.name || 'New Team',
      stream: teamData.stream || 'General',
      year: teamData.year || '1st Year',
      icon: randomIcon,
      isNew: true,
      members: teamData.members || [],
    };

    setTeams([...teams, newTeam]);
    setAddTeamModalOpen(false);
    showToast(`Team "${newTeam.name}" created successfully!`, 'success');

    // Remove bounce animation flag after it plays
    setTimeout(() => {
      setTeams(teams => teams.map(t => t.id === newTeam.id ? { ...t, isNew: false } : t));
    }, 600);
  };

  // Open team chat
  const handleChatClick = (team) => {
    setSelectedTeam(team);
    setChatModalOpen(true);
  };

  // Navigate to home
  const navigateToHome = () => {
    window.location.href = 'index.html#home';
  };
  
  // Check if club is joined
  const isClubJoined = useCallback((clubId) => {
    return joinedClubs.some(c => c.id === clubId);
  }, [joinedClubs]);

  // Expose functions to global window for HTML onclick handlers
  useEffect(() => {
    window.App = {
      openJoinModal,
      toggleRSVP: handleRSVPToggle,
      markAttendance,
      addTeam: () => setAddTeamModalOpen(true),
      navigateToHome,
      isClubJoined,
    };
  }, [joinedClubs, isClubJoined]);

  return (
    <>
      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />  
      ))}

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={addTeamModalOpen}
        onClose={() => setAddTeamModalOpen(false)}
        onAdd={handleAddTeam}
      />

      {/* Chat Modal */}
      {selectedTeam && (
        <TeamChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          teamName={selectedTeam.name}
          teamId={selectedTeam.id}
        />
      )}

      {/* Render joined clubs in profile (if on index.html) */}
      {typeof document !== 'undefined' && document.getElementById('joined-clubs-container') && (
        <JoinedClubsList clubs={joinedClubs} />
      )}

      {/* Render teams (if on teams.html) */}
      <TeamsSection teams={teams} onChatClick={handleChatClick} onAddClick={() => setAddTeamModalOpen(true)} />

      {/* Render RSVP buttons (if on index.html events section) */}
      {typeof document !== 'undefined' && document.querySelectorAll('#rsvp-buttons-root').length > 0 && (
        <RSVPButtonsRenderer rsvpEvents={rsvpEvents} onToggle={handleRSVPToggle} />
      )}
      
      {/* Render Join Button states */}
      {typeof document !== 'undefined' && document.querySelectorAll('.btn-join[data-club-id]').length > 0 && (
        <JoinButtonsRenderer joinedClubs={joinedClubs} onJoin={openJoinModal} />
      )}
    </>
  );
};

// ==================== JOINED CLUBS LIST (Profile Section) ====================

const JoinedClubsList = ({ clubs }) => {
  const container = document.getElementById('joined-clubs-container');
  const clubsCount = document.getElementById('clubs-count');
  
  useEffect(() => {
    if (clubsCount) {
      clubsCount.textContent = clubs.length;
    }
  }, [clubs, clubsCount]);
  
  if (!container) return null;

  return ReactDOM.createPortal(
    <>
      {clubs.map((club) => (
        <div
          key={club.id}
          className={`joined-club-item glass-card ${club.isNew ? 'glow-add' : ''}`}
          style={{
            animation: club.isNew ? 'glowPulse 1s ease-in-out' : 'none',
          }}
        >
          <span className="club-icon">{club.icon}</span>
          <span className="club-name">{club.name}</span>
          <span className="club-role">{club.role}</span>
        </div>
      ))}
    </>,
    container
  );
};

// ==================== TEAMS SECTION (teams.html) ====================

const TeamsSection = ({ teams, onChatClick, onAddClick }) => {
  const container = document.getElementById('teams-root');
  if (!container) return null;

  return ReactDOM.createPortal(
    <>
      <div className="teams-grid">
        {teams && teams.length > 0 ? (
          teams.map((team) => (
            <TeamCard key={team.id} team={team} onChatClick={onChatClick} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            No teams found. Click + to create one!
          </div>
        )}
      </div>

      {/* Floating + button */}
      <button
        className="floating-fab"
        onClick={onAddClick}
        title="Create New Team"
      >
        +
      </button>
    </>,
    container
  );
};

// ==================== RSVP BUTTONS RENDERER ====================

const RSVPButtonsRenderer = ({ rsvpEvents, onToggle }) => {
  const containers = document.querySelectorAll('#rsvp-buttons-root');
  
  return (
    <>
      {Array.from(containers).map((container, index) => {
        const eventId = index + 1;
        return ReactDOM.createPortal(
          <RSVPButton
            key={eventId}
            eventId={eventId}
            initialRsvpd={rsvpEvents[eventId] || false}
            onToggle={onToggle}
          />,
          container
        );
      })}
    </>
  );
};

// ==================== JOIN BUTTONS RENDERER ====================

const JoinButton = ({ clubId, isJoined, onClick }) => {
  const [scale, setScale] = useState(1);

  const handleClick = () => {
    setScale(1.1);
    setTimeout(() => setScale(1), 200);
    onClick(clubId);
  };

  return (
    <button
      className="btn btn-join ripple"
      onClick={handleClick}
      style={{
        transform: `scale(${scale})`,
        transition: 'all 0.3s ease',
        background: isJoined
          ? 'linear-gradient(135deg, #059669, #10b981)'
          : 'linear-gradient(135deg, #dc2626, #ef4444)',
        cursor: 'pointer',
        opacity: 1,
      }}
    >
      {isJoined ? 'Unjoin' : 'Join Club'}
    </button>
  );
};

const JoinButtonsRenderer = ({ joinedClubs, onJoin }) => {
  const buttons = document.querySelectorAll('.btn-join[data-club-id]');
  
  useEffect(() => {
    buttons.forEach(button => {
      const clubId = parseInt(button.getAttribute('data-club-id'));
      const isJoined = joinedClubs.some(c => c.id === clubId);
      const clubCard = button.closest('.club-card');
      
      if (isJoined) {
        button.textContent = 'Unjoin';
        button.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        button.style.cursor = 'pointer';
        button.disabled = false;
        if (clubCard) clubCard.classList.add('joined');
      } else {
        button.textContent = 'Join Club';
        button.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
        button.style.cursor = 'pointer';
        button.disabled = false;
        if (clubCard) clubCard.classList.remove('joined');
      }
    });
  }, [joinedClubs, buttons]);

  return null;
};

// ==================== RENDER APP ====================

const root = document.getElementById('react-root');
if (root) {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    ReactDOM.render(<App />, root);
  }, 100);
}
