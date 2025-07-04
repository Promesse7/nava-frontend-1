import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import EnhancedInput from './EnhancedInput';
import EnhancedSelect from './EnhancedSelect';
import EnhancedButton from './EnhancedButton';

// Form Context
const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

// Enhanced Form Component
const EnhancedForm = ({
  children,
  onSubmit,
  initialValues = {},
  validationSchema = {},
  className = '',
  variant = 'default',
  ...props
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setFieldTouched = (name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  };

  const validateField = (name, value) => {
    const validator = validationSchema[name];
    if (!validator) return '';

    if (typeof validator === 'function') {
      return validator(value, values) || '';
    }

    if (validator.required && (!value || value.toString().trim() === '')) {
      return validator.message || `${name} is required`;
    }

    if (validator.min && value && value.length < validator.min) {
      return validator.message || `${name} must be at least ${validator.min} characters`;
    }

    if (validator.max && value && value.length > validator.max) {
      return validator.message || `${name} must be at most ${validator.max} characters`;
    }

    if (validator.pattern && value && !validator.pattern.test(value)) {
      return validator.message || `${name} is invalid`;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    submitAttempted,
    setValue,
    setFieldTouched,
    validateField,
  };

  const variantClasses = {
    default: 'space-y-6',
    compact: 'space-y-4',
    spacious: 'space-y-8',
  };

  return (
    <FormContext.Provider value={contextValue}>
      <motion.form
        onSubmit={handleSubmit}
        className={`${variantClasses[variant]} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.form>
    </FormContext.Provider>
  );
};

// Form Field Component
const FormField = ({
  name,
  label,
  type = 'text',
  component = 'input',
  placeholder,
  helper,
  required = false,
  options = [],
  className = '',
  ...props
}) => {
  const { values, errors, touched, setValue, setFieldTouched, validateField, submitAttempted } = useForm();
  
  const value = values[name] || '';
  const error = (touched[name] || submitAttempted) ? errors[name] : '';
  const hasError = !!error;

  const handleChange = (newValue) => {
    setValue(name, newValue);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
    const fieldError = validateField(name, value);
    if (fieldError) {
      setValue(name, value); // Trigger error update
    }
  };

  const commonProps = {
    value,
    onChange: component === 'select' ? handleChange : (e) => handleChange(e.target.value),
    onBlur: handleBlur,
    placeholder,
    disabled: props.disabled,
    required,
    error: hasError ? error : undefined,
    ...props,
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {component === 'input' && (
        <EnhancedInput
          label={label}
          type={type}
          helper={helper}
          {...commonProps}
        />
      )}
      
      {component === 'select' && (
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <EnhancedSelect
            options={options}
            placeholder={placeholder}
            {...commonProps}
            onChange={handleChange}
            value={options.find(opt => opt.value === value) || null}
          />
          {helper && !hasError && (
            <p className="text-sm text-gray-500">{helper}</p>
          )}
          {hasError && (
            <motion.p
              className="text-sm text-red-600"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      )}
      
      {component === 'textarea' && (
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <motion.textarea
            className={`
              w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
              focus:border-primary focus:ring-4 focus:ring-primary/10 
              transition-all duration-200 resize-none
              ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            `}
            rows={4}
            {...commonProps}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
          {helper && !hasError && (
            <p className="text-sm text-gray-500">{helper}</p>
          )}
          {hasError && (
            <motion.p
              className="text-sm text-red-600"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Form Submit Button
const FormSubmitButton = ({
  children = 'Submit',
  variant = 'primary',
  size = 'lg',
  className = '',
  loadingText = 'Submitting...',
  ...props
}) => {
  const { isSubmitting } = useForm();

  return (
    <EnhancedButton
      type="submit"
      variant={variant}
      size={size}
      loading={isSubmitting}
      className={`w-full ${className}`}
      {...props}
    >
      {isSubmitting ? loadingText : children}
    </EnhancedButton>
  );
};

// Form Section Component
const FormSection = ({
  title,
  description,
  children,
  className = '',
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      className={`border border-gray-200 rounded-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <div className={`flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
             onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {collapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-gray-500" />
            </motion.div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Form Validation Helpers
export const createValidator = {
  required: (message = 'This field is required') => ({
    required: true,
    message
  }),
  
  minLength: (min, message) => ({
    min,
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max, message) => ({
    max,
    message: message || `Must be at most ${max} characters`
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message
  }),
  
  phone: (message = 'Please enter a valid phone number') => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message
  }),
  
  custom: (validator, message) => (value, values) => {
    return validator(value, values) ? '' : message;
  }
};

export { EnhancedForm, FormField, FormSubmitButton, FormSection };
export default EnhancedForm;