import React from 'react';

interface BadgeProps {
  name: string;
  description: string;
  type: 'rising-blogger' | 'pro-contributor' | 'tech-guru' | 'avid-reader' | 'deep-diver' | 'top-critic' | 'community-builder' | 'helper' | 'first-steps' | 'streak-keeper';
  file: string;
}
const Badge: React.FC<BadgeProps> = ({ name, description, file }) => {
  const getBadgeImage = (fileName: string) => 
  {
    return <img src={`/assets/${fileName}`} alt={name} className="w-full h-full" />;
  };

  return (
    <div className="relative group">
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-110">
        {getBadgeImage(file)}
      </div>
      <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-center text-white bg-gray-800 rounded-lg opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <p className="font-bold">{name}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Badge;