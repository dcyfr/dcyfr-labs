/**
 * Enhanced toast notifications with custom animations
 * Wraps sonner with success micro-animations and custom styling
 */

import { toast as sonnerToast, ExternalToast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

/**
 * Custom success toast with check animation
 */
export function toastSuccess(message: string, data?: ExternalToast) {
  return sonnerToast.success(message, {
    ...data,
    icon: (
      <div className="animate-in zoom-in-50 duration-300">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      </div>
    ),
    className: "animate-in slide-in-from-top-2 duration-300",
  });
}

/**
 * Custom error toast with shake animation
 */
export function toastError(message: string, data?: ExternalToast) {
  return sonnerToast.error(message, {
    ...data,
    icon: (
      <div className="animate-in zoom-in-50 duration-300">
        <XCircle className="h-5 w-5 text-red-500" />
      </div>
    ),
    className: "animate-in slide-in-from-top-2 duration-300",
  });
}

/**
 * Custom warning toast
 */
export function toastWarning(message: string, data?: ExternalToast) {
  return sonnerToast.warning(message, {
    ...data,
    icon: (
      <div className="animate-in zoom-in-50 duration-300">
        <AlertCircle className="h-5 w-5 text-amber-500" />
      </div>
    ),
    className: "animate-in slide-in-from-top-2 duration-300",
  });
}

/**
 * Custom info toast
 */
export function toastInfo(message: string, data?: ExternalToast) {
  return sonnerToast.info(message, {
    ...data,
    icon: (
      <div className="animate-in zoom-in-50 duration-300">
        <Info className="h-5 w-5 text-blue-500" />
      </div>
    ),
    className: "animate-in slide-in-from-top-2 duration-300",
  });
}

/**
 * Enhanced toast object with all variants
 */
export const toast = {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  // Pass through other sonner toast methods
  promise: sonnerToast.promise,
  loading: sonnerToast.loading,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
  message: sonnerToast.message,
};
