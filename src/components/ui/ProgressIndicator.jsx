import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  variant = 'default',
  orientation = 'horizontal',
  showLabels = true,
  className = '' 
}) => {
  const isVertical = orientation === 'vertical';
  
  const variantClasses = {
    default: 'text-primary',
    minimal: 'text-gray-600',
    elegant: 'text-black',
  };
  
  return (
    <div className={`${className}`}>
      {/* Progress Bar */}
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-4`}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <motion.div
                className={`
                  relative flex items-center justify-center
                  w-10 h-10 rounded-full border-2 font-semibold text-sm
                  transition-all duration-300 z-10
                  ${isCompleted 
                    ? 'bg-primary border-primary text-white' 
                    : isActive 
                      ? 'bg-white border-primary text-primary shadow-lg' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check size={16} />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index + 1}
                  </motion.span>
                )}
                
                {/* Active pulse effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
              
              {/* Step Label */}
              {showLabels && (
                <motion.div
                  className={`
                    ${isVertical ? 'ml-4' : 'mt-3'}
                    text-center
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`
                    font-medium text-sm
                    ${isActive ? 'text-primary' : isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className={`
                    ${isVertical ? 'w-0.5 h-12 ml-5' : 'h-0.5 flex-1'}
                    transition-all duration-300
                    ${index < currentStep ? 'bg-primary' : 'bg-gray-300'}
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Linear Progress Bar
const LinearProgress = ({ 
  value = 0, 
  max = 100, 
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-primary to-accent-light',
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={`
        w-full bg-gray-200 rounded-full overflow-hidden
        ${sizeClasses[size]}
      `}>
        <motion.div
          className={`
            h-full rounded-full transition-all duration-500
            ${variantClasses[variant]}
          `}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Circular Progress
const CircularProgress = ({ 
  value = 0, 
  max = 100, 
  size = 'md',
  variant = 'default',
  thickness = 'md',
  showLabel = true,
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };
  
  const thicknessClasses = {
    sm: 'stroke-2',
    md: 'stroke-3',
    lg: 'stroke-4',
  };
  
  const variantClasses = {
    default: 'stroke-primary',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500',
  };
  
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${variantClasses[variant]} ${thicknessClasses[thickness]}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export { ProgressIndicator, LinearProgress, CircularProgress };
export default ProgressIndicator;