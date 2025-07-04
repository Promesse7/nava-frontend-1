import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import EnhancedButton from './EnhancedButton';

const EnhancedModal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  showCloseButton = true,
  preventClose = false,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  
  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length) {
        focusableElements[0].focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, preventClose]);
  
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
  };
  
  const variantClasses = {
    default: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    glass: 'bg-white/95 backdrop-blur-lg border border-white/20',
    elegant: 'bg-gradient-to-br from-white to-gray-50',
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={closeOnOverlayClick && !preventClose ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            className={`
              relative rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden
              ${sizeClasses[size]} ${variantClasses[variant]} ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  {title && (
                    <motion.h2 
                      className="text-xl font-semibold text-gray-900 truncate"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {title}
                    </motion.h2>
                  )}
                  {description && (
                    <motion.p 
                      className="text-sm text-gray-600 mt-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
                
                {showCloseButton && !preventClose && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <EnhancedButton
                      variant="ghost"
                      size="icon-sm"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 ml-4"
                    >
                      <X size={20} />
                    </EnhancedButton>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Content */}
            <motion.div 
              className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Modal subcomponents for better composition
const ModalHeader = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const ModalContent = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-100 flex items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);

// Confirmation Modal
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'default',
  loading = false,
  ...props
}) => {
  const variants = {
    default: { icon: AlertCircle, color: 'text-blue-600' },
    danger: { icon: AlertTriangle, color: 'text-red-600' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600' },
    success: { icon: CheckCircle, color: 'text-green-600' },
    info: { icon: Info, color: 'text-blue-600' },
  };
  
  const IconComponent = variants[variant].icon;
  
  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      {...props}
    >
      <div className="text-center">
        <motion.div
          className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 ${variants[variant].color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <IconComponent size={24} />
        </motion.div>
        
        <motion.h3 
          className="text-lg font-semibold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-600 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {message}
        </motion.p>
        
        <motion.div 
          className="flex gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <EnhancedButton
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </EnhancedButton>
          <EnhancedButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </EnhancedButton>
        </motion.div>
      </div>
    </EnhancedModal>
  );
};

export { EnhancedModal, ModalHeader, ModalContent, ModalFooter, ConfirmationModal };
export default EnhancedModal;