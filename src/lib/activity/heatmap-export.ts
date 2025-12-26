/**
 * Activity Heatmap Export Utilities
 *
 * Provides functionality to export heatmap visualizations as images.
 * Supports PNG format with customizable filenames and quality settings.
 */

import html2canvas from "html2canvas";

// ============================================================================
// TYPES
// ============================================================================

export interface ExportHeatmapOptions {
  /** Element to export (should be the heatmap container) */
  element: HTMLElement;
  /** Filename without extension (default: "activity-heatmap-YYYY-MM-DD") */
  filename?: string;
  /** Image format (currently only PNG supported) */
  format?: "png";
  /** PNG quality (0-1, default: 1.0 for maximum quality) */
  quality?: number;
  /** Background color (default: transparent for PNG) */
  backgroundColor?: string | null;
  /** Scale multiplier for higher resolution (default: 2 for retina) */
  scale?: number;
}

export interface ExportResult {
  /** Whether the export succeeded */
  success: boolean;
  /** Error message if export failed */
  error?: string;
  /** Generated filename */
  filename?: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate default filename with current date
 *
 * @example
 * ```ts
 * generateDefaultFilename() // "activity-heatmap-2025-12-25"
 * ```
 */
export function generateDefaultFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `activity-heatmap-${year}-${month}-${day}`;
}

/**
 * Download data URL as file
 *
 * Creates a temporary anchor element to trigger browser download.
 *
 * @param dataUrl - Data URL from canvas.toDataURL()
 * @param filename - Filename with extension
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// ============================================================================
// EXPORT FUNCTION
// ============================================================================

/**
 * Export heatmap element as PNG image
 *
 * Uses html2canvas to convert the DOM element to a canvas,
 * then downloads as PNG file.
 *
 * Features:
 * - High-resolution export (2x scale for retina displays)
 * - Preserves colors and styling
 * - Transparent background by default
 * - Auto-generated filename with date
 *
 * @param options - Export configuration
 * @returns Promise resolving to export result
 *
 * @example
 * ```tsx
 * const heatmapRef = useRef<HTMLDivElement>(null);
 *
 * const handleExport = async () => {
 *   if (!heatmapRef.current) return;
 *
 *   const result = await exportHeatmapAsImage({
 *     element: heatmapRef.current,
 *     filename: "my-activity-2025",
 *     quality: 1.0,
 *   });
 *
 *   if (!result.success) {
 *     console.error(result.error);
 *   }
 * };
 * ```
 */
export async function exportHeatmapAsImage(
  options: ExportHeatmapOptions
): Promise<ExportResult> {
  const {
    element,
    filename = generateDefaultFilename(),
    format = "png",
    quality = 1.0,
    backgroundColor = null,
    scale = 2,
  } = options;

  try {
    // Validate element
    if (!element) {
      return {
        success: false,
        error: "Element not found or not mounted",
      };
    }

    // Convert element to canvas using html2canvas
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale,
      useCORS: true,
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      // Ensure proper rendering of SVG elements
      foreignObjectRendering: true,
      // Improve text rendering
      allowTaint: true,
    });

    // Convert canvas to data URL
    let dataUrl: string;
    const fullFilename = `${filename}.${format}`;

    if (format === "png") {
      dataUrl = canvas.toDataURL("image/png", quality);
    } else {
      return {
        success: false,
        error: `Unsupported format: ${format}`,
      };
    }

    // Trigger download
    downloadDataUrl(dataUrl, fullFilename);

    return {
      success: true,
      filename: fullFilename,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error during export";

    console.error("Heatmap export failed:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
