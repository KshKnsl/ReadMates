import React from 'react';

interface BadgeProps {
  name: string;
  description: string;
  type: 'rising-blogger' | 'pro-contributor' | 'tech-guru' | 'avid-reader' | 'deep-diver' | 'top-critic' | 'community-builder' | 'helper' | 'first-steps' | 'streak-keeper';
}

const Badge: React.FC<BadgeProps> = ({ name, description, type }) => {
  const getBadgeSVG = (badgeType: BadgeProps['type']) => {
    switch (badgeType) {
      case 'rising-blogger':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFD700" />
            <path d="M50 20v60M20 50h60" stroke="#FFF" strokeWidth="8" />
            <circle cx="50" cy="50" r="15" fill="#FFF" />
          </svg>
        );
      case 'pro-contributor':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 61,35 90,35 67,55 78,80 50,65 22,80 33,55 10,35 39,35" fill="#4CAF50" />
            <text x="50" y="55" fontSize="30" fill="#FFF" textAnchor="middle" dominantBaseline="middle">10+</text>
          </svg>
        );
      case 'tech-guru':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2196F3" />
            <path d="M30 70h40M30 50h40M30 30h40" stroke="#FFF" strokeWidth="6" strokeLinecap="round" />
            <circle cx="45" cy="30" r="5" fill="#FFF" />
            <circle cx="60" cy="50" r="5" fill="#FFF" />
            <circle cx="40" cy="70" r="5" fill="#FFF" />
          </svg>
        );
      case 'avid-reader':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <rect x="10" y="20" width="80" height="60" rx="5" fill="#9C27B0" />
            <path d="M20 30h60v40H20z" fill="#FFF" />
            <path d="M30 40h40M30 50h40M30 60h20" stroke="#9C27B0" strokeWidth="4" />
          </svg>
        );
      case 'deep-diver':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#00BCD4" />
            <path d="M50 20v60M20 50c30-20 30 20 60 0" stroke="#FFF" strokeWidth="6" fill="none" />
          </svg>
        );
      case 'top-critic':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 61,35 90,35 67,55 78,80 50,65 22,80 33,55 10,35 39,35" fill="#FFC107" />
            <text x="50" y="55" fontSize="40" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          </svg>
        );
      case 'community-builder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FF5722" />
            <circle cx="35" cy="40" r="10" fill="#FFF" />
            <circle cx="65" cy="40" r="10" fill="#FFF" />
            <circle cx="50" cy="70" r="10" fill="#FFF" />
            <path d="M35 50l15 20 15-20" stroke="#FFF" strokeWidth="4" fill="none" />
          </svg>
        );
      case 'helper':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#8BC34A" />
            <path d="M30 50c0-20 40-20 40 0s-40 20-40 0z" fill="#FFF" />
            <circle cx="50" cy="30" r="10" fill="#FFF" />
          </svg>
        );
      case 'first-steps':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#795548" />
            <path d="M30 70l20-40 20 40" stroke="#FFF" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'streak-keeper':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#F44336" />
            <path d="M50 20v30M35 35l15 15M65 35l-15 15" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <path d="M30 70h40" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative group">
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-110">
        {getBadgeSVG(type)}
      </div>
      <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-center text-white bg-gray-800 rounded-lg opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <p className="font-bold">{name}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Badge;

