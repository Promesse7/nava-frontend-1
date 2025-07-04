import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  type = 'text',
  size = 'md',
  variant = 'default',
  placeholder,
  className = '',
  showPasswordToggle = false,
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const baseClasses = `
    w-full rounded-lg border transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `;
  
  const variantClasses = {
    default: `
      border-gray-300 bg-white text-gray-900
      focus:border-black focus:ring-black/10
      hover:border-gray-400
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
    `,
    minimal: `
      border-gray-200 bg-gray-50 text-gray-900
      focus:border-black focus:ring-black/10 focus:bg-white
      hover:border-gray-300 hover:bg-gray-100
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
    `,
    outlined: `
      border-2 border-black bg-white text-gray-900
      focus:border-black focus:ring-black/10
      hover:shadow-md
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
    `
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.replace(/\s+/g, ' ').trim();

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          className={`block text-sm font-medium text-gray-900 ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`${classes} ${icon ? 'pl-10' : ''} ${showPasswordToggle || error ? 'pr-10' : ''}`}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          {...props}
        />
        
        {/* Password toggle */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {/* Error icon */}
        {error && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle size={18} />
          </div>
        )}
        
        {/* Focus indicator */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-black pointer-events-none"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p 
            className="text-sm text-red-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;