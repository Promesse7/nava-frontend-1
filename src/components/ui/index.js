// Enhanced Component Library Index
// Elegant Black & White Design System Components

// Core Components
export { default as EnhancedButton } from './EnhancedButton';
export { default as EnhancedCard, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './EnhancedCard';
export { default as EnhancedInput } from './EnhancedInput';
export { default as EnhancedSelect } from './EnhancedSelect';

// Layout & Navigation
export { 
  default as EnhancedTabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  TabIndicator, 
  IconTab, 
  StepTabs 
} from './EnhancedTabs';

// Feedback & Overlays
export { default as EnhancedModal, ModalHeader, ModalContent, ModalFooter, ConfirmationModal } from './EnhancedModal';
export { default as EnhancedToast, ToastProvider, useToast } from './EnhancedToast';
export { default as EnhancedLoadingSpinner, Skeleton } from './EnhancedLoadingSpinner';

// Progress & Status
export { 
  default as ProgressIndicator, 
  LinearProgress, 
  CircularProgress 
} from './ProgressIndicator';

// Forms & Data Entry
export { 
  default as EnhancedForm, 
  FormField, 
  FormSubmitButton, 
  FormSection,
  createValidator,
  useForm
} from './EnhancedForm';

// Legacy Components (to maintain compatibility)
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Modal } from './Modal';
export { default as Toast } from './Toast';
export { default as LoadingSpinner } from './LoadingSpinner';

// Component Utilities
export const componentTheme = {
  colors: {
    primary: '#000000',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    elegant: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
    dramatic: '0 8px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    pulse: 'pulse 2s infinite',
  }
};

// Design System Utilities
export const designTokens = {
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'JetBrains Mono, Monaco, Consolas, monospace',
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  borderRadius: {
    sm: '0.25rem',     // 4px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    full: '9999px',
  },
};

// Component Composition Utilities
export const createComponentVariant = (baseComponent, variants) => {
  return ({ variant = 'default', ...props }) => {
    const variantProps = variants[variant] || variants.default;
    return baseComponent({ ...variantProps, ...props });
  };
};

export const withEnhancedProps = (Component) => {
  return React.forwardRef(({ className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`transition-all duration-200 ${className}`}
        {...props}
      />
    );
  });
};

// Animation Presets
export const animationPresets = {
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },
  
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  },
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
};

// Export all for easy access
export default {
  // Components
  EnhancedButton,
  EnhancedCard,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTabs,
  EnhancedModal,
  EnhancedToast,
  EnhancedLoadingSpinner,
  ProgressIndicator,
  EnhancedForm,
  
  // Utilities
  componentTheme,
  designTokens,
  animationPresets,
  createComponentVariant,
  withEnhancedProps,
};