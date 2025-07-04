import React from 'react';
import { motion } from 'framer-motion';

const EnhancedLoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text = null,
  overlay = false,
  fullscreen = false,
  color = 'primary'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-500',
    black: 'border-black',
    red: 'border-red-500',
    green: 'border-green-500',
    blue: 'border-blue-500',
    yellow: 'border-yellow-500',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner size={size} color={color} />;
      case 'pulse':
        return <PulseSpinner size={size} color={color} />;
      case 'bars':
        return <BarsSpinner size={size} color={color} />;
      case 'orbit':
        return <OrbitSpinner size={size} color={color} />;
      case 'ripple':
        return <RippleSpinner size={size} color={color} />;
      case 'grid':
        return <GridSpinner size={size} color={color} />;
      default:
        return (
          <div className={`
            inline-block rounded-full border-2 border-gray-200 animate-spin
            ${sizeClasses[size]} ${colorClasses[color]}
            border-t-transparent
            ${className}
          `} />
        );
    }
  };

  const content = (
    <motion.div
      className="flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {renderSpinner()}
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

  if (fullscreen) {
    return (
      <motion.div 
        className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  if (overlay) {
    return (
      <motion.div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Dots Spinner
const DotsSpinner = ({ size, color }) => {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  const colorClasses = {
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-500',
    black: 'bg-black',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
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

// Pulse Spinner
const PulseSpinner = ({ size, color }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-500',
    black: 'bg-black',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <motion.div
      className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} opacity-75`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Bars Spinner
const BarsSpinner = ({ size, color }) => {
  const heightClasses = {
    xs: 'h-3',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
    '2xl': 'h-16',
  };

  const colorClasses = {
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-500',
    black: 'bg-black',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="flex items-end justify-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1 ${heightClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scaleY: [1, 0.4, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Orbit Spinner
const OrbitSpinner = ({ size, color }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-500',
    black: 'border-black',
    red: 'border-red-500',
    green: 'border-green-500',
    blue: 'border-blue-500',
    yellow: 'border-yellow-500',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className={`absolute inset-0 rounded-full border-2 ${colorClasses[color]} opacity-20`}
      />
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-transparent ${colorClasses[color]} border-t-current`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Ripple Spinner
const RippleSpinner = ({ size, color }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-500',
    black: 'border-black',
    red: 'border-red-500',
    green: 'border-green-500',
    blue: 'border-blue-500',
    yellow: 'border-yellow-500',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 ${colorClasses[color]} opacity-60`}
          animate={{
            scale: [0, 1],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.75
          }}
        />
      ))}
    </div>
  );
};

// Grid Spinner
const GridSpinner = ({ size, color }) => {
  const dotSizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const colorClasses = {
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-500',
    black: 'bg-black',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full ${dotSizeClasses[size]} ${colorClasses[color]}`}
          animate={{
            scale: [1, 0.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Skeleton loader for content
const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  animate = true,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-gray-200',
    dark: 'bg-gray-700',
    light: 'bg-gray-100',
  };

  return (
    <motion.div 
      className={`
        ${variantClasses[variant]} rounded ${width} ${height} ${className}
        ${animate ? 'animate-pulse' : ''}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export { EnhancedLoadingSpinner, Skeleton };
export default EnhancedLoadingSpinner;