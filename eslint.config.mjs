import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Design System Enforcement Rules
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Warn about hardcoded container widths - should use getContainerClasses()
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|prose)/]",
          message: "Use getContainerClasses() from @/lib/design-tokens instead of hardcoded max-w-* classes for page containers. See /docs/design/QUICK_START.md",
        },
        {
          selector: "Literal[value=/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl).*font-(bold|semibold|medium)/]",
          message: "Use TYPOGRAPHY tokens from @/lib/design-tokens instead of hardcoded font classes for headings. See /docs/design/QUICK_START.md",
        },
        {
          selector: "Literal[value=/transition-all.*hover:shadow-(sm|md|lg|xl|2xl)/]",
          message: "Use HOVER_EFFECTS tokens from @/lib/design-tokens instead of hardcoded hover effects. See /docs/design/QUICK_START.md",
        },
      ],
    },
  },
  {
    // Exclude shadcn/ui components - they use their own design system
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    // Exclude design token definitions - they define the patterns
    files: ["src/lib/design-tokens.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    // Exclude loading skeletons - they mirror component structure
    files: ["src/**/*loading.tsx", "src/**/*skeleton.tsx"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];

export default eslintConfig;
