import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  ...props
}, ref) => {

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-primary text-secondary hover:bg-primary-light disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-secondary text-primary hover:bg-secondary-light disabled:bg-gray-600 disabled:text-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-secondary disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    transparent: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;