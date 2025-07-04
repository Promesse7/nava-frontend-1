import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  searchable = false,
  multiple = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const baseClasses = `
    relative w-full rounded-lg border transition-all duration-200 ease-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantClasses = {
    default: `
      border-gray-300 bg-white
      hover:border-gray-400
      focus-within:border-black focus-within:ring-2 focus-within:ring-black/10
      ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10' : ''}
    `,
    minimal: `
      border-gray-200 bg-gray-50
      hover:border-gray-300 hover:bg-gray-100
      focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 focus-within:bg-white
      ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10' : ''}
    `,
    outlined: `
      border-2 border-black bg-white
      hover:shadow-md
      focus-within:border-black focus-within:ring-2 focus-within:ring-black/10
      ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10' : ''}
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : placeholder;
      }
      return `${value.length} selected`;
    }
    
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleOptionClick = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...(value || []), optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const isSelected = (optionValue) => {
    return multiple ? value?.includes(optionValue) : value === optionValue;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      <div 
        ref={selectRef}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        <div
          className={`flex items-center justify-between ${sizeClasses[size]}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={`truncate ${!value || (multiple && (!value || value.length === 0)) ? 'text-gray-400' : 'text-gray-900'}`}>
            {getDisplayValue()}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-gray-100">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black/10"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options */}
              <div className="overflow-y-auto max-h-48">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      className={`
                        flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                        hover:bg-gray-50 
                        ${isSelected(option.value) ? 'bg-gray-100 text-black' : 'text-gray-700'}
                      `}
                      onClick={() => handleOptionClick(option.value)}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected(option.value) && (
                        <Check size={16} className="text-black flex-shrink-0 ml-2" />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;