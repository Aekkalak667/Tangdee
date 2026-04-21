import React from 'react';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, avatarUrl }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 0',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '2rem',
        backgroundColor: 'var(--gray-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        overflow: 'hidden',
        border: '1px solid var(--gray-200)'
      }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <User size={40} color="var(--gray-400)" strokeWidth={1.5} />
        )}
      </div>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        color: 'var(--foreground)', 
        margin: '0 0 0.25rem 0',
        letterSpacing: '-0.01em'
      }}>
        {name || 'User Name'}
      </h2>
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--gray-500)', 
        margin: 0,
        fontWeight: '400'
      }}>
        {email || 'user@example.com'}
      </p>
    </div>
  );
};

export default ProfileHeader;
