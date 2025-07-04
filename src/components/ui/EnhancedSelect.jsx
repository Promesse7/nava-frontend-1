import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';

const EnhancedSelect = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Select an option",
  searchable = false,
  clearable = false,
  disabled = false,
  loading = false,
  multiple = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchRef = useRef(null);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  const handleSelect = (option) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? value : [];
      const isSelected = newValue.some(item => item.value === option.value);
      
      if (isSelected) {
        onChange(newValue.filter(item => item.value !== option.value));
      } else {
        onChange([...newValue, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
  };
  
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base',
  };
  
  const variantClasses = {
    default: 'border-2 border-border-gray bg-white focus:border-primary',
    minimal: 'border-0 border-b-2 border-border-gray bg-transparent rounded-none focus:border-primary',
    filled: 'border-2 border-transparent bg-subtle focus:border-primary focus:bg-white',
  };
  
  const getDisplayValue = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return value[0].label;
      return `${value.length} items selected`;
    }
    return value ? value.label : placeholder;
  };
  
  const isSelected = (option) => {
    if (multiple && Array.isArray(value)) {
      return value.some(item => item.value === option.value);
    }
    return value && value.value === option.value;
  };
  
  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Main Select Button */}
      <motion.button
        type="button"
        className={`
          w-full flex items-center justify-between
          rounded-lg transition-all duration-200 focus:outline-none
          ${sizeClasses[size]} ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-4 ring-primary/10' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        {...props}
      >
        <span className={`truncate ${!value && !multiple ? 'text-gray-500' : 'text-gray-900'}`}>
          {getDisplayValue()}
        </span>
        
        <div className="flex items-center gap-2">
          {/* Clear Button */}
          {clearable && (value || (multiple && Array.isArray(value) && value.length > 0)) && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <X size={16} />
            </motion.button>
          )}
          
          {/* Loading Spinner */}
          {loading && (
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-gray-500" />
          </motion.div>
        </div>
      </motion.button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            )}
            
            {/* Options */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                  {searchTerm ? 'No results found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    className={`
                      w-full text-left px-4 py-3 flex items-center justify-between
                      transition-colors duration-150 hover:bg-gray-50
                      ${highlightedIndex === index ? 'bg-gray-50' : ''}
                      ${isSelected(option) ? 'bg-primary/5 text-primary' : 'text-gray-900'}
                    `}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1, delay: index * 0.02 }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected(option) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={16} className="text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSelect;