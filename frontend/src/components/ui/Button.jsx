import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) => {
  
  const baseStyle = "relative overflow-hidden font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2";
  const sizes = "px-4 py-2 text-sm";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
    secondary: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] shadow-sm",
    danger: "bg-[var(--bg-secondary)] text-red-600 hover:bg-red-50 border border-red-200 shadow-sm"
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyle} ${sizes} ${variants[variant]} ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
