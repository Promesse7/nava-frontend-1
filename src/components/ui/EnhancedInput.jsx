import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const EnhancedInput = ({ 
  label,
  error,
  success,
  icon,
  type = 'text',
  size = 'md',
  variant = 'default',
  placeholder = '',
  helper = '',
  required = false,
  disabled = false,
  loading = false,
  className = '',
  onFocus,
  onBlur,
  onChange,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) onChange(e);
  };
  
  const baseClasses = 'input form-input-focus w-full transition-all duration-200';
  
  const variantClasses = {
    default: `
      border-2 border-border-gray bg-white
      focus:border-primary focus:ring-4 focus:ring-primary/10
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
      ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/10' : ''}
    `,
    minimal: `
      border-0 border-b-2 border-border-gray bg-transparent rounded-none
      focus:border-primary focus:ring-0 focus:shadow-none
      ${error ? 'border-red-500 focus:border-red-500' : ''}
      ${success ? 'border-green-500 focus:border-green-500' : ''}
    `,
    filled: `
      border-2 border-transparent bg-subtle
      focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
      ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/10' : ''}
    `,
    floating: `
      border-2 border-border-gray bg-white
      focus:border-primary focus:ring-4 focus:ring-primary/10
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
      ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/10' : ''}
    `,
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-sm rounded-lg',
    lg: 'px-5 py-4 text-base rounded-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';
  const loadingClasses = loading ? 'animate-pulse' : '';
  
  const inputClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${loadingClasses}
    ${icon || type === 'password' ? 'pr-10' : ''}
    ${className}
  `.trim();
  
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label 
          className={`
            block text-sm font-medium transition-colors duration-200
            ${isFocused ? 'text-primary' : 'text-gray-700'}
            ${error ? 'text-red-600' : ''}
            ${success ? 'text-green-600' : ''}
          `}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <motion.div 
            className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200
              ${isFocused ? 'text-primary' : 'text-gray-400'}
              ${error ? 'text-red-500' : ''}
              ${success ? 'text-green-500' : ''}
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Floating Label for floating variant */}
        {variant === 'floating' && (
          <motion.label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${isFocused || hasValue 
                ? 'top-2 text-xs text-primary' 
                : 'top-1/2 transform -translate-y-1/2 text-sm text-gray-500'
              }
              ${error ? 'text-red-500' : ''}
              ${success ? 'text-green-500' : ''}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
        
        {/* Input */}
        <motion.input
          ref={inputRef}
          type={inputType}
          className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
          placeholder={variant === 'floating' ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled || loading}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Success Icon */}
          {success && !error && (
            <motion.div
              className="text-green-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle size={16} />
            </motion.div>
          )}
          
          {/* Error Icon */}
          {error && (
            <motion.div
              className="text-red-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle size={16} />
            </motion.div>
          )}
          
          {/* Password Toggle */}
          {isPasswordType && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-primary transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </motion.button>
          )}
          
          {/* Loading Spinner */}
          {loading && (
            <motion.div
              className="animate-spin"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(error || success || helper) && (
          <motion.div
            className={`
              text-sm
              ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'}
            `}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error || success || helper}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedInput;