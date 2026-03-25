/**
 * StaticDiagram — embeds a pre-generated diagram HTML file in an iframe.
 *
 * Usage in MDX:
 *   <StaticDiagram src="/diagrams/auth-flow-v1.html" alt="OAuth 2.0 flow" />
 */

interface StaticDiagramProps {
  /** Path to the pre-generated diagram HTML file (e.g. /diagrams/auth-flow-v1.html) */
  src: string;
  /** Semantic title for the iframe (screen readers, browser tab) */
  title?: string;
  /** Visible caption rendered below the diagram */
  alt?: string;
  /** CSS width value. Defaults to 100% */
  width?: string | number;
  /** CSS height value. Defaults to auto (aspect-ratio controls actual height) */
  height?: string | number;
  /** Additional CSS class names for the wrapping figure element */
  className?: string;
}

export function StaticDiagram({
  src,
  title = 'Diagram',
  alt,
  width = '100%',
  height = 'auto',
  className = '',
}: StaticDiagramProps) {
  return (
    <figure className={`diagram-container ${className}`.trim()}>
      <iframe
        src={src}
        title={title}
        aria-label={alt || title}
        width={width}
        height={height}
        style={{
          border: 'none',
          display: 'block',
          aspectRatio: '16 / 9',
          maxWidth: '100%',
        }}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
      {alt && <figcaption className="text-sm text-muted-foreground mt-2">{alt}</figcaption>}
    </figure>
  );
}
