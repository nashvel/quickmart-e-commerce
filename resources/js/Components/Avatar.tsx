import React from 'react';

interface User {
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
}

interface AvatarProps {
  user: User;
  className?: string;
  textSize?: string;
}

export default function Avatar({ 
  user, 
  className = '',
  textSize = 'text-base'
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (user: User) => {
    const name = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    if (!name) return '?';
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    // Take first char of first word, and first char of last word.
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    // If only one word, take first two chars.
    return words[0].substring(0, 2).toUpperCase();
  };

  const stringToColor = (str: string) => {
    if (!str) return '#cccccc';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Ensure 32bit integer
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const avatarUrl = user?.avatar_url;
  const name = user?.name || `${user?.first_name} ${user?.last_name}`.trim();
  const bgColor = stringToColor(name);
  const showFallback = !avatarUrl || imageError;

  return (
    <>
      {showFallback ? (
        <div
          className={`${className} flex items-center justify-center text-white`}
          style={{ backgroundColor: bgColor }}
        >
          <span className={`font-bold ${textSize}`}>
            {getInitials(user)}
          </span>
        </div>
      ) : (
        <img
          src={avatarUrl}
          alt={name}
          className={className}
          onError={() => setImageError(true)}
        />
      )}
    </>
  );
}
