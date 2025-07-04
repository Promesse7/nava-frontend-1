import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Calendar, 
  Clock, 
  X,
  Info
} from 'lucide-react';

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
  clearable = false,
  fullWidth = false,
  rounded = 'md',
  className = '',
  onFocus,
  onBlur,
  onChange,
  onClear,
  value,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [internalValue, setInternalValue] = useState(value || '');
  const inputRef = useRef(null);
  
  // Update internal value when prop value changes
  useEffect(() => {
    setInternalValue(value || '');
    setHasValue(!!value);
  }, [value]);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    setHasValue(newValue.length > 0);
    if (onChange) onChange(e);
  };
  
  const handleClear = () => {
    setInternalValue('');
    setHasValue(false);
    
    // Update the input value and trigger onChange
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      
      nativeInputValueSetter.call(inputRef.current, '');
      
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
    
    if (onClear) onClear();
  };
  
  const baseClasses = 'input w-full transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    default: `
      border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
      focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
      ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''}
      ${success ? 'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20' : ''}
    `,
    minimal: `
      border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent rounded-none text-gray-900 dark:text-white
      focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0
      ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : ''}
      ${success ? 'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500' : ''}
    `,
    filled: `
      border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
      focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:bg-white dark:focus:bg-gray-700
      ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''}
      ${success ? 'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20' : ''}
    `,
    floating: `
      border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
      focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
      ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''}
      ${success ? 'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20' : ''}
      ${(isFocused || hasValue) ? 'pt-6 pb-2' : ''}
    `,
    search: `
      border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
      focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
      ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''}
      ${success ? 'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20' : ''}
    `,
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-4 text-lg',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '';
  const loadingClasses = loading ? 'animate-pulse' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const inputClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${roundedClasses[rounded]}
    ${disabledClasses} 
    ${loadingClasses}
    ${widthClasses}
    ${(icon || type === 'password' || (clearable && hasValue) || type === 'search') ? 'pr-10' : ''}
    ${className}
  `.trim();
  
  const isPasswordType = type === 'password';
  const isSearchType = type === 'search' || variant === 'search';
  const isDateType = type === 'date' || type === 'datetime-local';
  const isTimeType = type === 'time';
  
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  
  // Automatically add search icon for search inputs
  const effectiveIcon = isSearchType && !icon ? <Search size={16} /> : 
                        isDateType && !icon ? <Calendar size={16} /> :
                        isTimeType && !icon ? <Clock size={16} /> : 
                        icon;
  
  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && variant !== 'floating' && (
        <motion.label 
          className={`
            block text-sm font-medium transition-colors duration-200
            ${isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}
            ${error ? 'text-red-600 dark:text-red-500' : ''}
            ${success ? 'text-green-600 dark:text-green-500' : ''}
          `}
          initial={{ opacity: 0, y: -5 }}
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
        {effectiveIcon && (
          <motion.div 
            className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200
              ${isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}
              ${error ? 'text-red-500 dark:text-red-400' : ''}
              ${success ? 'text-green-500 dark:text-green-400' : ''}
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {effectiveIcon}
          </motion.div>
        )}
        
        {/* Floating Label for floating variant */}
        {variant === 'floating' && label && (
          <motion.label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${isFocused || hasValue 
                ? 'top-1.5 text-xs text-indigo-600 dark:text-indigo-400' 
                : 'top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
              }
              ${error ? 'text-red-500 dark:text-red-400' : ''}
              ${success ? 'text-green-500 dark:text-green-400' : ''}
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
          className={`${inputClasses} ${effectiveIcon ? 'pl-10' : ''}`}
          placeholder={variant === 'floating' && (isFocused || hasValue) ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled || loading}
          value={internalValue}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Success Icon */}
          {success && !error && !clearable && !isPasswordType && (
            <motion.div
              className="text-green-500 dark:text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle size={16} />
            </motion.div>
          )}
          
          {/* Error Icon */}
          {error && !clearable && !isPasswordType && (
            <motion.div
              className="text-red-500 dark:text-red-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle size={16} />
            </motion.div>
          )}
          
          {/* Clear Button */}
          {clearable && hasValue && !disabled && !loading && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              aria-label="Clear input"
            >
              <X size={16} />
            </motion.button>
          )}
          
          {/* Password Toggle */}
          {isPasswordType && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
              <div className="w-4 h-4 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(error || success || helper) && (
          <motion.div
            className={`
              text-xs flex items-start gap-1
              ${error ? 'text-red-600 dark:text-red-400' : success ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}
            `}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error ? (
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            ) : success ? (
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
            ) : helper ? (
              <Info size={14} className="flex-shrink-0 mt-0.5" />
            ) : null}
            <span>{error || success || helper}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Textarea component
export const EnhancedTextarea = ({
  rows = 4,
  maxLength,
  showCount = false,
  ...props
}) => {
  const [charCount, setCharCount] = useState(props.value?.length || 0);
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) props.onChange(e);
  };
  
  return (
    <div className="space-y-1.5">
      <EnhancedInput
        as="textarea"
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      
      {showCount && maxLength && (
        <div className="flex justify-end">
          <span className={`text-xs ${
            charCount > maxLength * 0.9 
              ? charCount >= maxLength 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-amber-500 dark:text-amber-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {charCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

// Select component that matches the input style
export const EnhancedSelect = ({
  options = [],
  label,
  error,
  success,
  icon,
  size = 'md',
  variant = 'default',
  placeholder = 'Select an option',
  helper = '',
  required = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = 'md',
  className = '',
  ...props
}) => {
  return (
    <EnhancedInput
      as="select"
      label={label}
      error={error}
      success={success}
      icon={icon}
      size={size}
      variant={variant}
      placeholder={placeholder}
      helper={helper}
      required={required}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      rounded={rounded}
      className={`${className} appearance-none`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </EnhancedInput>
  );
};

export { EnhancedInput, EnhancedTextarea, EnhancedSelect };
export default EnhancedInput;