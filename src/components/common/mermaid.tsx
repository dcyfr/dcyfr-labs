"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

/**
 * Mermaid Diagram Component
 * 
 * Renders Mermaid diagrams with theme-aware styling and modern aesthetics.
 * Features rounded nodes, softer edges, and smooth animations.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.chart - Mermaid diagram syntax
 * @param {string} [props.id] - Optional unique ID for the diagram
 * @param {string} [props.className] - Optional additional CSS classes
 * 
 * @example
 * ```tsx
 * <Mermaid chart={`
 *   graph LR
 *     A[Client] --> B[Server]
 *     B --> C[Database]
 * `} />
 * ```
 * 
 * @features
 * - Theme-aware: Automatically detects and uses light/dark theme
 * - Modern styling: Rounded nodes, soft shadows, smooth transitions
 * - Responsive: Diagrams scale to container width
 * - Accessible: Proper ARIA labels and semantic HTML
 * - Error handling: Graceful fallback for invalid syntax
 * - Dynamic updates: Re-renders when theme changes
 * 
 * @see https://mermaid.js.org/intro/ for Mermaid syntax
 */
export function Mermaid({ 
  chart, 
  id,
  className 
}: { 
  chart: string; 
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // Detect theme preference
    const htmlElement = document.documentElement;
    const isDarkClass = htmlElement.classList.contains('dark');
    const dataTheme = htmlElement.getAttribute('data-theme');
    
    // Determine if we're in dark mode
    // Priority: data-theme attribute > resolvedTheme > .dark class
    let useDarkTheme = false;
    if (dataTheme) {
      useDarkTheme = dataTheme === 'dark';
    } else if (resolvedTheme) {
      useDarkTheme = resolvedTheme === 'dark';
    } else {
      useDarkTheme = isDarkClass;
    }

    // Initialize Mermaid with built-in themes
    mermaid.initialize({
      startOnLoad: false,
      theme: useDarkTheme ? "dark" : "neutral",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: 14,
      flowchart: {
        curve: 'basis',
        padding: 20,
        nodeSpacing: 80,
        rankSpacing: 100,
        htmlLabels: true,
        useMaxWidth: true,
        wrappingWidth: 300,
      },
      sequence: {
        actorMargin: 50,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        useMaxWidth: true,
      },
    });

    async function renderDiagram() {
      if (!ref.current) return;

      try {
        setError(null);
        const { svg } = await mermaid.render(
          id || `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          chart
        );
        ref.current.innerHTML = svg;
        setRendered(true);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    }

    renderDiagram();
  }, [chart, id, resolvedTheme]);

  if (error) {
    return (
      <div 
        className="my-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10"
        role="alert"
        aria-live="polite"
      >
        {/* eslint-disable-next-line no-restricted-syntax */}
        <p className="text-sm font-semibold text-destructive mb-2">
          Mermaid Diagram Error
        </p>
        <pre className="text-xs text-muted-foreground overflow-x-auto">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "mermaid-container",
        !rendered && "min-h-[200px] animate-pulse",
        className
      )}
    >
      <div 
        ref={ref} 
        className="flex justify-center items-center"
        role="img"
        aria-label="Mermaid diagram"
      />
    </div>
  );
}
