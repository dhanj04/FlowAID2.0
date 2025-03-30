import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'warning' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  icon,
  iconPosition = 'left',
  rounded = 'md',
}: ButtonProps) {
  
  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden relative";
  
  // Variant styles
  const variantStyles = {
    primary: "bg-primary hover:bg-primary-600 focus:ring-primary-500 text-white shadow-md hover:shadow-lg",
    secondary: "bg-secondary hover:bg-secondary-600 focus:ring-secondary-500 text-white shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary-50 dark:hover:bg-gray-800 focus:ring-primary-500 hover:border-primary-600 hover:text-primary-600",
    ghost: "text-primary hover:bg-primary-50 dark:hover:bg-gray-800 focus:ring-primary-500",
    success: "bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white shadow-md hover:shadow-lg",
    danger: "bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white shadow-md hover:shadow-lg",
    warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white shadow-md hover:shadow-lg",
    gradient: "bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 focus:ring-primary-500 text-white shadow-md hover:shadow-lg",
  };
  
  // Size styles
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 space-x-1.5",
    md: "text-sm px-5 py-2.5 space-x-2",
    lg: "text-base px-7 py-3.5 space-x-3",
    xl: "text-lg px-9 py-4 space-x-4"
  };
  
  // Rounded styles
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };
  
  // Loading state
  const loadingState = isLoading ? "opacity-80 cursor-wait" : "";
  
  // Disabled state
  const disabledState = disabled ? "opacity-60 cursor-not-allowed" : "";
  
  // Full width
  const widthClass = fullWidth ? "w-full" : "";
  
  // Rounded style
  const roundedClass = roundedStyles[rounded];
  
  // Combined classes
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedClass} ${loadingState} ${disabledState} ${widthClass} ${className}`;
  
  // Render as link or button
  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link href={href} className={buttonClasses}>
          {isLoading ? (
            <span className="mr-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : icon && iconPosition === 'left' ? (
            <span className="mr-2">{icon}</span>
          ) : null}
          <span>{children}</span>
          {icon && iconPosition === 'right' && !isLoading ? (
            <span className="ml-2">{icon}</span>
          ) : null}
          
          {/* Hover effect overlay */}
          {variant === 'primary' || variant === 'secondary' || variant === 'gradient' ? (
            <span className="absolute inset-0 h-full w-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-inherit"></span>
          ) : null}
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`group ${buttonClasses}`}
      >
        {isLoading ? (
          <span className="mr-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : icon && iconPosition === 'left' ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        <span>{children}</span>
        {icon && iconPosition === 'right' && !isLoading ? (
          <span className="ml-2">{icon}</span>
        ) : null}
        
        {/* Hover effect overlay */}
        {variant === 'primary' || variant === 'secondary' || variant === 'gradient' ? (
          <span className="absolute inset-0 h-full w-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-inherit"></span>
        ) : null}
      </button>
    </motion.div>
  );
}