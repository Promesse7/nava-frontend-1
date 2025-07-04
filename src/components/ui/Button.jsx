import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98] select-none
  `;
  
  const variantClasses = {
    primary: `
      bg-black text-white border border-black
      hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-black/20
      disabled:hover:bg-black disabled:hover:translate-y-0 disabled:hover:shadow-none
    `,
    secondary: `
      bg-white text-black border-2 border-black
      hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-0.5
      focus:ring-black/20
      disabled:hover:bg-white disabled:hover:text-black disabled:hover:translate-y-0 disabled:hover:shadow-none
    `,
    ghost: `
      bg-transparent text-black border border-transparent
      hover:bg-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5
      focus:ring-gray-500/20
      disabled:hover:bg-transparent disabled:hover:translate-y-0 disabled:hover:shadow-none
    `,
    outline: `
      bg-transparent text-black border border-gray-300
      hover:bg-gray-50 hover:border-black hover:shadow-md hover:-translate-y-0.5
      focus:ring-black/20
      disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:translate-y-0 disabled:hover:shadow-none
    `,
    danger: `
      bg-red-600 text-white border border-red-600
      hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-red-500/20
      disabled:hover:bg-red-600 disabled:hover:translate-y-0 disabled:hover:shadow-none
    `,
    success: `
      bg-green-600 text-white border border-green-600
      hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-green-500/20
      disabled:hover:bg-green-600 disabled:hover:translate-y-0 disabled:hover:shadow-none
    `
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2',
    'icon-sm': 'p-1.5',
    'icon-lg': 'p-3'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.replace(/\s+/g, ' ').trim();

  const iconElement = loading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : icon ? (
    <span className="flex items-center">{icon}</span>
  ) : null;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {!loading && children}
      {iconPosition === 'right' && iconElement}
    </motion.button>
  );
};

export default Button;