import React from 'react';
import { motion } from 'framer-motion';

const EnhancedCard = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = false,
  glass = false,
  clickable = false,
  bordered = true,
  rounded = 'lg',
  shadow = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'card relative transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800 
      ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
      ${hover ? 'hover:shadow-lg dark:hover:shadow-gray-900/30 hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
    elevated: `
      bg-white dark:bg-gray-800 border-0
      ${hover ? 'hover:shadow-xl dark:hover:shadow-gray-900/40 hover:-translate-y-2' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
    minimal: `
      bg-transparent border-0
      ${hover ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
      ${bordered ? 'border border-gray-100 dark:border-gray-700' : ''}
      ${hover ? 'hover:shadow-lg dark:hover:shadow-gray-900/30 hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
    dark: `
      bg-gray-900 text-white border border-gray-800
      ${hover ? 'hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
    outline: `
      bg-transparent border-2 border-indigo-500 dark:border-indigo-400
      ${hover ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-lg hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500' : ''}
    `,
    colored: `
      bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100
      ${bordered ? 'border border-indigo-100 dark:border-indigo-800' : ''}
      ${hover ? 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:shadow-lg hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer' : ''}
    `,
  };
  
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  
  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-md',
    xl: 'shadow-lg',
    '2xl': 'shadow-xl',
    inner: 'shadow-inner',
  };
  
  const glassClasses = glass ? 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-white/20 dark:border-gray-800/20' : '';
  const glowClasses = glow ? 'shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5' : '';
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${paddingClasses[padding]} 
    ${roundedClasses[rounded]}
    ${shadowClasses[shadow]}
    ${glassClasses} 
    ${glowClasses} 
    ${className}
  `.trim();
  
  return (
    <motion.div
      className={classes}
      onClick={clickable ? onClick : undefined}
      whileHover={hover && clickable ? { scale: 1.01 } : {}}
      whileTap={clickable ? { scale: 0.99 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <div className={`absolute inset-0 ${roundedClasses[rounded]} bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      )}
      
      {children}
    </motion.div>
  );
};

// Card subcomponents for better composition
const CardHeader = ({ 
  children, 
  className = '',
  bordered = true,
  actions = null
}) => (
  <div className={`px-6 py-4 ${bordered ? 'border-b border-gray-200 dark:border-gray-700' : ''} ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {children}
      </div>
      {actions && (
        <div className="flex items-center ml-4">
          {actions}
        </div>
      )}
    </div>
  </div>
);

const CardContent = ({ 
  children, 
  className = '',
  padding = 'default'
}) => {
  const paddingClasses = {
    none: 'p-0',
    tight: 'px-4 py-3',
    default: 'p-6',
    loose: 'p-8',
  };
  
  return (
    <div className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '',
  bordered = true,
  align = 'between'
}) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  return (
    <div className={`px-6 py-4 ${bordered ? 'border-t border-gray-200 dark:border-gray-700' : ''} flex items-center ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ 
  children, 
  className = '',
  as = 'h3',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };
  
  const Component = as;
  
  return (
    <Component className={`font-semibold text-gray-900 dark:text-white ${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
};

const CardDescription = ({ 
  children, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <p className={`text-gray-500 dark:text-gray-400 mt-1 ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  );
};

// Card with image component
const ImageCard = ({
  image,
  alt = '',
  imagePosition = 'top',
  imageHeight = 'h-48',
  children,
  ...props
}) => {
  const imagePositionClasses = {
    top: 'flex-col',
    bottom: 'flex-col-reverse',
    left: 'flex-row',
    right: 'flex-row-reverse',
  };
  
  return (
    <EnhancedCard 
      padding="none" 
      className={`overflow-hidden flex ${imagePositionClasses[imagePosition]}`}
      {...props}
    >
      <div className={`${
        imagePosition === 'left' || imagePosition === 'right' 
          ? 'w-1/3 ' + imageHeight
          : 'w-full ' + imageHeight
      } bg-gray-200 dark:bg-gray-700 relative overflow-hidden`}>
        {image && (
          <img 
            src={image} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
      </div>
      <div className={`${
        imagePosition === 'left' || imagePosition === 'right' 
          ? 'w-2/3'
          : 'w-full'
      }`}>
        {children}
      </div>
    </EnhancedCard>
  );
};

// Stat Card component
const StatCard = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  ...props
}) => {
  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };
  
  return (
    <EnhancedCard padding="md" {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`mt-1 text-sm ${trendClasses[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

export { 
  EnhancedCard, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription,
  ImageCard,
  StatCard
};

export default EnhancedCard;