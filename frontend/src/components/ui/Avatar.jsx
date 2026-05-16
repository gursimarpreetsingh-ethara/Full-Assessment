import React from 'react';
import { getInitials } from '../../utils/initials';

const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl"
  };

  // Generate a consistent gradient based on the name length or char codes
  const charCode = name ? name.charCodeAt(0) : 0;
  const gradients = [
    'from-purple-500 to-blue-500',
    'from-blue-500 to-cyan-500',
    'from-cyan-500 to-green-500',
    'from-green-500 to-amber-500',
    'from-pink-500 to-purple-500'
  ];
  const gradient = gradients[charCode % gradients.length];

  return (
    <div className={`rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${gradient} border border-white/20 shadow-lg ${sizes[size]} ${className}`}>
      {getInitials(name || '?')}
    </div>
  );
};

export default Avatar;
