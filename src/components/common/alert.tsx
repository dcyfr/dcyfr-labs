"use client";

import * as React from "react";
import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";

/**
 * Alert Banner Component for MDX
 * 
 * Displays styled alert banners with icons and content.
 * Supports multiple severity levels: warning, critical, info, success
 * 
 * @component
 * @param {Object} props - Component props
 * @param {'critical' | 'warning' | 'info' | 'success'} props.type - Alert type/severity
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.className - Additional CSS classes
 * 
 * @example
 * ```mdx
 * <Alert type="critical">
 *   **CRITICAL UPDATE:** This is very important!
 * </Alert>
 * 
 * <Alert type="warning">
 *   Please note this important information.
 * </Alert>
 * 
 * <Alert type="info">
 *   Here's some helpful information.
 * </Alert>
 * ```
 */

export interface AlertProps {
  type?: 'critical' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
  className?: string;
}

const alertStyles = {
  critical: {
    container: 'border-l-4 border-l-red-500/60 bg-red-500/10 text-red-900 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border border-red-500/20',
    label: 'text-red-700 dark:text-red-300',
  },
  warning: {
    container: 'border-l-4 border-l-yellow-500/60 bg-yellow-500/10 text-yellow-900 dark:text-yellow-100',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border border-yellow-500/20',
    label: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    container: 'border-l-4 border-l-blue-500/60 bg-blue-500/10 text-blue-900 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border border-blue-500/20',
    label: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    container: 'border-l-4 border-l-green-500/60 bg-green-500/10 text-green-900 dark:text-green-100',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border border-green-500/20',
    label: 'text-green-700 dark:text-green-300',
  },
};

const iconMap = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export function Alert({ type = 'info', children, className = '' }: AlertProps) {
  const styles = alertStyles[type];
  const Icon = iconMap[type];

  return (
    <div className={`rounded-lg ${styles.border} ${styles.container} p-4 my-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} aria-hidden="true" />
        <div className="flex-1 text-sm leading-relaxed max-w-none [&>p]:my-0 [&>strong]:font-semibold">
          {children}
        </div>
      </div>
    </div>
  );
}
