import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      animation: 'slideInRight 0.3s ease-out',
      minWidth: '300px'
    },
    icon: {
      flexShrink: 0
    },
    message: {
      flex: 1,
      fontSize: '0.95rem',
      fontWeight: 500
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      opacity: 0.8,
      transition: 'opacity 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div style={styles.message}>{message}</div>
      <button style={styles.closeBtn} onClick={onClose}>
        <X size={18} />
      </button>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Notification;
