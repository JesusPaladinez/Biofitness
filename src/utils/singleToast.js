import toast from 'react-hot-toast';

const dismissAnd = (fn, message, options) => {
  toast.dismiss();
  return fn(message, options);
};

export const singleToast = {
  success: (message, options) => dismissAnd(toast.success, message, options),
  error: (message, options) => dismissAnd(toast.error, message, options),
  loading: (message, options) => dismissAnd(toast.loading, message, options),
  promise: (promise, messages, options) => {
    toast.dismiss();
    return toast.promise(promise, messages, options);
  },
  custom: (message, options) => {
    toast.dismiss();
    return toast.custom(message, options);
  },
  dismiss: () => toast.dismiss(),
};

