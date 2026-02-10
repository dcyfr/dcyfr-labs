/**
 * ESLint Rule: no-hardcoded-spacing
 *
 * Detects hardcoded Tailwind spacing classes and suggests using design tokens instead.
 *
 * Examples of violations:
 * - className="space-y-8"         → Use SPACING.section
 * - className="gap-6"             → Use SPACING.content
 * - className="mb-4 mt-2"         → Use SPACING tokens
 * - className={`p-${size}`}       → Use spacing() helper
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded spacing values, require SPACING design tokens',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedSpacing: 'Use SPACING tokens instead of hardcoded "{{value}}". See docs/design/DESIGN_TOKEN_USAGE_GUIDE.md',
      hardcodedDynamicSpacing: 'Use spacing() helper for dynamic spacing values instead of "{{value}}"',
    },
    schema: [],
  },

  create(context) {
    // Patterns to detect hardcoded spacing
    const hardcodedPatterns = [
      // Vertical spacing
      /space-y-\d+/,
      /space-y-\d+\.\d+/,

      // Gap
      /gap-\d+/,
      /gap-x-\d+/,
      /gap-y-\d+/,

      // Padding
      /\bp-\d+/,
      /px-\d+/,
      /py-\d+/,
      /pt-\d+/,
      /pb-\d+/,
      /pl-\d+/,
      /pr-\d+/,

      // Margin
      /\bm-\d+/,
      /mx-\d+/,
      /my-\d+/,
      /mt-\d+/,
      /mb-\d+/,
      /ml-\d+/,
      /mr-\d+/,
    ];

    // Pattern for dynamic template literals (e.g., `gap-${size}`)
    const dynamicPattern = /(space-y-|gap-|p-|m-|mb-|mt-|mx-|my-|px-|py-)\$\{/;

    function checkValue(node, value) {
      if (!value || typeof value !== 'string') return;

      // Check for hardcoded spacing
      for (const pattern of hardcodedPatterns) {
        if (pattern.test(value)) {
          context.report({
            node,
            messageId: 'hardcodedSpacing',
            data: { value: value.match(pattern)[0] },
          });
          return;
        }
      }

      // Check for dynamic spacing without spacing() helper
      if (dynamicPattern.test(value)) {
        context.report({
          node,
          messageId: 'hardcodedDynamicSpacing',
          data: { value: value.substring(0, 50) + '...' },
        });
      }
    }

    return {
      // JSX className attribute
      JSXAttribute(node) {
        if (node.name.name === 'className') {
          // String literal: className="space-y-8"
          if (node.value && node.value.type === 'Literal') {
            checkValue(node, node.value.value);
          }

          // JSX expression: className={`gap-${size}`}
          if (node.value && node.value.type === 'JSXExpressionContainer') {
            const expression = node.value.expression;

            // Template literal
            if (expression.type === 'TemplateLiteral') {
              const quasi = expression.quasis.map(q => q.value.raw).join('${...}');
              checkValue(node, quasi);
            }

            // String concatenation
            if (expression.type === 'BinaryExpression' && expression.operator === '+') {
              // Simplistic check for string concatenation
              if (expression.left.type === 'Literal') {
                checkValue(node, expression.left.value);
              }
              if (expression.right.type === 'Literal') {
                checkValue(node, expression.right.value);
              }
            }
          }
        }
      },
    };
  },
};
