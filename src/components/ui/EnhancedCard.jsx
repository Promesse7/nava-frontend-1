import React from 'react';
import { motion } from 'framer-motion';

const EnhancedCard = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = false,
  glass = false,
  clickable = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'card relative transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: `
      bg-white border border-border-gray
      ${hover ? 'hover:shadow-elegant hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer hover:shadow-lg' : ''}
    `,
    elevated: `
      bg-white shadow-lg border-0
      ${hover ? 'hover:shadow-xl hover:-translate-y-2' : ''}
      ${clickable ? 'cursor-pointer hover:shadow-2xl' : ''}
    `,
    minimal: `
      bg-transparent border-0
      ${hover ? 'hover:bg-subtle' : ''}
      ${clickable ? 'cursor-pointer hover:bg-subtle' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-white to-gray-50 border border-gray-100
      ${hover ? 'hover:from-gray-50 hover:to-white hover:shadow-lg hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer hover:shadow-xl' : ''}
    `,
    dark: `
      bg-gray-900 text-white border border-gray-800
      ${hover ? 'hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer hover:shadow-2xl' : ''}
    `,
    outline: `
      bg-transparent border-2 border-primary
      ${hover ? 'hover:bg-subtle hover:shadow-lg hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer hover:bg-primary hover:text-white' : ''}
    `,
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const glassClasses = glass ? 'backdrop-blur-lg bg-white/70 border-white/20' : '';
  const glowClasses = glow ? 'shadow-2xl hover:shadow-primary/10' : '';
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${paddingClasses[padding]} 
    ${glassClasses} 
    ${glowClasses} 
    ${className}
  `.trim();
  
  return (
    <motion.div
      className={classes}
      onClick={clickable ? onClick : undefined}
      whileHover={hover ? { scale: 1.01 } : {}}
      whileTap={clickable ? { scale: 0.99 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent-light/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      {children}
    </motion.div>
  );
};

// Card subcomponents for better composition
const CardHeader = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-h4 font-semibold text-primary ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-body text-secondary ${className}`}>
    {children}
  </p>
);

export { EnhancedCard, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
export default EnhancedCard;