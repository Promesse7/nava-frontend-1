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
  fullWidth = false,
  rounded = 'default',
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
      bg-indigo-600 text-white border-2 border-indigo-600
      hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-indigo-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-indigo-500/25' : ''}
    `,
    secondary: `
      bg-transparent text-indigo-600 border-2 border-indigo-600
      hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-indigo-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'hover:shadow-indigo-500/25' : ''}
    `,
    ghost: `
      bg-transparent text-gray-700 dark:text-gray-200 border-2 border-transparent
      hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5
      focus:ring-gray-500/30 active:translate-y-0
    `,
    outline: `
      bg-transparent text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600
      hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md hover:-translate-y-0.5
      focus:ring-indigo-500/30 active:translate-y-0
    `,
    danger: `
      bg-red-600 text-white border-2 border-red-600
      hover:bg-red-700 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-red-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-red-500/25' : ''}
    `,
    success: `
      bg-emerald-600 text-white border-2 border-emerald-600
      hover:bg-emerald-700 hover:border-emerald-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-emerald-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-emerald-500/25' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-2 border-transparent
      hover:from-indigo-700 hover:to-purple-600 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-indigo-500/30 active:translate-y-0 active:shadow-md
      ${glow ? 'shadow-lg hover:shadow-indigo-500/25' : ''}
    `,
    subtle: `
      bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-transparent
      hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm hover:-translate-y-0.5
      focus:ring-gray-500/30 active:translate-y-0
    `,
    link: `
      bg-transparent text-indigo-600 dark:text-indigo-400 border-2 border-transparent underline
      hover:text-indigo-800 dark:hover:text-indigo-300 focus:ring-0 focus:ring-offset-0
      transform-none shadow-none
    `,
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs min-h-[1.75rem]',
    sm: 'px-3 py-1.5 text-sm min-h-[2rem]',
    md: 'px-4 py-2 text-sm min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base min-h-[3rem]',
    xl: 'px-8 py-4 text-lg min-h-[3.5rem]',
    icon: 'p-2 min-h-[2.5rem] aspect-square',
    'icon-sm': 'p-1.5 min-h-[2rem] aspect-square',
    'icon-lg': 'p-3 min-h-[3rem] aspect-square',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${roundedClasses[rounded]}
    ${disabledClasses} 
    ${widthClasses}
    ${className}
  `.trim();
  
  return (
    <motion.button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading && variant !== 'link' ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading && variant !== 'link' ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Ripple effect */}
      {ripple && isClicked && (
        <motion.span
          className={`absolute inset-0 bg-white/30 ${roundedClasses[rounded]}`}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Loading state */}
      {loading && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center bg-inherit ${roundedClasses[rounded]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
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

// Button Group Component
export const ButtonGroup = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1',
    subtle: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
    pill: 'bg-gray-100 dark:bg-gray-800 rounded-full p-1',
    none: '',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `
    inline-flex ${variantClasses[variant]} ${widthClasses} ${className}
  `.trim();
  
  // Clone children to add proper styling for button group
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        size,
        className: `${child.props.className || ''} first:rounded-l-lg last:rounded-r-lg rounded-none border-r-0 last:border-r-2`,
      });
    }
    return child;
  });
  
  return (
    <div className={classes} {...props}>
      {enhancedChildren}
    </div>
  );
};

// Icon Button Component
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'icon',
  rounded = 'full',
  ...props
}) => {
  return (
    <EnhancedButton
      icon={icon}
      variant={variant}
      size={size}
      rounded={rounded}
      aria-label={props['aria-label'] || 'Icon Button'}
      {...props}
    />
  );
};

export default EnhancedButton;