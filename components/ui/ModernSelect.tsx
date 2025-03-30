import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ModernSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  optionClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  startIcon?: React.ReactNode;
  id?: string;
}

const ModernSelect: React.FC<ModernSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  variant = 'outlined',
  className = '',
  containerClassName = '',
  labelClassName = '',
  selectClassName = '',
  optionClassName = '',
  errorClassName = '',
  helperTextClassName = '',
  startIcon,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    
    setSelectedValue(option.value);
    setIsOpen(false);
    
    if (onChange) {
      onChange(option.value);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  // Base container classes
  const containerBaseClasses = `relative ${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`;

  // Variant specific classes
  const variantClasses = {
    outlined: {
      container: '',
      select: `flex items-center justify-between border-2 bg-transparent ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-200' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-400 dark:focus:ring-primary-900/20'} rounded-lg px-4 py-2 w-full transition-all duration-200`,
      label: `absolute left-3 transition-all duration-200 pointer-events-none ${isFocused || selectedValue ? '-top-2.5 text-xs px-1 bg-white dark:bg-gray-800' : 'top-2.5 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
    filled: {
      container: '',
      select: `flex items-center justify-between border-b-2 border-t-0 border-x-0 rounded-none px-4 pt-6 pb-2 w-full transition-all duration-200 ${error ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-500 focus:border-danger-500' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400'}`,
      label: `absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || selectedValue ? 'top-1 text-xs' : 'top-4 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
    underlined: {
      container: '',
      select: `flex items-center justify-between border-t-0 border-x-0 border-b-2 rounded-none px-4 py-2 w-full transition-all duration-200 bg-transparent ${error ? 'border-danger-500 focus:border-danger-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400'}`,
      label: `absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || selectedValue ? '-top-5 text-xs' : 'top-2 text-base'} ${error ? 'text-danger-500' : isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`,
    },
  };

  return (
    <div className={`${containerBaseClasses} ${className}`}>
      <div ref={selectRef} className="relative">
        <div
          className={`${variantClasses[variant].select} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${startIcon ? 'pl-10' : ''} ${selectClassName}`}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? selectId : undefined}
          id={selectId}
        >
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {startIcon}
            </div>
          )}
          
          <span className={`block truncate ${!selectedValue ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none"
          >
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </motion.div>
        </div>

        {label && (
          <label 
            htmlFor={selectId} 
            className={`${variantClasses[variant].label} ${labelClassName} ${startIcon && (variant === 'outlined') ? 'left-10' : ''}`}
          >
            {label}{required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
              tabIndex={-1}
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${option.value === selectedValue ? 'bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'} relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${optionClassName}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === selectedValue}
                >
                  <span className="block truncate">{option.label}</span>
                  {option.value === selectedValue && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(helperText || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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

export default ModernSelect;