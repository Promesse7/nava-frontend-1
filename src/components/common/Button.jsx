import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    isLoading = false,
    disabled = false,
    className = '',
    ...props 
  }) => {
    const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2";
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
    };
    const sizes = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2",
      large: "px-6 py-3 text-lg"
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} 
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={16} />
            Loading...
          </span>
        ) : children}
      </button>
    );
  };
export default Button;  