import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  animate?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const ModernInput: React.FC<ModernInputProps> = ({
  label,
  helperText,
  error,
  startIcon,
  endIcon,
  variant = 'outlined',
  fullWidth = false,
  animate = true,
  className = '',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  helperTextClassName = '',
  errorClassName = '',
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    // Check if input has value
    if (inputRef.current) {
      setHasValue(!!inputRef.current.value);
    }
  }, [props.value, props.defaultValue]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (props.onChange) props.onChange(e);
  };

  // Base container classes
  const containerBaseClasses = `relative ${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`;

  // Variant specific classes
  const variantClasses = {
    outlined: {
      container: '',
      input: `input-modern border-2 bg-transparent ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-200' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-400 dark:focus:ring-primary-900/20'} rounded-lg px-4 py-2 w-full transition-all duration-200`,
      label: `absolute left-3 transition-all duration-200 pointer-events-none ${isFocused || hasValue ? '-top-2.5 text-xs px-1 bg-white dark:bg-gray-800' : 'top-2.5 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
    filled: {
      container: '',
      input: `input-modern border-b-2 border-t-0 border-x-0 rounded-none px-4 pt-6 pb-2 w-full transition-all duration-200 ${error ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-500 focus:border-danger-500' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400'}`,
      label: `absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || hasValue ? 'top-1 text-xs' : 'top-4 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
    underlined: {
      container: '',
      input: `input-modern border-t-0 border-x-0 border-b-2 rounded-none px-4 py-2 w-full transition-all duration-200 bg-transparent ${error ? 'border-danger-500 focus:border-danger-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400'}`,
      label: `absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || hasValue ? '-top-5 text-xs' : 'top-2 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
  };

  // Icon container classes
  const iconContainerClasses = 'absolute top-1/2 transform -translate-y-1/2';

  return (
    <div className={`${containerBaseClasses} ${className}`}>
      <div className="relative">
        {startIcon && (
          <div className={`${iconContainerClasses} left-3`}>
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          ref={inputRef}
          className={`${variantClasses[variant].input} ${startIcon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''} ${inputClassName}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {label && (
          <label 
            htmlFor={inputId} 
            className={`${variantClasses[variant].label} ${labelClassName} ${startIcon && (variant === 'outlined') ? 'left-10' : ''}`}
          >
            {label}
          </label>
        )}

        {endIcon && (
          <div className={`${iconContainerClasses} right-3`}>
            {endIcon}
          </div>
        )}
      </div>

      <AnimatePresence>
        {(helperText || error) && (
          <motion.div
            initial={animate ? { opacity: 0, y: -10 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            exit={animate ? { opacity: 0, y: -10 } : undefined}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-xs"
          >
            {error ? (
              <span className={`text-danger-500 ${errorClassName}`}>{error}</span>
            ) : helperText ? (
              <span className={`text-gray-500 dark:text-gray-400 ${helperTextClassName}`}>{helperText}</span>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernInput;