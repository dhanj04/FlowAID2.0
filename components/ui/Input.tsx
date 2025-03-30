import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'underlined';
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = false,
  startIcon,
  endIcon,
  variant = 'outlined',
  containerClassName = '',
  className = '',
  id,
  required,
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const variantClasses = {
    outlined: `border border-gray-300 dark:border-gray-600 bg-transparent
               focus:ring-2 focus:ring-primary focus:border-primary
               dark:focus:ring-primary-light dark:focus:border-primary-light
               ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`,
    filled: `border-0 bg-gray-100 dark:bg-gray-700
             focus:ring-2 focus:ring-primary
             dark:focus:ring-primary-light
             ${error ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500' : ''}`,
    underlined: `border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0
                focus:ring-0 focus:border-b-2 focus:border-primary
                dark:focus:border-primary-light
                ${error ? 'border-red-500 focus:border-red-500' : ''}`,
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const inputClasses = `
    block py-2.5 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    rounded-md focus:outline-none transition duration-200
    disabled:opacity-60 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${disabledClasses}
    ${className}
  `;
  
  const labelClasses = `
    block mb-2 text-sm font-medium
    ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
    ${disabled ? 'opacity-60' : ''}
  `;
  
  const helperTextClasses = `
    mt-1.5 text-sm
    ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
  `;
  
  return (
    <div className={`${widthClasses} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className={`text-gray-500 dark:text-gray-400 ${error ? 'text-red-500' : ''}`}>
              {startIcon}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          disabled={disabled}
          className={`
            ${inputClasses}
            ${startIcon ? 'pl-10' : ''}
            ${endIcon ? 'pr-10' : ''}
          `}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className={`text-gray-500 dark:text-gray-400 ${error ? 'text-red-500' : ''}`}>
              {endIcon}
            </span>
          </div>
        )}
      </div>
      
      {helperText && (
        <p className={helperTextClasses}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
