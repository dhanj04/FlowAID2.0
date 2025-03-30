import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  animate?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'medium',
  animate = false,
  onClick,
  padding = 'medium',
  border = false,
  hoverEffect = false,
}) => {
  const elevationClasses = {
    flat: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  };

  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverClass = hoverEffect ? 'transition-shadow duration-200 hover:shadow-xl' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  const cardClasses = `
    bg-white dark:bg-gray-800 rounded-lg
    ${elevationClasses[elevation]}
    ${paddingClasses[padding]}
    ${borderClass}
    ${hoverClass}
    ${cursorClass}
    ${className}
  `;

  const cardProps = {
    className: cardClasses,
    onClick,
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...cardProps}
      >
        {children}
      </motion.div>
    );
  }

  return <div {...cardProps}>{children}</div>;
};

export default Card;
