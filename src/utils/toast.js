import { toast } from 'react-hot-toast';

const defaultOptions = {
  duration: 4000,
};

export const showSuccess = (message) =>
  toast.success(message, defaultOptions);

export const showError = (message) =>
  toast.error(message, defaultOptions);
