/**
 * DCYFR Labs Token Provider Implementation
 *
 * Provides design tokens from dcyfr-labs design system to Design Token MCP.
 * Implements TokenProvider interface from @dcyfr/ai/mcp.
 */

import type { TokenProvider, TokenCategory } from '@dcyfr/ai/mcp';
import {
  SPACING,
  SPACING_VALUES,
  TYPOGRAPHY,
  CONTAINER_WIDTHS,
  BREAKPOINTS,
} from '@/lib/design-tokens';

/**
 * DCYFR Labs design token provider
 */
export class DcyfrLabsTokenProvider implements TokenProvider {
  /**
   * Get all token categories with patterns and descriptions
   */
  getTokenCategories(): TokenCategory[] {
    return [
      {
        name: 'spacing',
        tokens: {
          ...SPACING,
          ...SPACING_VALUES,
        },
        patterns: [
          /gap-\d+/,
          /space-[xy]-\d+/,
          /p[trblxy]?-\d+/,
          /m[trblxy]?-\d+/,
          /w-\d+/,
          /h-\d+/,
        ],
        description: 'Spacing tokens for padding, margin, gaps, and sizes',
      },
      {
        name: 'typography',
        tokens: TYPOGRAPHY as Record<string, string | number>,
        patterns: [
          /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
          /font-(normal|medium|semibold|bold)/,
          /leading-\d+/,
          /tracking-\w+/,
        ],
        description: 'Typography tokens for text styling',
      },
      {
        name: 'containers',
        tokens: CONTAINER_WIDTHS as Record<string, string | number>,
        patterns: [/max-w-\w+/, /min-w-\w+/],
        description: 'Container width tokens',
      },
      {
        name: 'breakpoints',
        tokens: BREAKPOINTS as Record<string, string | number>,
        patterns: [/(sm|md|lg|xl|2xl):/],
        description: 'Responsive breakpoint tokens',
      },
    ];
  }

  /**
   * Get spacing tokens (for numeric value suggestions)
   */
  getSpacingTokens(): Record<string, number> {
    // Convert SPACING_VALUES to numeric
    return {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 6,
      xl: 8,
    };
  }

  /**
   * Get import statement for tokens (used in suggestions)
   */
  getTokenImportStatement(): string {
    return "Import design tokens: import { SPACING, TYPOGRAPHY, CONTAINER_WIDTHS } from '@/lib/design-tokens'";
  }

  /**
   * Get documentation URL for design tokens
   */
  getDocumentationUrl(): string {
    return 'docs/ai/design-system.md';
  }
}
