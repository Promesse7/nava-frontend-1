import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = true,
  interactive = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = `
    bg-white rounded-xl border transition-all duration-300 ease-out
    ${interactive || onClick ? 'cursor-pointer' : ''}
  `;
  
  const variantClasses = {
    default: `
      border-gray-200 shadow-sm
      ${hover ? 'hover:shadow-md hover:border-gray-300 hover:-translate-y-1' : ''}
    `,
    elevated: `
      border-gray-200 shadow-lg
      ${hover ? 'hover:shadow-xl hover:border-gray-300 hover:-translate-y-2' : ''}
    `,
    minimal: `
      border-transparent shadow-none bg-gray-50
      ${hover ? 'hover:bg-gray-100 hover:shadow-sm hover:-translate-y-0.5' : ''}
    `,
    outlined: `
      border-black shadow-none
      ${hover ? 'hover:shadow-lg hover:bg-gray-50 hover:-translate-y-1' : ''}
    `,
    glass: `
      border-gray-200/30 shadow-lg backdrop-blur-sm bg-white/80
      ${hover ? 'hover:bg-white/90 hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    gradient: `
      border-transparent shadow-lg bg-gradient-to-br from-gray-50 to-gray-100
      ${hover ? 'hover:from-gray-100 hover:to-gray-200 hover:shadow-xl hover:-translate-y-1' : ''}
    `
  };
  
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`.replace(/\s+/g, ' ').trim();

  const cardContent = (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );

  if (interactive || onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

// Card subcomponents for better composition
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`pt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
export default Card;