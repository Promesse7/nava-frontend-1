import React from 'react';
import { Loader2 } from 'lucide-react';

const EnhancedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn transition-fast focus-visible';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    outline: 'btn-secondary',
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
    icon: 'btn-icon',
    'icon-sm': 'btn-icon-sm',
    'icon-lg': 'btn-icon-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex items-center">{icon}</span>
      )}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default EnhancedButton;