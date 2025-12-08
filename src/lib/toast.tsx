/**
 * Enhanced toast notifications with custom animations
 * Wraps sonner with success micro-animations and custom styling
 */

import { toast as sonnerToast, ExternalToast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { ANIMATION, SEMANTIC_COLORS } from "@/lib/design-tokens";

/**
 * Custom success toast with check animation
 */
export function toastSuccess(message: string, data?: ExternalToast) {
  return sonnerToast.success(message, {
    ...data,
    icon: (
      <div className={`animate-in zoom-in-50 ${ANIMATION.duration.normal}`}>
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
      </div>
    ),
    className: `animate-in slide-in-from-top-2 ${ANIMATION.duration.normal}`,
  });
}

/**
 * Custom error toast with shake animation
 */
export function toastError(message: string, data?: ExternalToast) {
  return sonnerToast.error(message, {
    ...data,
    icon: (
      <div className={`animate-in zoom-in-50 ${ANIMATION.duration.normal}`}>
        <XCircle className={`h-5 w-5 ${SEMANTIC_COLORS.alert.critical.icon}`} />
      </div>
    ),
    className: `animate-in slide-in-from-top-2 ${ANIMATION.duration.normal}`,
  });
}

/**
 * Custom warning toast
 */
export function toastWarning(message: string, data?: ExternalToast) {
  return sonnerToast.warning(message, {
    ...data,
    icon: (
      <div className={`animate-in zoom-in-50 ${ANIMATION.duration.normal}`}>
        <AlertCircle className={`h-5 w-5 ${SEMANTIC_COLORS.alert.warning.icon}`} />
      </div>
    ),
    className: `animate-in slide-in-from-top-2 ${ANIMATION.duration.normal}`,
  });
}

/**
 * Custom info toast
 */
export function toastInfo(message: string, data?: ExternalToast) {
  return sonnerToast.info(message, {
    ...data,
    icon: (
      <div className={`animate-in zoom-in-50 ${ANIMATION.duration.normal}`}>
        <Info className={`h-5 w-5 ${SEMANTIC_COLORS.alert.info.icon}`} />
      </div>
    ),
    className: `animate-in slide-in-from-top-2 ${ANIMATION.duration.normal}`,
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
