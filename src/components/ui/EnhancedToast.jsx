import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Zap } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const EnhancedToast = ({ toast, onRemove, position = 'top-right' }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Zap,
  };
  
  const variants = {
    success: {
      icon: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      progress: 'bg-green-500',
    },
    error: {
      icon: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      progress: 'bg-red-500',
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      progress: 'bg-yellow-500',
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      progress: 'bg-blue-500',
    },
    loading: {
      icon: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-200',
      progress: 'bg-gray-500',
    },
  };
  
  const IconComponent = icons[toast.type];
  const variant = variants[toast.type];
  
  const animationVariants = {
    'top-right': {
      initial: { opacity: 0, x: 300, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.95 },
    },
    'top-left': {
      initial: { opacity: 0, x: -300, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -300, scale: 0.95 },
    },
    'bottom-right': {
      initial: { opacity: 0, x: 300, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.95 },
    },
    'bottom-left': {
      initial: { opacity: 0, x: -300, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -300, scale: 0.95 },
    },
    'top-center': {
      initial: { opacity: 0, y: -50, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -50, scale: 0.95 },
    },
    'bottom-center': {
      initial: { opacity: 0, y: 50, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 50, scale: 0.95 },
    },
  };

  return (
    <motion.div
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full
        ${variant.bg} backdrop-blur-sm overflow-hidden
      `}
      variants={animationVariants[position]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      layout
    >
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${variant.progress} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
      
      {/* Icon */}
      <motion.div 
        className={`flex-shrink-0 mt-0.5 ${variant.icon}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IconComponent size={20} />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <motion.h4 
            className="text-sm font-semibold text-gray-900 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {toast.title}
          </motion.h4>
        )}
        
        <motion.p 
          className="text-sm text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {toast.message}
        </motion.p>
        
        {toast.action && (
          <motion.div 
            className="mt-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium text-primary hover:text-primary/80 underline transition-colors"
            >
              {toast.action.label}
            </button>
          </motion.div>
        )}
      </div>

      {/* Close button */}
      <motion.button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
};

export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    
    setToasts(prev => {
      const newToasts = [...prev, newToast];
      // Keep only the maximum number of toasts
      return newToasts.slice(-maxToasts);
    });

    // Auto remove after duration
    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    loading: (message, options = {}) => addToast({ type: 'loading', message, duration: 0, ...options }),
    custom: (options) => addToast(options),
    dismiss: removeToast,
    dismissAll: removeAllToasts,
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast, removeAllToasts }}>
      {children}
      
      {/* Toast container */}
      <div className={`fixed z-50 space-y-2 ${positionClasses[position]}`}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <EnhancedToast
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default EnhancedToast;