import React from 'react';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  animate?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  hoverEffect?: boolean;
  glass?: boolean;
  gradient?: boolean;
  gradientDirection?: 'top-bottom' | 'left-right' | 'diagonal';
  gradientColors?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  elevation = 'medium',
  animate = false,
  onClick,
  padding = 'medium',
  border = false,
  hoverEffect = true,
  glass = false,
  gradient = false,
  gradientDirection = 'diagonal',
  gradientColors = 'from-primary-500/10 to-secondary-500/10',
}) => {
  // Base styles
  const baseClasses = 'card-modern rounded-lg overflow-hidden transition-all duration-300';
  
  // Elevation classes
  const elevationClasses = {
    flat: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  };

  // Border class
  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  
  // Hover effect class
  const hoverClass = hoverEffect ? 'hover:shadow-xl hover:-translate-y-1' : '';
  
  // Cursor class
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  // Glass effect
  const glassClass = glass ? 'glass-effect backdrop-blur-md bg-white/70 dark:bg-gray-900/70' : 'bg-white dark:bg-gray-800';
  
  // Gradient effect
  const gradientClass = gradient ? `bg-gradient-to-${gradientDirection === 'top-bottom' ? 'b' : gradientDirection === 'left-right' ? 'r' : 'br'} ${gradientColors}` : '';

  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${elevationClasses[elevation]}
    ${paddingClasses[padding]}
    ${borderClass}
    ${hoverClass}
    ${cursorClass}
    ${glass ? glassClass : ''}
    ${gradient ? gradientClass : !glass ? 'bg-white dark:bg-gray-800' : ''}
    ${className}
  `;

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    hover: { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  };

  return animate ? (
    <motion.div
      className={cardClasses}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={hoverEffect ? "hover" : undefined}
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  ) : (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default ModernCard;