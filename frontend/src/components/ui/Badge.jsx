import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
    amber: "bg-amber-100 text-amber-800 border border-amber-200",
    green: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    red: "bg-red-100 text-red-800 border border-red-200"
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
