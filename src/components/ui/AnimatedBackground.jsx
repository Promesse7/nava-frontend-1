import React from 'react';

const AnimatedBackground = ({ 
  variant = 'dots',
  className = '',
  opacity = 0.1 
}) => {
  const patterns = {
    dots: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    ),
    grid: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    ),
    lines: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines)" />
      </svg>
    ),
  };
  
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {patterns[variant]}
    </div>
  );
};

export default AnimatedBackground;