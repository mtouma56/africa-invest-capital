import { forwardRef } from 'react';

const Input = forwardRef(({ 
  type = 'text',
  as = 'input',
  label,
  error,
  className = '',
  containerClassName = '',
  id,
  disabled = false,
  icon,
  ...props
}, ref) => {
  const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const Element = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={uniqueId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <Element
          ref={ref}
          type={as === 'textarea' ? undefined : type}
          id={uniqueId}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          className={`block w-full rounded-md border ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-primary'
          } shadow-sm px-3 py-2 ${icon ? 'pl-10' : ''} ${
            disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;