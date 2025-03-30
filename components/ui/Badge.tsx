import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    outline: 'bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600',
  };

  const dotColorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-blue-500',
    outline: 'bg-gray-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const shapeClasses = rounded ? 'rounded-full' : 'rounded-md';

  const badgeClasses = `
    inline-flex items-center border font-medium
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${shapeClasses}
    ${className}
  `;

  if (dot) {
    return (
      <span className="inline-flex items-center">
        <span 
          className={`w-2.5 h-2.5 ${rounded ? 'rounded-full' : 'rounded-sm'} ${dotColorClasses[variant]} mr-1.5`}
        ></span>
        <span className="text-gray-700 dark:text-gray-300">{children}</span>
      </span>
    );
  }

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;
