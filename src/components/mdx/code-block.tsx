'use client';

import { CodeBlockCopyButton } from './code-block-copy-button';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  raw?: string; // Raw code string for copy button
}

/**
 * Enhanced code block component with modern overflow handling
 *
 * Features:
 * - Horizontal scroll (no word wrap)
 * - Visual overflow indicators (fade gradients)
 * - Copy button with feedback
 * - Optional filename header
 * - Optional line numbers
 * - Touch-friendly mobile scrolling
 * - Accessible keyboard navigation
 *
 * Best Practices Implemented:
 * 1. Horizontal scroll preserves code structure
 * 2. Smooth mobile scrolling (-webkit-overflow-scrolling)
 * 3. Visual cues for overflow (gradients)
 * 4. Copy functionality (avoid manual selection)
 * 5. Semantic HTML (figure/figcaption when filename present)
 *
 * Usage:
 * ```tsx
 * <CodeBlock language="typescript" filename="example.ts">
 *   {children}
 * </CodeBlock>
 * ```
 */
export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
  highlightLines = [],
  raw,
}: CodeBlockProps) {
  const hasHeader = Boolean(filename || language);

  // Wrap in figure if filename is provided (semantic HTML)
  const Wrapper = filename ? 'figure' : 'div';
  const codeContent = (
    <div className="relative group">
      {/* Copy button - shown on hover */}
      {raw && <CodeBlockCopyButton code={raw} />}

      {/* Code block with modern overflow handling */}
      <pre
        data-code-block-header={hasHeader ? 'true' : undefined}
        className={`
          relative
          overflow-x-auto overflow-y-hidden
          whitespace-pre
          max-w-full
          ${showLineNumbers ? 'pl-12' : ''}
        `}
        style={{
          WebkitOverflowScrolling: 'touch', // Smooth iOS scroll
        }}
      >
        <code
          className={language ? `language-${language}` : undefined}
          data-line-numbers={showLineNumbers ? 'true' : undefined}
        >
          {children}
        </code>

        {/* Fade gradient indicator (right edge) */}
        <div
          className="
            pointer-events-none
            absolute top-0 right-0 bottom-0
            w-12
            bg-gradient-to-r from-transparent to-background/80
            opacity-0 group-hover:opacity-100
            transition-opacity duration-150
          "
          aria-hidden="true"
        />
      </pre>

      {/* Scroll hint for mobile (subtle visual cue) */}
      <div
        className="
          absolute bottom-2 right-2
          pointer-events-none
          text-xs text-muted-foreground/50
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          sm:hidden
        "
        aria-hidden="true"
      >
        ← Scroll →
      </div>
    </div>
  );

  // With filename: use semantic figure/figcaption
  if (filename) {
    return (
      <Wrapper className="my-6" role="figure" aria-label={`Code: ${filename}`}>
        <figcaption
          className="
            px-4 py-2
            bg-muted/50
            border border-b-0 border-border
            rounded-t-lg
            text-sm font-medium text-muted-foreground
            flex items-center justify-between
          "
        >
          <span className="flex items-center gap-2">
            {language && (
              <span className="text-xs uppercase tracking-wider opacity-70">{language}</span>
            )}
            <span>{filename}</span>
          </span>
        </figcaption>
        {codeContent}
      </Wrapper>
    );
  }

  // Without filename: simple div wrapper
  return <div className="my-6">{codeContent}</div>;
}
