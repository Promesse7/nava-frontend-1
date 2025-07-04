import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const EnhancedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon = null,
  iconPosition = 'left',
  ripple = true,
  glow = false,
  className = '',
  onClick,
  ...props 
}) => {
  const [isClicked, setIsClicked] = React.useState(false);
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    if (ripple) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
    
    if (onClick) onClick(e);
  };
  
  const baseClasses = 'btn relative overflow-hidden font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: `
      bg-primary text-white border-2 border-primary
      hover:bg-primary/90 hover:border-primary/90 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-primary/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-primary/25' : ''}
    `,
    secondary: `
      bg-transparent text-primary border-2 border-primary
      hover:bg-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5
      focus:ring-primary/30 active:translate-y-0 active:shadow-md
      ${glow ? 'hover:shadow-primary/25' : ''}
    `,
    ghost: `
      bg-transparent text-primary border-2 border-transparent
      hover:bg-subtle hover:border-border-gray hover:shadow-md hover:-translate-y-0.5
      focus:ring-primary/30 active:translate-y-0
    `,
    outline: `
      bg-transparent text-primary border-2 border-border-gray
      hover:bg-subtle hover:border-primary hover:shadow-md hover:-translate-y-0.5
      focus:ring-primary/30 active:translate-y-0
    `,
    danger: `
      bg-red-600 text-white border-2 border-red-600
      hover:bg-red-700 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-red-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-red-500/25' : ''}
    `,
    success: `
      bg-green-600 text-white border-2 border-green-600
      hover:bg-green-700 hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-green-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-green-500/25' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-primary to-accent-light text-white border-2 border-transparent
      hover:from-primary/90 hover:to-accent-light/90 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-primary/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-primary/25' : ''}
    `,
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md min-h-[1.75rem]',
    sm: 'px-3 py-1.5 text-sm rounded-lg min-h-[2rem]',
    md: 'px-4 py-2 text-sm rounded-lg min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base rounded-lg min-h-[3rem]',
    xl: 'px-8 py-4 text-lg rounded-xl min-h-[3.5rem]',
    icon: 'p-2 rounded-lg min-h-[2.5rem] aspect-square',
    'icon-sm': 'p-1.5 rounded-md min-h-[2rem] aspect-square',
    'icon-lg': 'p-3 rounded-lg min-h-[3rem] aspect-square',
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : '';
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${className}
  `.trim();
  
  return (
    <motion.button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Ripple effect */}
      {ripple && isClicked && (
        <motion.span
          className="absolute inset-0 bg-white/30 rounded-lg"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Loading state */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </motion.div>
      )}
      
      {/* Content */}
      <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {!loading && icon && iconPosition === 'left' && (
          <motion.span 
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        {!loading && children}
        {!loading && icon && iconPosition === 'right' && (
          <motion.span 
            className="flex items-center"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

export default EnhancedButton;