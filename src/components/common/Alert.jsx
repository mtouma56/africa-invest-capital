import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', title, message, dismissible = true, duration = 0, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Configuration des styles selon le type d'alerte
  const alertStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: <XCircleIcon className="w-5 h-5 text-red-400" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-400" />
    }
  };

  const style = alertStyles[type];

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Fermeture automatique si une durée est spécifiée
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`rounded-md border ${style.bg} ${style.border} p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className="ml-3 flex-1">
          <div className={`text-sm font-medium ${style.text}`}>
            {title && <p className="font-bold">{title}</p>}
            {message && <p className="mt-1">{message}</p>}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${style.text} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400`}
                onClick={handleDismiss}
              >
                <span className="sr-only">Fermer</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;