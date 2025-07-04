import React from 'react';

const EnhancedCard = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = true,
  className = '',
  ...props 
}) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    elevated: 'card-elevated',
    minimal: 'card-minimal',
    glass: 'glass',
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };
  
  const hoverClasses = hover ? 'hover-lift' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default EnhancedCard;