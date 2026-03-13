/**
 * ESLint Rule: no-hardcoded-inline-styles
 *
 * Detects hardcoded inline style values for color, spacing, and typography
 * properties and suggests using design tokens / CSS variables instead.
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded inline style values for tokenized properties',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedInlineStyle:
        'Use design tokens/CSS variables for inline style "{{property}}: {{value}}" instead of hardcoded values.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowProperties: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          allowValuePatterns: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options?.[0] ?? {};
    const allowProperties = new Set(options.allowProperties ?? []);
    const allowValuePatterns = (options.allowValuePatterns ?? [])
      .map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const colorProps = new Set([
      'color',
      'background',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
      'textDecorationColor',
      'fill',
      'stroke',
    ]);

    const spacingProps = new Set([
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'padding',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'gap',
      'rowGap',
      'columnGap',
    ]);

    const typographyProps = new Set([
      'fontSize',
      'fontWeight',
      'lineHeight',
      'letterSpacing',
      'fontFamily',
    ]);

    const namedColorPattern =
      /^(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|teal|cyan|magenta)$/i;
    const colorValuePattern = /^(#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\(|hsla?\()/i;
    const spacingValuePattern = /^-?(?:\d+|\d*\.\d+)(px|rem|em|%|vh|vw|svh|svw)$/i;
    const typographyValuePattern = /^-?(?:\d+|\d*\.\d+)(px|rem|em|%)$/i;

    function getPropertyName(propertyNode) {
      if (propertyNode.type !== 'Property') return null;
      if (propertyNode.computed) return null;

      if (propertyNode.key.type === 'Identifier') return propertyNode.key.name;
      if (propertyNode.key.type === 'Literal' && typeof propertyNode.key.value === 'string') {
        return propertyNode.key.value;
      }

      return null;
    }

    function extractLiteralValue(valueNode) {
      if (!valueNode) return null;

      if (valueNode.type === 'Literal') {
        return valueNode.value;
      }

      if (valueNode.type === 'TemplateLiteral' && valueNode.expressions.length === 0) {
        return valueNode.quasis.map((q) => q.value.raw).join('');
      }

      return null;
    }

    function isPropertyTracked(property) {
      return (
        colorProps.has(property) || spacingProps.has(property) || typographyProps.has(property)
      );
    }

    function isAllowedValue(value) {
      if (typeof value !== 'string') return false;

      const normalized = value.trim();
      if (
        normalized === '0' ||
        normalized === '0px' ||
        normalized === 'auto' ||
        normalized === 'inherit' ||
        normalized === 'unset' ||
        normalized === 'initial' ||
        normalized === 'normal' ||
        normalized === 'transparent' ||
        normalized === 'currentColor'
      ) {
        return true;
      }

      if (
        normalized.startsWith('var(') ||
        normalized.startsWith('calc(') ||
        normalized.startsWith('clamp(') ||
        normalized.startsWith('env(')
      ) {
        return true;
      }

      return allowValuePatterns.some((pattern) => pattern.test(normalized));
    }

    function isHardcodedValue(property, value) {
      if (typeof value === 'number') {
        return value !== 0;
      }

      if (typeof value !== 'string') return false;
      if (isAllowedValue(value)) return false;

      if (colorProps.has(property)) {
        return colorValuePattern.test(value) || namedColorPattern.test(value);
      }

      if (spacingProps.has(property)) {
        return spacingValuePattern.test(value);
      }

      if (typographyProps.has(property)) {
        return typographyValuePattern.test(value) || /^\d+$/.test(value);
      }

      return false;
    }

    function reportViolation(node, property, value) {
      const valueText = typeof value === 'string' ? value : String(value);
      context.report({
        node,
        messageId: 'hardcodedInlineStyle',
        data: {
          property,
          value: valueText,
        },
      });
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        if (node.value?.type !== 'JSXExpressionContainer') return;

        const expression = node.value.expression;
        if (expression.type !== 'ObjectExpression') return;

        for (const prop of expression.properties) {
          const propertyName = getPropertyName(prop);
          if (!propertyName) continue;
          if (propertyName.startsWith('--')) continue;
          if (allowProperties.has(propertyName)) continue;
          if (!isPropertyTracked(propertyName)) continue;

          const value = extractLiteralValue(prop.value);
          if (value === null || value === undefined) continue;

          if (isHardcodedValue(propertyName, value)) {
            reportViolation(prop, propertyName, value);
          }
        }
      },
    };
  },
};
