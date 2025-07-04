import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TabsContext = createContext();

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

const EnhancedTabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
  orientation = 'horizontal',
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue = {
    value,
    setValue,
    variant,
    orientation
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({
  children,
  className = ''
}) => {
  const { variant, orientation } = useTabs();
  
  const variantClasses = {
    default: 'bg-gray-100 p-1 rounded-lg',
    underline: 'border-b border-gray-200',
    pills: 'gap-1',
    minimal: 'gap-4',
  };
  
  const orientationClasses = {
    horizontal: 'flex',
    vertical: 'flex flex-col'
  };

  return (
    <div className={`
      ${orientationClasses[orientation]}
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </div>
  );
};

const TabsTrigger = ({
  value: triggerValue,
  children,
  disabled = false,
  className = ''
}) => {
  const { value, setValue, variant } = useTabs();
  const isActive = value === triggerValue;

  const baseClasses = 'relative font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20';
  
  const variantClasses = {
    default: `
      px-3 py-2 rounded-md
      ${isActive 
        ? 'bg-white text-primary shadow-sm' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
      }
    `,
    underline: `
      px-4 py-3 border-b-2 -mb-px
      ${isActive 
        ? 'border-primary text-primary' 
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }
    `,
    pills: `
      px-4 py-2 rounded-full
      ${isActive 
        ? 'bg-primary text-white shadow-lg' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }
    `,
    minimal: `
      px-2 py-1
      ${isActive 
        ? 'text-primary font-semibold' 
        : 'text-gray-600 hover:text-gray-900'
      }
    `,
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <motion.button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={() => !disabled && setValue(triggerValue)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Active indicator for minimal variant */}
      {variant === 'minimal' && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
      )}
      
      {children}
    </motion.button>
  );
};

const TabsContent = ({
  value: contentValue,
  children,
  className = ''
}) => {
  const { value } = useTabs();
  const isActive = value === contentValue;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={`focus:outline-none ${className}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          tabIndex={0}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated Tab Indicator (for custom implementations)
const TabIndicator = ({ className = '' }) => {
  return (
    <motion.div
      className={`absolute bg-primary rounded-full ${className}`}
      layoutId="tabIndicator"
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    />
  );
};

// Advanced Tabs with Icons
const IconTab = ({
  value,
  icon,
  label,
  badge,
  disabled = false,
  className = ''
}) => {
  const { value: activeValue, setValue } = useTabs();
  const isActive = activeValue === value;

  return (
    <motion.button
      type="button"
      className={`
        relative flex items-center gap-2 px-4 py-3 rounded-lg
        font-medium text-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${isActive 
          ? 'bg-primary text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={() => !disabled && setValue(value)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Icon */}
      <motion.div
        className="flex items-center"
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      
      {/* Label */}
      <span>{label}</span>
      
      {/* Badge */}
      {badge && (
        <motion.span
          className={`
            ml-1 px-2 py-0.5 text-xs rounded-full font-medium
            ${isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-red-100 text-red-700'
            }
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
};

// Step Tabs (for wizards/forms)
const StepTabs = ({
  steps = [],
  currentStep = 0,
  onStepChange,
  variant = 'default',
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = step.clickable !== false && index <= currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step */}
            <motion.button
              type="button"
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 focus:outline-none
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                ${isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
              onClick={() => isClickable && onStepChange?.(index)}
              whileHover={isClickable ? { scale: 1.02 } : {}}
              whileTap={isClickable ? { scale: 0.98 } : {}}
            >
              {/* Step Number/Icon */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                ${isActive 
                  ? 'bg-white text-primary' 
                  : isCompleted 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              
              {/* Step Label */}
              <span className="font-medium">{step.title}</span>
            </motion.button>
            
            {/* Connector */}
            {index < steps.length - 1 && (
              <div className={`
                w-8 h-0.5 mx-1
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { 
  EnhancedTabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  TabIndicator, 
  IconTab, 
  StepTabs 
};
export default EnhancedTabs;