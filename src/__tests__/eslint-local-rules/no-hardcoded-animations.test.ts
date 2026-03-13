import { RuleTester } from 'eslint';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rule = require('../../../eslint-local-rules/no-hardcoded-animations.js');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run('no-hardcoded-animations', rule, {
  valid: [
    {
      code: 'const Comp = () => <div className={ANIMATION_CONSTANTS.transition.all} />;',
    },
    {
      code: 'const Comp = () => <div className="text-foreground" />;',
    },
    {
      code: 'const Comp = ({ cls }) => <div className={cls} />;',
    },
  ],
  invalid: [
    {
      code: 'const Comp = () => <div className="transition-all duration-300 ease-in-out" />;',
      errors: [{ messageId: 'hardcodedAnimation' }],
    },
    {
      code: 'const Comp = () => <div className="animate-pulse" />;',
      errors: [{ messageId: 'hardcodedAnimation' }],
    },
    {
      code: 'const Comp = () => <div className={`group ${"delay-150"}`} />;',
      errors: [{ messageId: 'hardcodedAnimation' }],
    },
  ],
});
