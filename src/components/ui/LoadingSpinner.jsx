import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text = null,
  overlay = false 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    default: 'border-gray-300 border-t-black',
    white: 'border-gray-300 border-t-white',
    primary: 'border-gray-300 border-t-blue-600',
    minimal: 'border-gray-200 border-t-gray-600'
  };

  const spinnerClasses = `
    inline-block rounded-full border-2 animate-spin
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `;

  const spinner = (
    <motion.div
      className="flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={spinnerClasses} />
      {text && (
        <motion.p 
          className="text-sm text-gray-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <motion.div 
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {spinner}
      </motion.div>
    );
  }

  return spinner;
};

// Skeleton loader for content
const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  animate = true 
}) => (
  <motion.div 
    className={`bg-gray-200 rounded ${width} ${height} ${className} ${animate ? 'animate-pulse' : ''}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

// Dots loader
const DotsLoader = ({ 
  size = 'md',
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const variantClasses = {
    default: 'bg-black',
    gray: 'bg-gray-400',
    primary: 'bg-blue-600'
  };

  const dotClasses = `rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`;

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={dotClasses}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

export { LoadingSpinner, Skeleton, DotsLoader };
export default LoadingSpinner;