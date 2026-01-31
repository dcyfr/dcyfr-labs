'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockCopyButtonProps {
  code: string;
  className?: string;
}

/**
 * Copy button for code blocks with visual feedback
 *
 * Features:
 * - One-click copy to clipboard
 * - Visual feedback (check icon on success)
 * - Accessible (keyboard support, ARIA labels)
 * - Touch-friendly (44x44px minimum)
 * - Smooth transitions
 *
 * Usage:
 * ```tsx
 * <CodeBlockCopyButton code={codeString} />
 * ```
 */
export function CodeBlockCopyButton({ code, className = '' }: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        absolute top-2 right-2
        touch-target
        flex items-center gap-1.5
        px-2.5 py-1.5
        rounded-md
        bg-background/80 hover:bg-background
        border border-border
        text-muted-foreground hover:text-foreground
        text-sm font-medium
        transition-all duration-150
        backdrop-blur-sm
        ${className}
      `}
      aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
      type="button"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
          <span className="sr-only">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Copy</span>
        </>
      )}
    </button>
  );
}
