import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'gradient' | 'gradient-cool' | 'gradient-warm';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  withRipple?: boolean;
  animate?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  icon,
  iconPosition = 'left',
  rounded = 'md',
  withRipple = true,
  animate = true,
}) => {
  // Base classes
  const baseClasses = 'btn-modern inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500',
    success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-500',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 focus:ring-primary-500',
    gradient: 'gradient-primary text-white focus:ring-primary-500',
    'gradient-cool': 'gradient-cool text-white focus:ring-primary-500',
    'gradient-warm': 'gradient-warm text-white focus:ring-warning-500',
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  // Loading state
  const loadingContent = (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </>
  );
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `;
  
  // Icon rendering
  const renderContent = () => {
    if (isLoading) return loadingContent;
    
    if (icon) {
      return iconPosition === 'left' ? (
        <>
          <span className="mr-2">{icon}</span>
          {children}
        </>
      ) : (
        <>
          {children}
          <span className="ml-2">{icon}</span>
        </>
      );
    }
    
    return children;
  };
  
  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } },
  };
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses}
        style={animate ? { display: 'inline-flex' } : undefined}
      >
        {animate ? (
          <motion.span
            className="inline-flex items-center justify-center w-full"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            {renderContent()}
          </motion.span>
        ) : (
          renderContent()
        )}
      </Link>
    );
  }
  
  // Render as button
  return animate ? (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      variants={buttonVariants}
    >
      {renderContent()}
    </motion.button>
  ) : (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {renderContent()}
    </button>
  );
};

export default ModernButton;