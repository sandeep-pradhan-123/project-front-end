import { toast } from 'sonner';

// Define a type for toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Initialize a queue to store messages to avoid duplicate toasts
const toastQueue: Array<string> = [];

// Function to show toast if not already in the queue
const showToast = (message: string, type: ToastType) => {
  // Check if the same message is already in the queue
  if (toastQueue.includes(message)) return;

  // Add the message to the queue
  toastQueue.push(message);

  // Show the toast
  toast[type](message);

  // Remove message from queue after display or on close
  setTimeout(() => {
    const index = toastQueue.indexOf(message);
    if (index > -1) toastQueue.splice(index, 1);
  }, 3000); // Adjust duration based on toast display time
};

export const showToastSuccess = (() => {
  const type: ToastType = 'success';
  return (message: string) => showToast(message, type);
})();

export const showToastError = (() => {
  const type: ToastType = 'error';
  return (message: string) => showToast(message, type);
})();

export const showToastInfo = (() => {
  const type: ToastType = 'info';
  return (message: string) => showToast(message, type);
})();

export const showToastWarning = (() => {
  const type: ToastType = 'warning';
  return (message: string) => showToast(message, type);
})();
