import React from 'react';
import { motion } from 'framer-motion';

interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  dot?: boolean;
  outline?: boolean;
  pill?: boolean;
}

const ModernBadge: React.FC<ModernBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animate = false,
  dot = false,
  outline = false,
  pill = true,
}) => {
  // Base classes
  const baseClasses = 'badge-modern inline-flex items-center justify-center font-medium';
  
  // Variant classes
  const variantClasses = {
    primary: outline 
      ? 'bg-transparent text-primary-600 border border-primary-500 dark:text-primary-400 dark:border-primary-400' 
      : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    secondary: outline 
      ? 'bg-transparent text-secondary-600 border border-secondary-500 dark:text-secondary-400 dark:border-secondary-400' 
      : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
    accent: outline 
      ? 'bg-transparent text-accent-600 border border-accent-500 dark:text-accent-400 dark:border-accent-400' 
      : 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
    success: outline 
      ? 'bg-transparent text-success-600 border border-success-500 dark:text-success-400 dark:border-success-400' 
      : 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    warning: outline 
      ? 'bg-transparent text-warning-600 border border-warning-500 dark:text-warning-400 dark:border-warning-400' 
      : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    danger: outline 
      ? 'bg-transparent text-danger-600 border border-danger-500 dark:text-danger-400 dark:border-danger-400' 
      : 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    default: outline 
      ? 'bg-transparent text-gray-600 border border-gray-500 dark:text-gray-400 dark:border-gray-400' 
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };
  
  // Size classes
  const sizeClasses = {
    xs: dot ? 'text-xs px-1' : 'text-xs px-1.5 py-0.5',
    sm: dot ? 'text-xs px-1.5' : 'text-xs px-2 py-0.5',
    md: dot ? 'text-sm px-1.5' : 'text-sm px-2.5 py-0.5',
    lg: dot ? 'text-base px-2' : 'text-base px-3 py-1',
  };
  
  // Pill shape
  const pillClasses = pill ? 'rounded-full' : 'rounded-md';
  
  // Dot style
  const dotContent = dot ? (
    <>
      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${variant !== 'default' ? `bg-${variant}-500` : 'bg-gray-500'}`}></span>
      {children}
    </>
  ) : children;
  
  // Combine all classes
  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${pillClasses}
    ${className}
  `;
  
  // Animation variants
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };
  
  return animate ? (
    <motion.span
      className={badgeClasses}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={badgeVariants}
      transition={{ duration: 0.2 }}
    >
      {dotContent}
    </motion.span>
  ) : (
    <span className={badgeClasses}>
      {dotContent}
    </span>
  );
};

export default ModernBadge;