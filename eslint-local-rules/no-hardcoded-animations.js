/**
 * ESLint Rule: no-hardcoded-animations
 *
 * Detects hardcoded Tailwind animation/transition utility classes and suggests
 * using ANIMATION_CONSTANTS from @/lib/design-tokens.
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded animation and transition utility classes',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedAnimation:
        'Use ANIMATION_CONSTANTS from @/lib/design-tokens instead of hardcoded "{{value}}".',
    },
    schema: [],
  },

  create(context) {
    const hardcodedAnimationPattern =
      /(^|\s)(animate-[^\s]+|transition(?:-[^\s]+)?|duration-[^\s]+|ease-[^\s]+|delay-[^\s]+)(?=\s|$)/;

    function checkValue(node, value) {
      if (!value || typeof value !== 'string') return;
      const match = value.match(hardcodedAnimationPattern);
      if (!match) return;

      context.report({
        node,
        messageId: 'hardcodedAnimation',
        data: { value: match[2] },
      });
    }

    function checkExpression(node, expression) {
      if (expression.type === 'TemplateLiteral') {
        const quasi = expression.quasis.map((q) => q.value.raw).join('${...}');
        checkValue(node, quasi);

        for (const expr of expression.expressions) {
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            checkValue(node, expr.value);
          }
        }

        return;
      }

      if (expression.type === 'BinaryExpression' && expression.operator === '+') {
        if (expression.left.type === 'Literal') {
          checkValue(node, expression.left.value);
        }
        if (expression.right.type === 'Literal') {
          checkValue(node, expression.right.value);
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;

        if (node.value?.type === 'Literal') {
          checkValue(node, node.value.value);
        } else if (node.value?.type === 'JSXExpressionContainer') {
          checkExpression(node, node.value.expression);
        }
      },
    };
  },
};
