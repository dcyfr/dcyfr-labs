import { RuleTester } from 'eslint';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rule = require('../../../eslint-local-rules/no-hardcoded-inline-styles.js');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run('no-hardcoded-inline-styles', rule, {
  valid: [
    {
      code: 'const Comp = () => <div style={{ color: "var(--semantic-text-primary)" }} />;',
    },
    {
      code: 'const Comp = ({ color }) => <div style={{ color }} />;',
    },
    {
      code: 'const Comp = () => <div style={{ marginTop: 0, padding: "0px" }} />;',
    },
    {
      code: 'const Comp = () => <div style={{ fontSize: "14px" }} />;',
      options: [{ allowProperties: ['fontSize'] }],
    },
  ],
  invalid: [
    {
      code: 'const Comp = () => <div style={{ color: "#ff0000" }} />;',
      errors: [{ messageId: 'hardcodedInlineStyle' }],
    },
    {
      code: 'const Comp = () => <div style={{ marginTop: "16px", gap: "0.5rem" }} />;',
      errors: [{ messageId: 'hardcodedInlineStyle' }, { messageId: 'hardcodedInlineStyle' }],
    },
    {
      code: 'const Comp = () => <h2 style={{ fontSize: "24px", fontWeight: 700 }} />;',
      errors: [{ messageId: 'hardcodedInlineStyle' }, { messageId: 'hardcodedInlineStyle' }],
    },
  ],
});
