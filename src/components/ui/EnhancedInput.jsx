import React from 'react';
import { AlertCircle } from 'lucide-react';

const EnhancedInput = ({ 
  label,
  error,
  icon,
  size = 'md',
  className = '',
  ...props 
}) => {
  const inputClasses = `input ${size === 'lg' ? 'input-lg' : size === 'sm' ? 'input-sm' : ''} ${error ? 'input-error' : ''} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-body-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
            {icon}
          </div>
        )}
        <input
          className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-body-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default EnhancedInput;